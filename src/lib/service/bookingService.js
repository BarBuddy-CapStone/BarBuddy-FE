import axios from '../axiosCustomize';

class BookingService {
  static async getAllBookings(params) {
    return await axios.get('/api/Booking/', { params });
  }

  static async getBookingById(bookingId) {
    return await axios.get(`/api/Booking/detail/${bookingId}`);
  }

  static async cancelBooking(bookingId) {
    return await axios.delete(`/api/Booking/${bookingId}`);
  }
}

export default BookingService;

