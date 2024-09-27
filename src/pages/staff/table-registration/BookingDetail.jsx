import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();
  const BarTime = {
    timeOpen: "22:00",
    timeClose: "02:00"
  };

  // Dữ liệu booking
  const [Booking, setBooking] = useState({
    customer: "Bob Smith",
    phone: "0909090909",
    email: "bobsmith@gmail.com",
    note: "Tiệc trà thân mật của Diddy",
    time: "23:00",
    drinks: [
      "2 AUCHENTOSHAN 0,7ML",
      "1 Champagne Alfred Gratien Brut"
    ],
    table: {
      id: "TC4",
      type: "Tiêu chuẩn 1",
    },
    status: "Đã đặt"
  });

  const [timeOptions, setTimeOptions] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(Booking.status);

  const generateTimeOptions = (timeOpen, timeClose) => {
    let times = [];
    let currentTime = new Date(`1970-01-01T${timeOpen}:00`);
    let endTime = new Date(`1970-01-01T${timeClose}:00`);

    if (endTime < currentTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    if (isNaN(currentTime) || isNaN(endTime)) {
      console.error("Invalid time format");
      return times;
    }

    while (currentTime <= endTime) {
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      times.push({ value: timeString, label: timeString });
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return times;
  };

  useEffect(() => {
    const options = generateTimeOptions(BarTime.timeOpen, BarTime.timeClose);
    setTimeOptions(options);
    setSelectedTime(Booking.time); // Chọn thời gian từ dữ liệu booking
  }, []);

  const handleSave = () => {
    // Cập nhật trạng thái của Booking
    setBooking((prevBooking) => ({
      ...prevBooking,
      time: selectedTime,
      status: selectedStatus,
    }));

    // Console log object Booking
    console.log({
      ...Booking,
      time: selectedTime,
      status: selectedStatus,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang phục vụ":
        return "bg-green-600";
      case "Đã đặt":
        return "bg-yellow-600";
      case "Đã hủy":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex flex-col p-8 bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">CHI TIẾT YÊU CẦU ĐẶT BÀN {id}</h1>
      <div className="flex justify-end items-center mb-4">
        <div className="relative">
          <select
            className="py-2 pl-8 pr-4 border rounded-md appearance-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Đang phục vụ">Đang phục vụ</option>
            <option value="Đã đặt">Đã đặt</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
          <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${getStatusColor(selectedStatus)}`}></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Tên khách hàng</label>
          <input
            type="text"
            className="p-2 border rounded-md"
            value={Booking.customer}
            onChange={(e) => setBooking({ ...Booking, customer: e.target.value })} // Cập nhật giá trị
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Số điện thoại</label>
          <input
            type="text"
            className="p-2 border rounded-md"
            value={Booking.phone}
            onChange={(e) => setBooking({ ...Booking, phone: e.target.value })} // Cập nhật giá trị
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            type="email"
            className="p-2 border rounded-md"
            value={Booking.email}
            onChange={(e) => setBooking({ ...Booking, email: e.target.value })} // Cập nhật giá trị
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Ghi chú</label>
          <input
            type="text"
            className="p-2 border rounded-md"
            value={Booking.note}
            onChange={(e) => setBooking({ ...Booking, note: e.target.value })} // Cập nhật giá trị
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Thời gian check-in</label>
          <select
            className="p-2 border rounded-md"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Danh sách đồ uống</label>
          <textarea className="p-2 border rounded-md" rows="3" readOnly>
            {Booking.drinks.join('\n- ')}
          </textarea>
        </div>
        <div className="flex flex-col p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold">Bàn đã đặt</h3>
          <p>ID: {Booking.table.id}</p>
          <p>Loại bàn: {Booking.table.type}</p>
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          onClick={handleSave} // Gọi hàm khi nhấn nút Lưu
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;