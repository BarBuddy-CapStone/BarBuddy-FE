import React, { useEffect, useState } from "react"; // Thêm useEffect
import { FilterSection, BookingTable } from "src/pages";
import BookingService from "src/lib/service/bookingService"; // Thêm import BookingService
import Pagination from '@mui/material/Pagination'; // Thêm import Pagination

function BookingList() {
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    email: "",
    status: "All",
    bookingDate: getCurrentDate(), // Mặc định là ngày hiện tại
    checkInTime: "Cả ngày"
  });
  const [bookings, setBookings] = useState([]); // Thêm state để lưu trữ bookings
  const [timeRange, setTimeRange] = useState({ startTime: "", endTime: "" }); // Thêm state để lưu trữ thời gian
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Thêm state cho tổng số trang

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    await fetchBookings(newFilter);
  };

  const fetchBookings = async (currentFilter) => {
    const barId = "550e8400-e29b-41d4-a716-446655440000"; // Đặt barId cứng
    try {
      const response = await BookingService.getAllBookingsByStaff(
        barId,
        currentFilter.name || null,
        currentFilter.email || null,
        currentFilter.phone || null,
        currentFilter.bookingDate || null, // Nếu bookingDate là null, API sẽ lấy tất cả các ngày
        currentFilter.checkInTime === "Cả ngày" ? null : currentFilter.checkInTime, // Chỉ truyền checkInTime nếu không phải "Cả ngày"
        currentFilter.status === "All" ? undefined : parseInt(currentFilter.status), // Chỉ truyền status nếu không phải "All"
        currentPage // Thêm currentPage vào API call
      );
      setBookings(response.data.response); // Cập nhật state bookings với dữ liệu từ API
      setTotalPages(response.data.totalPage); // Cập nhật tổng số trang
      setTimeRange({ startTime: response.data.startTime, endTime: response.data.endTime }); // Lưu trữ startTime và endTime
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
    }
  };

  // Gọi hàm để hiển thị tất cả dữ liệu khi component được render
  useEffect(() => {
    fetchBookings(filter);
  }, [currentPage]); // Thêm currentPage vào dependency array

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Cập nhật trang hiện tại khi người dùng thay đổi trang
  };

  return (
    <main className="flex overflow-hidden flex-col grow px-7 pt-7 pb-8 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <section className="flex flex-col px-6 py-6 bg-white rounded-3xl border border-black border-solid max-md:px-5 max-md:mr-1 max-md:max-w-full">
        <FilterSection onFilterChange={handleFilterChange} timeRange={timeRange} initialDate={getCurrentDate()} /> {/* Truyền timeRange vào FilterSection */}
      </section>
      <BookingTable filter={filter} bookings={bookings} /> {/* Truyền bookings vào BookingTable */}
      <div className="flex justify-center pt-4"> {/* Căn giữa và thêm padding top */}
        <Pagination
          count={totalPages} // Sử dụng totalPages để xác định số trang
          page={currentPage} // Trang hiện tại
          onChange={handlePageChange} // Hàm xử lý thay đổi trang
          color="primary"
        />
      </div>
    </main>
  );
}

export default BookingList;