import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CircularProgress } from '@mui/material';

function BookingTableRow({ booking, isEven, onViewDetails }) {
  const rowClass = isEven ? "bg-orange-50" : "bg-white shadow-sm hover:bg-gray-100 transition duration-150";
  const statusClass = getStatusClass(booking.status);
  
  const formattedCheckInTime = `${booking.bookingTime.slice(0, 5)} ${new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}`;

  return (
    <tr className={`${rowClass} text-sm hover:bg-gray-100 transition duration-150`} onClick={() => onViewDetails(booking.bookingId)}>
      <td className="px-4 py-6 text-center align-middle">
        {booking.bookingCode}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.customerName}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.email}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.phone}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {formattedCheckInTime}
      </td>
      <td className="flex justify-center items-center px-4 py-6 align-middle">
        <div className={`flex justify-center items-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
          {booking.status === 0 && "Đang chờ"}
          {booking.status === 1 && "Đã hủy"}
          {booking.status === 2 && "Đang phục vụ"}
          {booking.status === 3 && "Đã hoàn thành"}
        </div>
      </td>
      <td className="px-4 py-6 text-center align-middle">
        <button
          className="flex items-center justify-center p-0 hover:bg-gray-200 rounded-lg"
          onClick={(e) => { e.stopPropagation(); onViewDetails(booking.bookingId); }} 
        >
          <ArrowForwardIosIcon /> 
        </button>
      </td>
    </tr>
  );
}

function handleCheckIn(id) {
  console.log(`Check-in cho booking ID: ${id}`);
}

function handleCancel(id) {
  console.log(`Hủy booking ID: ${id}`);
}

function getStatusClass(status) {
  switch (status) {
    case 0:
      return "bg-gray-500 text-white"; 
    case 1:
      return "bg-red-500 text-white"; 
    case 2:
      return "bg-orange-500 text-white"; 
    case 3:
      return "bg-green-500 text-white"; 
    default:
      return "bg-gray-500 text-white"; 
  }
}


function BookingTable({ filter, bookings, loading }) {
  const navigate = useNavigate(); 

  const handleViewDetails = (bookingId) => {
    navigate(`/staff/table-registration-detail/${bookingId}`); 
  };

  const filteredBookings = bookings.filter(booking => {
    return (
      (filter.name ? booking.customerName.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
      (filter.phone ? booking.phone.includes(filter.phone) : true) &&
      (filter.email ? booking.email.toLowerCase().includes(filter.email.toLowerCase()) : true) &&
      (filter.status === "All" || (filter.status ? booking.status === filter.status : true))
    );
  });

  return (
    <div className="overflow-hidden rounded-lg shadow-md mt-8 max-md:overflow-x-auto">
      <table className="min-w-full text-base table-auto border-collapse">
        <thead className="bg-white">
          <tr>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Mã đặt chỗ</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Tên khách hàng</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Email</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Số điện thoại</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Thời gian check-in</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2">Trạng thái</th>
            <th className="font-bold text-neutral-900 border-b-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4 h-32">
                <CircularProgress />
              </td>
            </tr>
          ) : filteredBookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 h-32">
                <p className="text-red-500 text-lg font-semibold">Không có lịch đặt chỗ</p>
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking, index) => (
              <BookingTableRow
                key={booking.bookingId}
                booking={booking}
                isEven={index % 2 === 0}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default BookingTable;
