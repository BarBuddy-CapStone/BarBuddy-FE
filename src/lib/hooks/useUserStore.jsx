import { create } from "zustand";
import { logout } from "../service/authenService";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { unlinkDeviceToken } from "../service/notificationService";

const useAuthStore = create((set, get) => {
  // Hàm helper để set cookie cho Customer
  const setCookieSecurely = (name, value) => {
    const isHttps = window.location.protocol === "https:";

    Cookies.set(name, value, {
      expires: 1,
      path: "/",
      secure: isHttps,
      sameSite: "strict",
    });
  };

  // Hàm helper để lấy thông tin user từ storage phù hợp
  const getUserFromStorage = () => {
    const userFromSession = sessionStorage.getItem("userInfo");
    const userFromCookie = Cookies.get("userInfo");

    if (userFromCookie) {
      try {
        return JSON.parse(userFromCookie);
      } catch (error) {
        console.error("Error parsing cookie:", error);
        return {};
      }
    }
    if (userFromSession) {
      try {
        return JSON.parse(userFromSession);
      } catch (error) {
        console.error("Error parsing session:", error);
        return {};
      }
    }
    return {};
  };

  const getTokenFromStorage = () => {
    const tokenFromSession = sessionStorage.getItem("authToken");
    const tokenFromCookie = Cookies.get("authToken");
    return tokenFromCookie || tokenFromSession || null;
  };

  // Thêm event listener để lắng nghe thay đổi từ tab khác
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      // Khi cookie thay đổi
      if (e.key === null) {
        // null key indicates cookie change
        const token = getTokenFromStorage();
        const userInfo = getUserFromStorage();
        set({
          isLoggedIn: !!token,
          token,
          userInfo,
        });
      }
    });
  }

  return {
    isLoggedIn: !!getTokenFromStorage(),
    userInfo: getUserFromStorage(),
    token: getTokenFromStorage(),
    login: (token, userInfo) => {
      // Decode token để lấy role
      const decodedToken = jwtDecode(token);
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      //console.log('Role from token:', role); // Debug

      const isCustomer = role === "CUSTOMER";

      if (isCustomer) {
        //console.log('Saving to cookie...'); // Debug
        setCookieSecurely("authToken", token);
        setCookieSecurely("userInfo", JSON.stringify(userInfo));
      } else {
        console.log("Saving to session..."); // Debug
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      set({ isLoggedIn: true, userInfo, token });
      if (isCustomer) {
        window.dispatchEvent(new Event("storage"));
      }
    },
    logout: async () => {
      try {
        const userInfo = get().userInfo;
        const token = get().token;

        // Kiểm tra role từ token
        const decodedToken = jwtDecode(token);
        const role =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        const isCustomer = role === "CUSTOMER";

        // Xử lý FCM token cho customer
        if (isCustomer) {
          const fcmToken = localStorage.getItem("fcmToken");
          if (fcmToken) {
            try {
              await unlinkDeviceToken(fcmToken);
              localStorage.removeItem("fcmToken");
            } catch (error) {
              console.error("Error unlinking device token:", error);
            }
          }
        }

        // Gọi API logout
        if (userInfo?.refreshToken) {
          await logout(userInfo.refreshToken);
        }

        // Clear data
        get().clearAuthData();
      } catch (error) {
        console.error("Logout error:", error);
        get().clearAuthData();
      }
    },
    updateToken: (newToken) => {
      sessionStorage.setItem("authToken", newToken);
      set({ token: newToken });
    },
    setUserInfo: (info) => set({ userInfo: info }),
    setToken: (token) => set({ token }),
    updateUserInfo: (newInfo) =>
      set((state) => ({
        userInfo: { ...state.userInfo, ...newInfo },
      })),
    clearAuthData: () => {
      Cookies.remove("authToken", { path: "/" });
      Cookies.remove("userInfo", { path: "/" });
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userInfo");

      set({ isLoggedIn: false, userInfo: {}, token: null });
      window.dispatchEvent(new Event("storage"));
    },
  };
});

export default useAuthStore;
