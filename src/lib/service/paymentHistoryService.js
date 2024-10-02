import axios from '../axiosCustomize'; // Import your customized axios instance

class PaymentHistoryService {
  static async getAllPayments(params) {
    return await axios.get('/api/PaymentHistory', { params });
  }

  static async getBarBranches() {
    return await axios.get('/api/Bar/admin/barmanager');
  }
}

export default PaymentHistoryService;
