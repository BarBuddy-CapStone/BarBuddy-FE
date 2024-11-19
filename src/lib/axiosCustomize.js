import axios from "axios";
import { refreshToken } from "./service/authenService";
import useAuthStore from "./hooks/useUserStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
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
        // Thực hiện refresh token
        const currentToken = sessionStorage.getItem('authToken');
        const response = await refreshToken(currentToken);
        const newToken = response.data.data.tokens;

        // Cập nhật token mới vào sessionStorage và store
        sessionStorage.setItem('authToken', newToken);
        useAuthStore.getState().login(newToken, useAuthStore.getState().userInfo);

        // Cập nhật token mới vào header của request cũ
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        
        // Thực hiện lại request cũ với token mới
        return instance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
