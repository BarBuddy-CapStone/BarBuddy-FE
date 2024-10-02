import axios from '../axiosCustomize';

class BookingService {
  static async getAllBookings(params) {
    return await axios.get('api/Booking/', { params });
  }

  static async getBookingById(bookingId) {
    return await axios.get(`api/Booking/detail/${bookingId}`);
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

