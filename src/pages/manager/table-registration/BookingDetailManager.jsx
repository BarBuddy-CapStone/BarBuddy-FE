import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from 'src/lib/service/bookingService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import { message } from 'antd';
import RefreshIcon from '@mui/icons-material/Refresh';

const BookingDetailManager = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [Booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await BookingService.getBookingDetailByManager(bookingId);

        if (response.data && response.data.data) {
          const bookingData = response.data.data;
          setBooking(bookingData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt bàn:", error);
        message.error("Không thể lấy thông tin đặt bàn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await fetchBookingDetails();
      message.success('Đã cập nhật thông tin mới nhất');
    } catch (error) {
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại');
    } finally {
      setIsReloading(false);
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
    navigate('/manager/table-registrations');
  };

  const renderBookingDrinks = () => {
    if (!Booking?.bookingDrinksList?.length) {
      return <p>Không có thức uống đặt trước</p>;
    }

    const totalAmount = Booking.bookingDrinksList.reduce(
      (total, drink) => total + drink.actualPrice * drink.quantity, 
      0
    );

    return (
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
          Tổng số tiền: {totalAmount.toLocaleString('vi-VN')} VND
        </div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!Booking) {
    return <div>Không tìm thấy thông tin đặt bàn</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={handleGoBack} aria-label="quay lại">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-3xl font-bold text-center flex-grow">
          CHI TIẾT YÊU CẦU ĐẶT BÀN {Booking.bookingCode}
        </h1>
        <Tooltip title="Tải lại">
          <IconButton 
            onClick={handleReload} 
            disabled={isReloading}
            className={isReloading ? 'animate-spin' : ''}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex">
        <div className="flex-1 pr-8">
          <div className="flex justify-end items-center mb-4">
            <div className={`px-4 py-2 rounded-full text-white ${getStatusColor(Booking.status)}`}>
              {getStatusText(Booking.status)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium">Mã đặt chỗ</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.bookingCode}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Tên khách hàng</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.customerName}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Số điện thoại</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.customerPhone}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.customerEmail}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Ghi chú</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.note}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Ngày đặt bàn</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={new Date(Booking.bookingDate).toLocaleDateString('vi-VN')}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Thời gian check-in</label>
                <input
                  type="text"
                  className="p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  value={Booking.bookingTime}
                  disabled
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Phụ thu</label>
                <div className="relative">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full bg-gray-100 cursor-not-allowed"
                    value={`${Booking.additionalFee ? Booking.additionalFee.toLocaleString('vi-VN') : 0} VND`}
                    disabled
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    VND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Bàn đã đặt trước</h2>
              <div className="mb-3 flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold">Số bàn:</span> {Booking.numOfTable} bàn
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Số người:</span> {Booking.numOfPeople} người
                </div>
              </div>
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
              {renderBookingDrinks()}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-bold mb-4">Thức uống gọi thêm</h2>
            {Booking.bookingDrinkExtraResponses && Booking.bookingDrinkExtraResponses.length > 0 ? (
              <>
                {Booking.bookingDrinkExtraResponses.map((drink, index) => (
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
                  {Booking.bookingDrinkExtraResponses
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

export default BookingDetailManager;
