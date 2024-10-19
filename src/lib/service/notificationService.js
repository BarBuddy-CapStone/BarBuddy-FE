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
    
    return await axios.get(`https://localhost:7069/api/Notification/getAllNoti/${accountId}`, config);
}

