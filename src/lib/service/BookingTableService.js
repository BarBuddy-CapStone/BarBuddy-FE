import axios from "../axiosCustomize";

const filterBookingTable = async (params) => {
  return await axios.get(`api/bookingTable/filter`, {
    params: params,
  });
};

const holdTable = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return await axios.post(`api/bookingTable/holdTable`, data, config);
};

const releaseTable = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return await axios.post(`api/bookingTable/releaseTable`, data, config);
};

const boookingtableNow = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return await axios.post(`api/Booking/booking-table`, JSON.stringify(data), config);
};

export { filterBookingTable, boookingtableNow, holdTable, releaseTable };
