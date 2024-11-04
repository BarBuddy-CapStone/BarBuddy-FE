import React, { useEffect, useState } from "react";

import BookingService from "src/lib/service/bookingService";
import Pagination from "@mui/material/Pagination";
import { message } from "antd";
import { BookingTableManager, FilterSectionManager } from "src/pages";
import { QRScanner } from "src/components";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { IconButton } from "@mui/material";

function BookingListManager() {
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    email: "",
    status: "All",
    bookingDate: getCurrentDate(),
    checkInTime: "Cả ngày",
  });
  const [bookings, setBookings] = useState([]);
  const [timeRange, setTimeRange] = useState({ startTime: "", endTime: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize] = useState(10);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    await fetchBookings(newFilter, 1);
  };

  const fetchBookings = async (currentFilter, page) => {
    setLoading(true);
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
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

      if (response.data && response.data.data) {
        setBookings(response.data.data.response || []);
        setTotalPages(response.data.data.totalPage || 1);
        if (response.data.data.startTime && response.data.data.endTime) {
          setTimeRange({
            startTime: response.data.data.startTime,
            endTime: response.data.data.endTime,
          });
        }
      } else {
        setBookings([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
      setBookings([]);
      setTotalPages(1);
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

  const handleScanSuccess = async (scannedBookingId) => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const barId = userInfo ? userInfo.identityId : null;

      const response = await BookingService.getAllBookingsByManager(
        barId,
        null,
        null,
        null,
        null,
        null,
        null,
        1,
        pageSize,
        scannedBookingId
      );

      if (response.data?.data?.response?.length > 0) {
        setBookings(response.data.data.response);
        setTotalPages(response.data.data.totalPage || 1);
        setCurrentPage(1);
      } else {
        throw new Error('Không tìm thấy đơn đặt bàn');
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm đơn đặt bàn:", error);
      throw error;
    }
  };

  return (
    <div className="overflow-hidden bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden px-8 flex-col pb-10 w-full bg-white max-md:px-5">
            <h1 className="text-2xl font-bold text-blue-900 mt-8 mb-6 pb-4 border-b border-gray-200">
              DANH SÁCH ĐẶT BÀN
            </h1>

            <div className="flex justify-end mb-4">
              <IconButton
                onClick={() => setIsQRScannerOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="large"
              >
                <QrCodeScannerIcon />
              </IconButton>
            </div>

            <QRScanner
              isOpen={isQRScannerOpen}
              onClose={() => setIsQRScannerOpen(false)}
              onScanSuccess={handleScanSuccess}
            />

            <FilterSectionManager
              onFilterChange={handleFilterChange}
              timeRange={timeRange}
              initialDate={getCurrentDate()}
            />

            <BookingTableManager
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingListManager;
