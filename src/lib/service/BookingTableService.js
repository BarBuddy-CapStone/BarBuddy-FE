import axios from "../axiosCustomize";

const filterBookingTable = async (params) => {
  return await axios.get(`api/bookingTable/filter`, {
    params: params,
  });
};

const boookingtableNow = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // Thêm header này
    },
  };
  return await axios.post(`api/Booking/booking-table`, JSON.stringify(data), config);
};

export { filterBookingTable, boookingtableNow };
