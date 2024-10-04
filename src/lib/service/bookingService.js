import axios from '../axiosCustomize';

class BookingService {
  static async getAllBookings(accountId, status = null, pageIndex = 1, pageSize = 10) {
    // Construct URL with dynamic Status parameter
    let url = `api/Booking/${accountId}?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    
    if (status !== null) {
      url += `&Status=${status}`;
    }

    return await axios.get(url);
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

