import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingService from 'src/lib/service/bookingService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, CircularProgress } from '@mui/material';
import { message } from 'antd';

const BookingDetailAdmin = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await BookingService.getBookingDetailByAdmin(bookingId);
        
        if (response.data && response.data.data) {
          setBooking(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt bàn:", error);
        message.error("Không thể lấy thông tin đặt bàn");
        navigate('/admin/table-registrations');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, navigate]);

  const handleBack = () => {
    navigate('/admin/table-registrations');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!booking) {
    return <div>Không tìm thấy thông tin đặt bàn</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={handleBack} aria-label="quay lại">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-3xl font-bold text-center flex-grow">CHI TIẾT YÊU CẦU ĐẶT BÀN {booking.bookingCode}</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        <div className="flex-1 pr-8">
          <div className="flex justify-end items-center mb-4">
            <div className={`px-4 py-2 rounded-full text-white ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">Mã đặt chỗ</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.bookingCode}
                readOnly
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">Tên khách hàng</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.customerName}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Số điện thoại</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.customerPhone}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.customerEmail}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ghi chú</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.note}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ngày đặt bàn</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Thời gian check-in</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={booking.bookingTime}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Phụ thu</label>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-50"
                value={`${booking.additionalFee ? booking.additionalFee.toLocaleString('vi-VN') : 0} VND`}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-4">Bàn đã đặt trước</h2>
            {booking.bookingTableList && booking.bookingTableList.length > 0 ? (
              booking.bookingTableList.map((table, index) => (
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
            {booking.bookingDrinksList && booking.bookingDrinksList.length > 0 ? (
              <>
                {booking.bookingDrinksList.map((drink, index) => (
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
                  Tổng số tiền: {booking.bookingDrinksList.reduce((total, drink) => total + drink.actualPrice * drink.quantity, 0).toLocaleString('vi-VN')} VND
                </div>
              </>
            ) : (
              <p>Không có thức uống đặt trước</p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-bold mb-4">Thức uống gọi thêm</h2>
            {booking.bookingDrinkExtraResponses && booking.bookingDrinkExtraResponses.length > 0 ? (
              <>
                {booking.bookingDrinkExtraResponses.map((drink, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 bg-white p-2 rounded">
                    <div className="flex items-center flex-1">
                      <img
                        src={drink.image}
                        alt={drink.drinkName}
                        className="w-10 h-10 mr-2 rounded"
                      />
                      <div className="flex flex-col">
                        <span>{drink.drinkName}</span>
                        <span className="text-sm text-gray-500">
                          {drink.status === 0
                            ? "Chờ xác nhận"
                            : drink.status === 1
                            ? "Chưa giao"
                            : "Đã giao"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{drink.actualPrice.toLocaleString('vi-VN')} VND</div>
                      <div>x{drink.quantity}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-right font-bold">
                  Tổng tiền gọi thêm:{' '}
                  {booking.bookingDrinkExtraResponses
                    .reduce((total, drink) => total + drink.actualPrice * drink.quantity, 0)
                    .toLocaleString('vi-VN')}{' '}
                  VND
                </div>
              </>
            ) : (
              <p>Chưa có thức uống gọi thêm</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailAdmin;