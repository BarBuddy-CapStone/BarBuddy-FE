import axios from "axios";
import useAuthStore from "./hooks/useUserStore";
import { refreshToken } from "./service/authenService";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ cả cookie (cho CUSTOMER) và session storage (cho role hệ thống)
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor để handle token hết hạn
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refreshToken từ userInfo
        const userInfo = useAuthStore.getState().userInfo;
        
        // Kiểm tra nếu không có refreshToken
        if (!userInfo?.refreshToken) {
          useAuthStore.getState().clearAuthData();
          window.location.href = '/';
          return Promise.reject(error);
        }

        const response = await refreshToken(userInfo.refreshToken);
        const { accessToken } = response.data.data;

        // Cập nhật token mới vào store
        useAuthStore.getState().updateToken(accessToken);

        // Cập nhật token mới vào header của request cũ
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        // Thực hiện lại request cũ với token mới
        return instance(originalRequest);
      } catch (refreshError) {
        // Khi refresh token thất bại, đảm bảo xóa hết data
        useAuthStore.getState().clearAuthData();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;