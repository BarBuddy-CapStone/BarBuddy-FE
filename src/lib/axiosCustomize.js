import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7069/",  // Đảm bảo sử dụng HTTPS
  // serverURL: "https://barbuddy.id.vn/"
});

export default instance;
