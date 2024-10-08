import axios from "../axiosCustomize";

const filterBookingTable = async (params) => {
  return await axios.get(`api/bookingTable/filter`, {
    params: params // Truyền các tham số qua query parameters
  });
};

export { filterBookingTable };
