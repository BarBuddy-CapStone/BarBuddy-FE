import React, { useEffect, useState } from "react"; 
import { FilterSection, BookingTable } from "src/pages";
import BookingService from "src/lib/service/bookingService"; 
import Pagination from '@mui/material/Pagination'; 
import { message } from 'antd';
import {QRScanner} from 'src/components';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';

function BookingListStaff() {
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(10);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    await fetchBookings(newFilter, 1);
  };

  const fetchBookings = async (currentFilter, page) => {
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
            endTime: response.data.data.endTime 
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
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (initialLoad) {
      fetchBookings(filter, currentPage);
    }
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      fetchBookings(filter, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleScanSuccess = async (scannedQRCode) => {
    try {
      const bookingId = scannedQRCode;
      navigate(`/staff/table-registration-detail/${bookingId}`, {
        state: { fromQR: true }
      });
      setIsQRScannerOpen(false);
    } catch (error) {
      console.error("Lỗi khi xử lý mã QR:", error);
    }
  };

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await fetchBookings(filter, currentPage);
      message.success('Đã cập nhật thông tin mới nhất');
    } catch (error) {
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại');
    } finally {
      setIsReloading(false);
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

            <div className="flex justify-end mb-4 gap-2">
              <Tooltip title="Tải lại">
                <IconButton 
                  onClick={handleReload}
                  disabled={isReloading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white ${isReloading ? 'animate-spin' : ''}`}
                  size="large"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
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

            <FilterSection 
              onFilterChange={handleFilterChange} 
              timeRange={timeRange} 
              initialDate={getCurrentDate()} 
            />
            
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingListStaff;
