import axios from "../axiosCustomize";

export const getNotificationByAccountId = async () => {
    // Lấy thông tin người dùng từ Session Storage
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const token = userInfo.accessToken;
    // Kiểm tra nếu userInfo không tồn tại hoặc không có accountId
    if (!userInfo || !userInfo.accountId || !token) {
        throw new Error('Không tìm thấy accountId trong Session Storage');
    }

    const accountId = userInfo.accountId;
    const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    };
    
    return await axios.get(`api/Notification/getAllNoti/${accountId}`, config);
}

export const markNotificationsAsRead = async (accountId) => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const token = userInfo.accessToken;
    
    if (!userInfo || !token) {
        throw new Error('Không tìm thấy thông tin xác thực');
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const data = {
        accountId: accountId
    };
    
    return await axios.patch('api/Notification/isRead', data, config);
};

