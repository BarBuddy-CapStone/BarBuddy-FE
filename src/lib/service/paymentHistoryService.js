import axios from '../axiosCustomize'; // Import your customized axios instance

class PaymentHistoryService {
  static async getAllPayments(params) {
    try {
      return await axios.get('/api/PaymentHistory', { params });
    } catch (error) {
      throw error;
    }
  }

  static async getBarBranches() {
    try {
      return await axios.get('/api/Bar/admin/barmanager');
    } catch (error) {
      throw error;
    }
  }
}

export default PaymentHistoryService;
