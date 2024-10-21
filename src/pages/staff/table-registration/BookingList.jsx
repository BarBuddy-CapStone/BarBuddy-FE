import React, { useEffect, useState } from "react"; 
import { FilterSection, BookingTable } from "src/pages";
import BookingService from "src/lib/service/bookingService"; 
import Pagination from '@mui/material/Pagination'; 

function BookingList() {
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

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setLoading(true); 
    await fetchBookings(newFilter);
  };

  const fetchBookings = async (currentFilter) => {
    setLoading(true);
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); 
    const barId = userInfo ? userInfo.identityId : null; 

    try {
      const response = await BookingService.getAllBookingsByStaff(
        barId, 
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
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchBookings(filter);
  }, [currentPage]); 

  const handlePageChange = (event, value) => {
    setCurrentPage(value); 
  };

  return (
    <main className="flex overflow-hidden flex-col grow px-7 pt-7 pb-8 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <section className="flex flex-col px-6 py-6 bg-white rounded-3xl border border-black border-solid max-md:px-5 max-md:mr-1 max-md:max-w-full">
        <FilterSection onFilterChange={handleFilterChange} timeRange={timeRange} initialDate={getCurrentDate()} />
      </section>
      <BookingTable filter={filter} bookings={bookings} loading={loading} /> 
      {bookings.length > 0 && (
        <div className="flex justify-center pt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </main>
  );
}

export default BookingList;
