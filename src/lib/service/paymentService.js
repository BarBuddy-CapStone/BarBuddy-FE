import axios from "../axiosCustomize"

const payment = async (data) => {
  return await axios.post('api/v1/Payment', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const getPaymentDetail = async (apiId) => {
  return await axios.get(`api/v1/Payment/payment-detail/${apiId}`);
}


export {
  payment,
  getPaymentDetail
}