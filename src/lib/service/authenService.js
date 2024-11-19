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

export const refreshToken = async (currentToken) => {
  try {
    if (!currentToken) {
      throw new Error('No token found');
    }
    const response = await axios.post("api/authen/refresh-token", currentToken);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async (token) => {
  try {
    // Chỉ gọi API logout
    return await axios.post("api/authen/logout", token);
  } catch (error) {
    throw error;
  }
};

