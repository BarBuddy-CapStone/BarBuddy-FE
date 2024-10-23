import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from 'src/lib/service/bookingService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [Booking, setBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await BookingService.getBookingDetailByStaff(bookingId);
        const bookingData = response.data;

        setBooking(bookingData);
        setSelectedStatus(bookingData.status.toString());
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt bàn:", error);
        toast.error("Không thể lấy thông tin đặt bàn. Vui lòng thử lại sau.");
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await BookingService.updateStatusBooking(bookingId, parseInt(selectedStatus));
      setBooking(prevBooking => ({
        ...prevBooking,
        status: parseInt(selectedStatus)
      }));
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại sau.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (parseInt(status)) {
      case 0:
        return "bg-gray-600";
      case 1:
        return "bg-red-600";
      case 2:
        return "bg-yellow-600";
      case 3:
        return "bg-green-600";
      default:
        return "bg-blue-600";
    }
  };

  const getStatusText = (status) => {
    switch (parseInt(status)) {
      case 0:
        return "Đang chờ";
      case 1:
        return "Đã hủy";
      case 2:
        return "Đang phục vụ";
      case 3:
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const handleGoBack = () => {
    navigate('/staff/table-registrations');
  };

  if (!Booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={handleGoBack} aria-label="quay lại">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-3xl font-bold text-center flex-grow">CHI TIẾT YÊU CẦU ĐẶT BÀN {Booking.bookingCode}</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        <div className="flex-1 pr-8">
          <div className="flex justify-end items-center mb-4">
            <div className="relative">
              <select
                className="py-2 pl-8 pr-4 border rounded-md appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="0">Đang chờ</option>
                <option value="1">Đã hủy</option>
                <option value="2">Đang phục vụ</option>
                <option value="3">Đã hoàn thành</option>
              </select>
              <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${getStatusColor(selectedStatus)}`}></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">Mã đặt chỗ</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={Booking.bookingCode}
                readOnly
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">Tên khách hàng</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={Booking.customerName}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Số điện thoại</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={Booking.customerPhone}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                className="p-2 border rounded-md"
                value={Booking.customerEmail}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ghi chú</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={Booking.note}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ngày đặt bàn</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={new Date(Booking.bookingDate).toLocaleDateString('vi-VN')}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Thời gian check-in</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={Booking.bookingTime}
                readOnly
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-2 mt-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors w-[150px] flex items-center justify-center"
                onClick={handleSave}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-4">Bàn đã đặt trước</h2>
            {Booking.bookingTableList && Booking.bookingTableList.length > 0 ? (
              Booking.bookingTableList.map((table, index) => (
                <div key={index} className="bg-white p-2 rounded mb-2">
                  <p>ID: {table.tableName}</p>
                  <p>Loại bàn: {table.tableTypeName}</p>
                </div>
              ))
            ) : (
              <p>Không có bàn nào được đặt trước</p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Thức uống đã đặt trước</h2>
            {Booking.bookingDrinksList && Booking.bookingDrinksList.length > 0 ? (
              <>
                {Booking.bookingDrinksList.map((drink, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 bg-white p-2 rounded">
                    <div className="flex items-center">
                      <img src={drink.image} alt={drink.drinkName} className="w-10 h-10 mr-2 rounded" />
                      <span>{drink.drinkName}</span>
                    </div>
                    <div className="text-right">
                      <div>{drink.actualPrice.toLocaleString('vi-VN')} VND</div>
                      <div>x{drink.quantity}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-right font-bold">
                  Tổng số tiền: {Booking.bookingDrinksList.reduce((total, drink) => total + drink.actualPrice * drink.quantity, 0).toLocaleString('vi-VN')} VND
                </div>
              </>
            ) : (
              <p>Không có thức uống đặt trước</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
