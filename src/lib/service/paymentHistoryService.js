import axios from '../axiosCustomize';

class PaymentHistoryService {
  static async getAllPayments(params) {
    return await axios.get('api/PaymentHistory', { params });
  }

  static async getBarBranches() {
    return await axios.get('api/v1/Bar/admin/barmanager');
  }
}

export default PaymentHistoryService;
