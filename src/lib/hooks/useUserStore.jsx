"use client";
import { create } from 'zustand';
import { logout } from '../service/authenService';

const useAuthStore = create((set, get) => {
  const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
  const storedUserInfo = typeof window !== 'undefined' ? sessionStorage.getItem('userInfo') : null;
  
  let initialUserInfo = {};
  try {
    if (storedUserInfo) {
      initialUserInfo = JSON.parse(storedUserInfo);
    }
  } catch (error) {
    console.error("Error parsing JSON userInfo:", error);
  }

  const isLoggedIn = !!storedToken;

  return {
    isLoggedIn,
    userInfo: initialUserInfo,
    token: storedToken,
    login: (token, userInfo) => {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      set({ isLoggedIn: true, userInfo, token });
    },
    updateToken: (newToken) => {
      sessionStorage.setItem('authToken', newToken);
      set({ token: newToken });
    },
    logout: async () => {
      try {
        const userInfo = get().userInfo;
        if (userInfo?.refreshToken) {
          await logout(userInfo.refreshToken);
        }
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        set({ isLoggedIn: false, userInfo: {}, token: null });
      } catch (error) {
        console.error("Logout error:", error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        set({ isLoggedIn: false, userInfo: {}, token: null });
      }
    },
  };
});

export default useAuthStore;
