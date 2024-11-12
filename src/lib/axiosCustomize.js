import axios from "axios";

const instance = axios.create({
  // baseURL: {process.env.BaseURLocal},  // Đảm bảo sử dụng HTTPS
  // // serverURL: "https://barbuddy.id.vn/"
  baseURL: import.meta.env.VITE_BASE_URL,  // Sử dụng import.meta.env để truy cập biến môi trường
});

export default instance;
