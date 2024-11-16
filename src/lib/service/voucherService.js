import axios from "../axiosCustomize"

const getVoucher = async (voucherData) => {
  const params = {
    barId: voucherData.barId,
    bookingDate: voucherData.bookingDate,
    bookingTime: voucherData.bookingTime,
    voucherCode: voucherData.voucherCode
  };

  return await axios.get(`api/Voucher/getOneVoucher`, { 
    params: params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export {
  getVoucher
}
