import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircularProgress } from '@mui/material';

function BookingTableRow({ booking, isEven, onViewDetails }) {
  const rowClass = isEven ? "bg-orange-50" : "bg-white";
  const statusClass = getStatusClass(booking.status);
  
  const formattedCheckInTime = `${booking.bookingTime.slice(0, 5)} ${new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}`;

  return (
    <tr className={`${rowClass} text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150`}>
      <td className="px-6 py-4 text-center whitespace-nowrap">{booking.bookingCode}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{booking.customerName}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{booking.email}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{booking.phone}</td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{formattedCheckInTime}</td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <span className={`${statusClass} px-3 py-1 rounded-full text-white text-sm font-medium`}>
            {booking.status === 0 && "Đang chờ"}
            {booking.status === 1 && "Đã hủy"}
            {booking.status === 2 && "Đang phục vụ"}
            {booking.status === 3 && "Đã hoàn thành"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onViewDetails(booking.bookingId)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </td>
    </tr>
  );
}

function getStatusClass(status) {
  switch (status) {
    case 0: return "bg-gray-500";
    case 1: return "bg-red-500";
    case 2: return "bg-yellow-500";
    case 3: return "bg-green-500";
    default: return "bg-gray-500";
  }
}

function BookingTable({ bookings, loading }) {
  const navigate = useNavigate();

  const handleViewDetails = (bookingId) => {
    navigate(`/staff/table-registration-detail/${bookingId}`);
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center p-4">
          <CircularProgress size={40} />
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Mã đặt chỗ</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Tên khách hàng</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Email</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Số điện thoại</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Thời gian check-in</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Trạng thái</th>
              <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-gray-900"></th>
            </tr>
          </thead>
          {bookings.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-red-500 font-medium">
                  Không có lịch đặt chỗ
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.map((booking, index) => (
                <BookingTableRow
                  key={booking.bookingId}
                  booking={booking}
                  isEven={index % 2 === 0}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          )}
        </table>
      )}
    </div>
  );
}

export default BookingTable;
