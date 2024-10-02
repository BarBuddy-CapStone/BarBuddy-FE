import axios from '../axiosCustomize';

class AccountService {
    static async getCustomerProfile(accountId) {
        const response = await axios.get(`/api/v1/customer/${accountId}`);
        return response.data;
      }

    static async updateCustomerProfile(accountId, data) {
        const response = await axios.patch(`/api/v1/customer/${accountId}`, data);
        return response.data;
      }

    static async updateCustomerAvatar(accountId, formData) {
        const response = await axios.patch(`/api/v1/customer/avatar/${accountId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export default AccountService;

