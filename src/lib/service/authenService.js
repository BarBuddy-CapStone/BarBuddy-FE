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

export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    return await axios.post("api/authen/refresh-token", refreshToken);
  } catch (error) {
    throw error;
  }
};

export const logout = async (refreshToken) => {
  try {
    return await axios.post("api/authen/logout", refreshToken);
  } catch (error) {
    throw error;
  }
};

