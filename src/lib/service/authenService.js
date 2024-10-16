import axios from "../axiosCustomize";

export const login = async (data) => {
  return await axios.post("api/authen/login", data);
};

export const register = async (data) => {
  return await axios.post("api/authen/register", data);
};

export const verifyOtp = async (data) => {
  return await axios.post("api/authen/verify", data);
};

export const googleLogin = async (idToken) => {
  return await axios.post("api/authen/google-login", { idToken });
};

