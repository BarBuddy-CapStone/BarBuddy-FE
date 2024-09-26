import React from "react";

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

function BookingTableRow({ booking, isEven }) {
  const rowClass = isEven ? "bg-gray-50" : "bg-white shadow-sm hover:bg-gray-100 transition duration-150";

  return (
    <tr className={`${rowClass} hover:bg-gray-100 transition duration-150`}>
      <td className="px-4 py-3 text-center text-gray-700 font-semibold">
        {booking.id}
      </td>
      <td className="px-4 py-3 text-left text-gray-700">
        {booking.name}
      </td>
      <td className="px-4 py-3 text-left text-gray-600 truncate max-w-[150px]">
        {booking.email}
      </td>
      <td className="px-4 py-3 text-left text-gray-600">
        {booking.phone}
      </td>
      <td className="px-4 py-3 text-center text-gray-700">
        {booking.checkInTime}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
        >
          {booking.status}
        </span>
      </td>
      <td className="px-4 py-3 text-center space-x-2">
        <button
          onClick={() => handleCheckIn(booking.id)}
          className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <i className="fas fa-check"></i> {/* Biểu tượng dấu V */}
        </button>
        <button
          onClick={() => handleCancel(booking.id)}
          className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <i className="fas fa-times"></i> {/* Biểu tượng dấu X */}
        </button>
      </td>
    </tr>
  );
}

function BookingTable() {
  return (
    <div className="overflow-hidden rounded-lg shadow-md mt-5 max-md:overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md">
          <tr>
            <th className="px-4 py-3 text-center text-sm max-md:text-xs">Booking ID</th>
            <th className="px-4 py-3 text-left text-sm max-md:text-xs">Tên khách hàng</th>
            <th className="px-4 py-3 text-left text-sm max-md:text-xs">Email</th>
            <th className="px-4 py-3 text-left text-sm max-md:text-xs">Phone</th>
            <th className="px-4 py-3 text-center text-sm max-md:text-xs">Thời gian check-in</th>
            <th className="px-4 py-3 text-center text-sm max-md:text-xs">Status</th>
            <th className="px-4 py-3 text-center text-sm max-md:text-xs"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <BookingTableRow
              key={booking.id}
              booking={booking}
              isEven={index % 2 === 0}
            />
          ))}
        </tbody>
      </table>
    </div>
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
      return "bg-yellow-100 text-yellow-800";
    case "Hoàn thành":
      return "bg-green-100 text-green-800";
    case "Đang phục vụ":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default BookingTable;