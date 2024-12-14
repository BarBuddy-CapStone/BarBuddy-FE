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
    return await axios.post("api/authen/logout", JSON.stringify(refreshToken), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};


export const resetPassword = async (email) => {
  try {
    return await axios.post("api/authen/reset-password", JSON.stringify(email), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};

export const verifyResetPasswordOtp = async (data) => {
  try {
    return await axios.post("api/authen/reset-password/verification", JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    return await axios.post("api/authen/reset-password/new-password", JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};

