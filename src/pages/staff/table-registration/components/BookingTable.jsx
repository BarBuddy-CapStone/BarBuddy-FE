import React from "react";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Nhập biểu tượng

function BookingTableRow({ booking, isEven, onViewDetails }) {
  const rowClass = isEven ? "bg-orange-50" : "bg-white shadow-sm hover:bg-gray-100 transition duration-150";
  const statusClass = getStatusClass(booking.status); // Lấy lớp trạng thái từ hàm getStatusClass
  
  // Định dạng thời gian check-in
  const formattedCheckInTime = `${booking.bookingTime.slice(0, 5)} ${new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}`; // Định dạng HHmm dd:MM:yyyy

  return (
    <tr className={`${rowClass} text-sm hover:bg-gray-100 transition duration-150`} onClick={() => onViewDetails(booking.bookingId)}> {/* Sử dụng bookingId */}
      <td className="px-4 py-6 text-center align-middle">
        {booking.bookingCode} {/* Hiển thị bookingCode thay vì bookingId */}
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
        {formattedCheckInTime} {/* Hiển thị thời gian check-in đã định dạng */}
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
          className="flex items-center justify-center p-0 hover:bg-gray-200 rounded-lg" // Đặt p-0 để không có padding
          onClick={(e) => { e.stopPropagation(); onViewDetails(booking.bookingId); }} // Ngăn chặn sự kiện click từ hàng
        >
          <ArrowForwardIosIcon /> {/* Thay thế nút bằng biểu tượng */}
        </button>
      </td>
    </tr>
  );
}


// Hàm xử lý check-in
function handleCheckIn(id) {
  console.log(`Check-in cho booking ID: ${id}`);
  // Thực hiện logic check-in ở đây
}

// Hàm xử lý cancel
function handleCancel(id) {
  console.log(`Hủy booking ID: ${id}`);
  // Thực hiện logic hủy booking ở đây
}

function getStatusClass(status) {
  switch (status) {
    case 0:
      return "bg-gray-500 text-white"; // Màu cho trạng thái "Đang chờ"
    case 1:
      return "bg-red-500 text-white"; // Màu cho trạng thái "Đã hủy"
    case 2:
      return "bg-orange-500 text-white"; // Màu cho trạng thái "Đang phục vụ"
    case 3:
      return "bg-green-500 text-white"; // Màu cho trạng thái "Đã hoàn thành"
    default:
      return "bg-gray-500 text-white"; // Màu mặc định
  }
}


function BookingTable({ filter, bookings }) {
  const navigate = useNavigate(); // Khai báo useNavigate

  const handleViewDetails = (bookingId) => {
    navigate(`/staff/table-registration-detail/${bookingId}`); // Chuyển hướng đến trang chi tiết
  };

  const filteredBookings = bookings.filter(booking => {
    return (
      (filter.name ? booking.customerName.includes(filter.name) : true) &&
      (filter.phone ? booking.phone.includes(filter.phone) : true) &&
      (filter.email ? booking.email.includes(filter.email) : true) &&
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
          {filteredBookings.map((booking, index) => (
            <BookingTableRow
              key={booking.bookingId} // Sử dụng bookingId làm key duy nhất
              booking={booking}
              isEven={index % 2 === 0}
              onViewDetails={handleViewDetails} // Truyền hàm handleViewDetails
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BookingTable;