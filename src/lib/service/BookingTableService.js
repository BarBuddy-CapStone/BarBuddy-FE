import axios from "../axiosCustomize";
import dayjs from "dayjs";

const filterBookingTable = async (params) => {
  try {
    const queryParams = {
      barId: params.barId,
      tableTypeId: params.tableTypeId,
      date: dayjs(params.date).format("YYYY/MM/DD"),
      time: params.time + ":00"
    };

    console.log("Sending filter request with params:", queryParams);

    const response = await axios.get(`api/bookingTable/filter`, {
      params: queryParams
    });

    console.log("Filter API response:", response.data);
    
    if (response.data.statusCode === 200) {
      if (!response.data.data) {
        console.warn("API returned success but no data");
      }
    } else {
      console.error("API returned non-200 status:", response.data.statusCode);
    }

    return response;
  } catch (error) {
    console.error("Error in filterBookingTable:", error);
    if (error.response) {
      console.error("Server error details:", error.response.data);
    }
    throw error;
  }
};

const holdTable = async (token, data) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    console.log("Sending holdTable request with data:", data);
    const response = await axios.post(`api/bookingTable/holdTable`, data, config);
    return response;
  } catch (error) {
    if (error.response?.data?.statusCode === 400) {
      throw error;
    }
    console.error("Error in holdTable service:", error);
    throw new Error("Failed to hold table");
  }
};

const releaseTable = async (token, data) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    const cleanData = {
      barId: data.barId,
      tableId: data.tableId,
      date: data.date,
      time: data.time
    };
    
    const response = await axios.post(`api/bookingTable/releaseTable`, cleanData, config);
    return response;
  } catch (error) {
    console.error("Error in releaseTable:", error);
    throw error;
  }
};

const releaseTableList = async (token, data) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    
    const cleanData = {
      barId: data.barId,
      date: data.date,
      time: data.time,
      table: data.table.map(t => ({
        tableId: t.tableId,
        time: t.time
      }))
    };
    
    const response = await axios.post(`api/bookingTable/releaseListTable`, cleanData, config);
    return response;
  } catch (error) {
    console.error("Error in releaseTableList:", error);
    throw error;
  }
};

const getAllHoldTable = async (token, barId, date, time) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };
    
    const formattedDate = dayjs(date).format("YYYY/MM/DD");
    const formattedTime = time.includes(':00') ? time : time + ':00';
    
    const params = {
      Date: formattedDate,
      Time: formattedTime
    };

    console.log("Getting hold tables with params:", { barId, ...params });
    
    const response = await axios.get(`api/bookingTable/getHoldTable/${barId}`, {
      ...config,
      params: params
    });

    console.log("Hold tables response:", response.data);
    
    return response;
  } catch (error) {
    console.error("Error in getAllHoldTable:", error);
    if (error.response) {
      console.error("Server error details:", error.response.data);
    }
    return {
      data: {
        statusCode: 200,
        data: []
      }
    };
  }
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


export { filterBookingTable, boookingtableNow, holdTable, releaseTable, getAllHoldTable, releaseTableList };
