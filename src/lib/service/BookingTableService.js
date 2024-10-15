import axios from "../axiosCustomize";
import dayjs from "dayjs";

const filterBookingTable = async (params) => {
  try {
    // Đầu tiên, gọi getAllHoldTable để lấy dữ liệu từ memoryCache
    const holdTablesResponse = await getAllHoldTable(params.barId);
    const holdTables = holdTablesResponse.data.data;

    // Sau đó thực hiện filter
    const response = await axios.get(`api/bookingTable/filter`, {
      params: params,
    });

    // Cập nhật trạng thái của các bàn dựa trên dữ liệu từ memoryCache
    if (response.data.statusCode === 200 && response.data.data.bookingTables.length > 0) {
      const filteredDate = dayjs(params.date).format("YYYY-MM-DD");
      const filteredTime = params.time;

      response.data.data.bookingTables[0].tables = response.data.data.bookingTables[0].tables.map(table => {
        const holdInfo = holdTables.find(ht => 
          ht.tableId === table.tableId && 
          dayjs(ht.date).format("YYYY-MM-DD") === filteredDate && 
          ht.time === filteredTime
        );

        if (holdInfo && holdInfo.isHeld) {
          return {
            ...table,
            status: 2, // 2 for held
            isHeld: true,
            holdExpiry: holdInfo.holdExpiry,
            accountId: holdInfo.accountId
          };
        }
        // Nếu không tìm thấy thông tin giữ bàn cho thời gian này, hoặc bàn không được giữ, đặt trạng thái là trống
        return { ...table, status: 1, isHeld: false };
      });
    }

    console.log("Filtered response:", response.data);
    return response;
  } catch (error) {
    console.error("Error in filterBookingTable:", error);
    throw error;
  }
};

const holdTable = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  console.log("Sending holdTable request with data:", data);
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

const getAllHoldTable = async(barId) => {
  const response = await axios.get(`api/bookingTable/getHoldTable/${barId}`);
  console.log("getAllHoldTable response:", response.data);
  return response;
}

const boookingtableNow = async (token, data) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return await axios.post(`api/Booking/booking-table`, JSON.stringify(data), config);
};

export { filterBookingTable, boookingtableNow, holdTable, releaseTable, getAllHoldTable };
