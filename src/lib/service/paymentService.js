import axios from "../axiosCustomize"

const paymentWithDrink = async (data, token) => {
  var config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return await axios.post('api/Booking/booking-drink', data, config)
}

const getPaymentDetail = async (apiId, token) => {
  var config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return await axios.get(`api/v1/Payment/payment-detail/${apiId}`, config);
}


export {
  paymentWithDrink,
  getPaymentDetail
}