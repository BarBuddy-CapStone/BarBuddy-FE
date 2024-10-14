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
  const [loading, setLoading] = useState(true); // Thêm state loading

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setLoading(true); // Bắt đầu loading khi filter thay đổi
    await fetchBookings(newFilter);
  };

  const fetchBookings = async (currentFilter) => {
    setLoading(true); // Bắt đầu loading
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // Lấy userInfo từ session storage
    const barId = userInfo ? userInfo.identityId : null; // Trích xuất identityId

    try {
      const response = await BookingService.getAllBookingsByStaff(
        barId, // Sử dụng identityId thay vì giá trị cứng
        currentFilter.name || null,
        currentFilter.email || null,
        currentFilter.phone || null,
        currentFilter.bookingDate || null,
        currentFilter.checkInTime === "Cả ngày" ? null : currentFilter.checkInTime,
        currentFilter.status === "All" ? undefined : parseInt(currentFilter.status),
        currentPage
      );
      setBookings(response.data.response);
      setTotalPages(response.data.totalPage);
      setTimeRange({ startTime: response.data.startTime, endTime: response.data.endTime });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
    } finally {
      setLoading(false); // Kết thúc loading
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
      <BookingTable filter={filter} bookings={bookings} loading={loading} /> {/* Truyền bookings vào BookingTable */}
      {bookings.length > 0 && (
        <div className="flex justify-center pt-4"> {/* Căn giữa và thêm padding top */}
          <Pagination
            count={totalPages} // Sử dụng totalPages để xác định số trang
            page={currentPage} // Trang hiện tại
            onChange={handlePageChange} // Hàm xử lý thay đổi trang
            color="primary"
          />
        </div>
      )}
    </main>
  );
}

export default BookingList;
