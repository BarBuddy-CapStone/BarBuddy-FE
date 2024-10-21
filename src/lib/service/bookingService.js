import { Email } from '@mui/icons-material';
import axios from '../axiosCustomize';

class BookingService {
  static async getAllBookings(accountId, status = null, pageIndex = 1, pageSize = 10) {
    let url = `api/Booking/${accountId}?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    
    if (status !== null) {
      url += `&Status=${status}`;
    }

    return await axios.get(url);
  }

  static async getAllBookingsByStaff(barId, customerName = null, email = null, phone = null, bookingDate = null, bookingTime = null, status = null, pageIndex = 1, pageSize = 10) {
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

    return await axios.get(url);
  }

  static async getBookingById(bookingId) {
    return await axios.get(`api/Booking/detail/${bookingId}`);
  }

  static async getBookingDetailByStaff(bookingId) {
    return await axios.get(`api/Booking/staff/${bookingId}`);
  }

  static async updateStatusBooking(bookingId, status) {
    try {
      const response = await axios.patch(`api/Booking/status?BookingId=${bookingId}&Status=${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async cancelBooking(bookingId) {
    return await axios.patch(`api/Booking/cancel/${bookingId}`);
  }

  static async getRecentBookings(accountId, numOfBookings) {
    const response = await axios.get(`api/Booking/top-booking?CustomerId=${accountId}&NumOfBookings=${numOfBookings}`);
    return response.data;
  }
}

export default BookingService;

