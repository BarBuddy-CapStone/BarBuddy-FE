import React, { useEffect, useState } from "react"; 
import { FilterSection, BookingTable } from "src/pages";
import BookingService from "src/lib/service/bookingService"; 
import Pagination from '@mui/material/Pagination'; 
import { message } from 'antd';

function BookingListManager() {
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    email: "",
    status: "All",
    bookingDate: getCurrentDate(),
    checkInTime: "Cả ngày"
  });
  const [bookings, setBookings] = useState([]); 
  const [timeRange, setTimeRange] = useState({ startTime: "", endTime: "" }); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(true); 
  const [pageSize] = useState(10);

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
    await fetchBookings(newFilter, 1);
  };

  const fetchBookings = async (currentFilter, page) => {
    setLoading(true);
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); 
    const barId = userInfo ? userInfo.identityId : null; 

    try {
      const response = await BookingService.getAllBookingsByManager(
        barId, 
        currentFilter.name || null,
        currentFilter.email || null,
        currentFilter.phone || null,
        currentFilter.bookingDate || null,
        currentFilter.checkInTime === "Cả ngày" ? null : currentFilter.checkInTime,
        currentFilter.status === "All" ? null : parseInt(currentFilter.status),
        page,
        pageSize
      );

      if (response.data) {
        setBookings(response.data.response || []);
        setTotalPages(response.data.totalPage || 1);
        setTimeRange({ 
          startTime: response.data.startTime || "", 
          endTime: response.data.endTime || "" 
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchBookings(filter, currentPage);
  }, [currentPage]); 

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <main className="flex overflow-hidden flex-col grow px-7 pt-7 pb-8 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <section className="flex flex-col px-6 py-6 bg-white rounded-3xl border border-black border-solid max-md:px-5 max-md:mr-1 max-md:max-w-full">
        <FilterSection 
          onFilterChange={handleFilterChange} 
          timeRange={timeRange} 
          initialDate={getCurrentDate()} 
        />
      </section>
      
      <BookingTable 
        filter={filter} 
        bookings={bookings} 
        loading={loading} 
      /> 
      
      {bookings.length > 0 && (
        <div className="flex justify-center pt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      )}
    </main>
  );
}

export default BookingListManager;
