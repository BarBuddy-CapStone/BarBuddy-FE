import axios from "../axiosCustomize";

// Register device token (for non-logged in users)
export const registerDeviceToken = async (deviceToken) => {
  try {
    console.log('Registering device token for guest:', deviceToken);
    const response = await axios.post('/api/Fcm/device-token', {
      deviceToken: deviceToken,
      platform: 'web'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get notifications
export const getNotifications = async (deviceToken) => {
  try {
    console.log('Fetching notifications with token:', deviceToken);
    const response = await axios.get('/api/Fcm/notifications', {
      params: {
        deviceToken: deviceToken
      }
    });
    console.log('Notifications response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Link device token (for logged in users)
export const linkDeviceToken = async (deviceToken) => {
  try {
    //console.log('Linking device token for logged in user:', deviceToken);
    const response = await axios.patch('/api/Fcm/device-token/link', {
      deviceToken: deviceToken,
      isLoginOrLogout: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Unlink device token from account (logout)
export const unlinkDeviceToken = async (deviceToken) => {
  try {
    //console.log('Unlinking device token:', deviceToken);
    const response = await axios.patch('/api/Fcm/device-token/unlink', {
      deviceToken: deviceToken,
      isLoginOrLogout: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark single notification as read
export const markAsRead = async (notificationId, deviceToken) => {
  try {
    const response = await axios.patch(`/api/Fcm/notification/${notificationId}/mark-as-read`, null, {
      params: {
        deviceToken
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (deviceToken) => {
  try {
    const response = await axios.patch('/api/Fcm/notifications/mark-all-as-read', null, {
      params: {
        deviceToken
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

