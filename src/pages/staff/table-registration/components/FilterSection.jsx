import React, { useState } from "react"; 

function FilterSection({ onFilterChange, timeRange, initialDate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [bookingDate, setBookingDate] = useState(initialDate);
  const [checkInTime, setCheckInTime] = useState("Cả ngày");

  const isAnyFieldFilled = name || phone || email || bookingDate || checkInTime !== "Cả ngày" || selectedStatus !== "All";

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ 
      name, 
      phone, 
      email, 
      status: selectedStatus, 
      bookingDate,
      checkInTime
    });
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setSelectedStatus("All");
    setBookingDate(initialDate);
    setCheckInTime("Cả ngày");
    onFilterChange({ 
      name: "", 
      phone: "", 
      email: "", 
      status: "All", 
      bookingDate: initialDate,
      checkInTime: "Cả ngày" 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "0":
        return "text-gray-500";
      case "1":
        return "text-red-500";
      case "2":
        return "text-yellow-500";
      case "3":
        return "text-green-500";
      default:
        return "";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "0":
        return "bg-gray-500";
      case "1":
        return "bg-red-500";
      case "2":
        return "bg-yellow-500";
      case "3":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start p-4 mt-1.5 w-full text-sm bg-white rounded-3xl border border-black max-md:pr-5 max-md:mr-2.5 max-md:max-w-full"
    >
      <p className="text-sky-900 max-md:max-w-full">
        * Bạn có thể tìm kiếm/xem (các) đặt chỗ bằng cách nhập một hoặc nhiều thông tin này
      </p>

      <div className="flex flex-wrap gap-4 justify-between w-full mt-3">
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="fullName" className="w-1/3 md:w-auto mr-2">Họ tên:</label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="phoneNumber" className="w-1/3 md:w-auto mr-2">Số điện thoại:</label>
          <input
            id="phoneNumber"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="email" className="w-1/3 md:w-auto mr-2">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center w-full mt-3">
        <div className="flex gap-2 items-center flex-1">
          <label htmlFor="bookingDate" className="whitespace-nowrap">Ngày đặt bàn:</label>
          <div className="flex items-center bg-neutral-200 px-3 py-1.5 rounded-md">
            <input
              id="bookingDate"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="bg-transparent border-none text-black text-sm"
            />
          </div>
          
          <label htmlFor="checkInTime" className="ml-4 whitespace-nowrap">Thời gian check-in:</label>
          <select
            id="checkInTime"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
            className="bg-white border border-stone-300 rounded-md px-3 py-1.5"
          >
            <option value="Cả ngày">Cả ngày</option>
            {timeRange.startTime && timeRange.endTime && 
              Array.from(
                { length: (parseInt(timeRange.endTime) - parseInt(timeRange.startTime)) / 100 + 1 },
                (_, i) => {
                  const time = (parseInt(timeRange.startTime) + i * 100).toString().padStart(4, '0');
                  return (
                    <option key={time} value={time}>
                      {`${time.slice(0, 2)}:${time.slice(2)}`}
                    </option>
                  );
                }
              )
            }
          </select>

          <label htmlFor="status" className="ml-4 whitespace-nowrap">Trạng thái:</label>
          <div className="relative inline-block">
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-stone-300 rounded-md px-3 py-1.5 pl-8 appearance-none pr-8"
            >
              <option value="All" className="text-gray-700">Tất cả</option>
              <option value="0" className={getStatusColor("0")}>Đang chờ</option>
              <option value="1" className={getStatusColor("1")}>Đã hủy</option>
              <option value="2" className={getStatusColor("2")}>Đang phục vụ</option>
              <option value="3" className={getStatusColor("3")}>Đã hoàn thành</option>
            </select>
            <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${getStatusDot(selectedStatus)}`}></div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className={`px-6 py-1.5 text-sm font-semibold text-white bg-gray-500 rounded-full hover:bg-gray-600 w-[150px] text-center ${
              !isAnyFieldFilled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleReset}
            disabled={!isAnyFieldFilled}
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="px-6 py-1.5 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 w-[150px] text-center"
          >
            Xem
          </button>
        </div>
      </div>
    </form>
  );
}

export default FilterSection;