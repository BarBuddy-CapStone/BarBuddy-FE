import { Email } from "@mui/icons-material";
import axios from "../axiosCustomize";

class BookingService {
  static async getAllBookings(
    accountId,
    status = null,
    pageIndex = 1,
    pageSize = 10
  ) {
    let url = `api/Booking/${accountId}?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    if (status !== null) {
      url += `&Status=${status}`;
    }

    return await axios.get(url);
  }

  static async getAllBookingsByStaff(
    barId,
    customerName = null,
    email = null,
    phone = null,
    bookingDate = null,
    bookingTime = null,
    status = null,
    pageIndex = 1,
    pageSize = 10,
    qrTicket = null
  ) {
    let url = `api/Booking/staff?BarId=${barId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;

    if (status !== null) {
      url += `&Status=${status}`;
    }
    if (customerName) {
      url += `&CustomerName=${customerName}`;
    }
    if (email) {
      url += `&Email=${email}`;
    }
    if (phone) {
      url += `&Phone=${phone}`;
    }
    if (bookingDate) {
      url += `&BookingDate=${bookingDate}`;
    }
    if (bookingTime) {
      url += `&BookingTime=${bookingTime}`;
    }
    if (qrTicket) {
      url += `&qrTicket=${qrTicket}`;
    }

    return await axios.get(url);
  }

  static async getBookingById(bookingId) {
    return await axios.get(`api/Booking/detail/${bookingId}`);
  }

  static async getBookingDetailByStaff(bookingId) {
    return await axios.get(`api/Booking/staff/${bookingId}`);
  }

  static async getBookingDetailByManager(bookingId) {
    return await axios.get(`api/Booking/manager/${bookingId}`);
  }

  static async getBookingDetailByAdmin(bookingId) {
    return await axios.get(`api/Booking/admin/${bookingId}`);
  }

  static async updateStatusBooking(bookingId, status, additionalFee = 0) {
    try {
      const response = await axios.patch(
        `api/Booking/status?BookingId=${bookingId}&Status=${status}&AdditionalFee=${additionalFee}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async cancelBooking(bookingId) {
    return await axios.patch(`api/Booking/cancel/${bookingId}`);
  }

  static async getRecentBookings(accountId, numOfBookings) {
    const response = await axios.get(
      `api/Booking/top-booking?CustomerId=${accountId}&NumOfBookings=${numOfBookings}`
    );
    return response.data;
  }

  static async updateServingScan(bookingId) {
    return await axios.patch(`/api/Booking/update-serving/${bookingId}`);
  }

  static async getAllBookingsByManager(
    barId,
    customerName = null,
    email = null,
    phone = null,
    bookingDate = null,
    bookingTime = null,
    status = null,
    pageIndex = 1,
    pageSize = 10,
    qrTicket = null
  ) {
    let url = `api/Booking/manager?BarId=${barId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;

    if (status !== null) {
      url += `&Status=${status}`;
    }
    if (customerName) {
      url += `&CustomerName=${customerName}`;
    }
    if (email) {
      url += `&Email=${email}`;
    }
    if (phone) {
      url += `&Phone=${phone}`;
    }
    if (bookingDate) {
      url += `&BookingDate=${bookingDate}`;
    }
    if (bookingTime) {
      url += `&BookingTime=${bookingTime}`;
    }
    if (qrTicket) {
      url += `&qrTicket=${qrTicket}`;
    }

    return await axios.get(url);
  }

  static async getAllBookingsByAdmin(
    customerName = null,
    email = null,
    phone = null,
    bookingDate = null,
    bookingTime = null,
    status = null,
    pageIndex = 1,
    pageSize = 10,
    qrTicket = null
  ) {
    let url = `api/Booking/admin?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    if (status !== null) {
      url += `&Status=${status}`;
    }
    if (customerName) {
      url += `&CustomerName=${customerName}`;
    }
    if (email) {
      url += `&Email=${email}`;
    }
    if (phone) {
      url += `&Phone=${phone}`;
    }
    if (bookingDate) {
      url += `&BookingDate=${bookingDate}`;
    }
    if (bookingTime) {
      url += `&BookingTime=${bookingTime}`;
    }
    if (qrTicket) {
      url += `&qrTicket=${qrTicket}`;
    }

    return await axios.get(url);
  }

  static async addExtraDrink(bookingId, data) {
    return await axios.post(`api/Booking/extra-drink/${bookingId}`, data);
  }

  static async updateExtraDrink(bookingId, data) {
    return await axios.patch(`api/Booking/upd-extra-drink/${bookingId}`, data);
  }

  static async updateStatusExtraDrink(data) {
    try {
      const response = await axios.patch(`api/Booking/upd-sts-extra-drink`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteStatusExtraDrink(data) {
    try {
      const response = await axios.delete(`api/Booking/delete-extra-drink`, { 
        data: data 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

}

export default BookingService;
