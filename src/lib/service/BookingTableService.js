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

      console.log("Filtered Date:", filteredDate);
      console.log("Filtered Time:", filteredTime);

      console.log("response.data.data.bookingTables[0].tables", response.data.data.bookingTables[0].tables)
      console.log("holdTables", holdTables)

      
      response.data.data.bookingTables[0].tables = response.data.data.bookingTables[0].tables.map(table => {
        const holdInfo = holdTables.find(ht => 
          ht.tableId === table.tableId && 
          dayjs(ht.date).format("YYYY-MM-DD") === filteredDate && 
          ht.time === filteredTime + ":00"
        );
        console.log("holdInfo:", holdInfo);
        if (holdInfo && holdInfo.isHeld) {
          return {
            ...table,
            status: 2, // 2 for held
            isHeld: true,
            holdExpiry: holdInfo.holdExpiry,
            holderId: holdInfo.accountId,
            date: holdInfo.date,
            time: holdInfo.time,
          };
        }
        console.log("holdInfo", holdInfo)
        console.log("Table khong chon:", table.tableId);
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

const getAllHoldTable = async(barId, date, time) => {
  try {
    const response = await axios.get(`api/bookingTable/getHoldTable/${barId}`, {
      params: { date, time }
    });
    console.log("getAllHoldTable response:", response.data);
    return response;
  } catch (error) {
    console.error("Error in getAllHoldTable:", error);
    throw error;
  }
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
