import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingService from 'src/lib/service/bookingService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, CircularProgress } from '@mui/material';
import { message, Modal } from 'antd';

const BookingDetailStaff = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [booking, setBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId || initialLoadDone.current) return;
      
      console.log("Fetching booking details...");
      console.log("Location state:", location.state);
      
      try {
        setIsLoading(true);
        const response = await BookingService.getBookingDetailByStaff(bookingId);
        
        if (response.data && response.data.data) {
          const bookingData = response.data.data;
          setBooking(bookingData);
          setSelectedStatus(bookingData.status.toString());
          setAdditionalFee(bookingData.additionalFee || 0);
          
          if (location.state?.fromQR && !initialLoadDone.current) {
            message.success('Đã tìm thấy thông tin đơn đặt bàn!');
            
            Modal.confirm({
              title: 'Xác nhận check-in',
              content: `Xác nhận check-in cho đơn đặt bàn ${bookingData.bookingCode} của khách hàng ${bookingData.customerName}?`,
              okText: 'Xác nhận',
              cancelText: 'Hủy',
              onOk: async () => {
                try {
                  await BookingService.updateServingScan(bookingId);
                  setBooking(prev => ({
                    ...prev,
                    status: 2
                  }));
                  setSelectedStatus("2");
                  message.success('Check-in thành công!');
                } catch (error) {
                  console.error("Lỗi khi check-in:", error);
                  message.error('Không thể thực hiện check-in. Vui lòng thử lại sau.');
                }
              },
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt bàn:", error);
        message.error("Không thể lấy thông tin đặt bàn. Vui lòng thử lại sau.");
        navigate('/staff/table-registrations');
      } finally {
        setIsLoading(false);
        initialLoadDone.current = true;
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const currentStatus = booking.status;
      const newStatus = parseInt(selectedStatus);

      if (currentStatus === 1) {
        if (newStatus !== 0) {
          Modal.error({
            title: 'Không thể cập nhật',
            content: 'Đơn đã hủy chỉ có thể chuyển về trạng thái Đang chờ.',
          });
          return;
        }
      }

      if (currentStatus === 0 && (newStatus === 3)) {
        Modal.error({
          title: 'Không thể cập nhật',
          content: 'Không thể chuyển trực tiếp từ trạng thái Đang chờ sang Hoàn thành.',
        });
        return;
      }

      if (currentStatus === 2 &&  (newStatus === 0 || newStatus === 1)) {
        Modal.error({
          title: 'Không thể cập nhật',
          content: 'Trạng thái Đang phục vụ chỉ được điều chỉnh lên hoàn thành',
        });
        return;
      }

      if (currentStatus === 3 &&  (newStatus === 0 || newStatus === 1 || newStatus === 2)) {
        Modal.error({
          title: 'Không thể cập nhật',
          content: 'Trạng thái hoàn thành không thể điều chỉnh về các trạng thái khác',
        });
        return;
      }

      if (newStatus === 3 && currentStatus !== 3) {
        Modal.confirm({
          title: 'Xác nhận hoàn thành',
          content: 'Bạn có chắc chắn muốn chuyển trạng thái sang Đã hoàn thành? Hành động này không thể hoàn tác.',
          okText: 'Xác nhận',
          cancelText: 'Hủy',
          onOk: async () => {
            await updateBookingStatus();
          }
        });
      } else {
        await updateBookingStatus();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      
      if (error.response) {
        const errorMessage = error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        
        Modal.error({
          title: 'Không thể cập nhật',
          content: errorMessage,
        });
      } else {
        Modal.error({
          title: 'Lỗi kết nối',
          content: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối.',
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const updateBookingStatus = async () => {
    try {
      await BookingService.updateStatusBooking(bookingId, parseInt(selectedStatus), additionalFee);
      setBooking(prevBooking => ({
        ...prevBooking,
        status: parseInt(selectedStatus),
        additionalFee: additionalFee
      }));
      message.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      throw error;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAdditionalFeeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAdditionalFee(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
        <IconButton onClick={handleGoBack} aria-label="quay lại">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-3xl font-bold text-center flex-grow">CHI TIẾT YÊU CẦU ĐẶT BÀN {booking.bookingCode}</h1>
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
                value={booking.bookingCode}
                readOnly
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">Tên khách hàng</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={booking.customerName}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Số điện thoại</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={booking.customerPhone}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                className="p-2 border rounded-md"
                value={booking.customerEmail}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ghi chú</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={booking.note}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Ngày đặt bàn</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Thời gian check-in</label>
              <input
                type="text"
                className="p-2 border rounded-md"
                value={booking.bookingTime}
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Phụ thu</label>
              <div className="relative">
                <input
                  type="text"
                  className="p-2 border rounded-md w-full"
                  value={formatCurrency(additionalFee)}
                  onChange={handleAdditionalFeeChange}
                  placeholder="Nhập số tiền phụ thu"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  VND
                </span>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default BookingDetailStaff;
