import React from "react";
import { useNavigate } from "react-router-dom"; // Thêm import useHistory

const bookings = [
  {
    id: 1,
    name: "Bob Smith",
    email: "smith@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Đã đặt"
  },
  {
    id: 2,
    name: "Amanda Smoff",
    email: "smoff@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Hoàn thành"
  },
  {
    id: 3,
    name: "Bob Smith",
    email: "smith@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Đã đặt"
  },
  {
    id: 4,
    name: "Amanda Smoff",
    email: "smoff@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Hoàn thành"
  },
  {
    id: 5,
    name: "Bob Smith",
    email: "smith@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Đã đặt"
  },
  {
    id: 6,
    name: "Amanda Smoff",
    email: "smoff@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Hoàn thành"
  },
  {
    id: 7,
    name: "Bob Smith",
    email: "smith@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Đã đặt"
  },
  {
    id: 8,
    name: "Amanda Smoff",
    email: "smoff@gmail.com",
    phone: "0909090909",
    checkInTime: "11:00 PM",
    status: "Đang phục vụ"
  },
];

function BookingTableRow({ booking, isEven, onViewDetails }) {
  const rowClass = isEven ? "bg-gray-50" : "bg-white shadow-sm hover:bg-gray-100 transition duration-150";
  const statusColor = getStatusColor(booking.status);
  return (
    <tr className={`${rowClass} hover:bg-gray-100 transition duration-150`}>
      <td className="px-4 py-6 text-center align-middle">
        {booking.id}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.name}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.email}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.phone}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        {booking.checkInTime}
      </td>
      <td className={`px-4 py-6 text-center break-words w-[111px] min-h-[111px] text-${statusColor}-500`}>
        <span className={`inline-block w-3 h-3 rounded-full bg-${statusColor}-500 mr-2`}></span>
        {booking.status}
      </td>
      <td className="px-4 py-6 text-center align-middle">
        <button
          className="px-2 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          onClick={() => onViewDetails(booking.id)} // Gọi hàm khi nhấn nút
        >
          Xem chi tiết
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

function getStatusColor(status) {
  switch (status) {
    case "Đã đặt":
      return "yellow"; // Màu cho trạng thái "Đã đặt"
    case "Hoàn thành":
      return "green"; // Màu cho trạng thái "Hoàn thành"
    case "Đang phục vụ":
      return "orange"; // Màu cho trạng thái "Đang phục vụ"
    default:
      return "gray"; // Màu mặc định
  }
}

function BookingTable({ filter }) {
  const filteredBookings = bookings.filter(booking => {
    return (
      (filter.name ? booking.name.includes(filter.name) : true) &&
      (filter.phone ? booking.phone.includes(filter.phone) : true) &&
      (filter.email ? booking.email.includes(filter.email) : true) &&
      (filter.status ? booking.status === filter.status : true)
    );
  });
  const navigate = useNavigate();
  const handleViewDetails = (bookingId) => {
    navigate(`/staff/table-registration-detail?id=${bookingId}`)
  }

  return (
    <div className="overflow-hidden rounded-lg shadow-md mt-8 max-md:overflow-x-auto">
      <table className="min-w-full text-lg table-auto border-collapse">
        <thead className="bg-white">
          <tr>
            <th className="font-bold text-neutral-900 border-b-2">Booking ID</th>
            <th className="font-bold text-neutral-900 border-b-2">Tên khách hàng</th>
            <th className="font-bold text-neutral-900 border-b-2">Email</th>
            <th className="font-bold text-neutral-900 border-b-2">Phone</th>
            <th className="font-bold text-neutral-900 border-b-2">Thời gian check-in</th>
            <th className="font-bold text-neutral-900 border-b-2">Status</th>
            <th className="font-bold text-neutral-900 border-b-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking, index) => (
            <BookingTableRow
              key={booking.id}
              booking={booking}
              isEven={index % 2 === 0}
              onViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BookingTable;