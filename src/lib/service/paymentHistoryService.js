import axios from '../axiosCustomize';

class PaymentHistoryService {
  static async getAllPayments(params) {
    return await axios.get('api/PaymentHistory', { params });
  }

  static async getAllBarsNoPage() {
    return await axios.get('api/v1/Bar/customer/getBarByAdminManager?PageIndex=1&PageSize=100');
  }

  static async getAllPaymentsByCustomerId(accountId, status, pageIndex, pageSize) {
    const params = { Status: status, PageIndex: pageIndex, PageSize: pageSize };
    return await axios.get(`/api/PaymentHistory/${accountId}`, { params });
  }
}

export default PaymentHistoryService;
