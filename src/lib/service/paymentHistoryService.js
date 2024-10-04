import axios from '../axiosCustomize';

class PaymentHistoryService {
  static async getAllPayments(params) {
    return await axios.get('api/PaymentHistory', { params });
  }

  static async getBarBranches() {
    return await axios.get('api/v1/Bar/admin/barmanager');
  }

  static async getAllPaymentsByCustomerId(accountId, status, pageIndex, pageSize) {
    const params = { Status: status, PageIndex: pageIndex, PageSize: pageSize };
    return await axios.get(`/api/PaymentHistory/${accountId}`, { params });
  }
}

export default PaymentHistoryService;
