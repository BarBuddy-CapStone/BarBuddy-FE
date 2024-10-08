import React, { useState, useEffect } from "react"; // Thêm useEffect

function FilterInput({ label, value, onChange }) {
  return (
    <div className="flex flex-row gap-2 rounded-3xl">
      <label className="self-start">{label}</label>
      <input
        id="fullName"
        type="text"
        className="flex-1 px-4 md:w-auto bg-white rounded-md border border-stone-300"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function DatePicker({ label, value, onChange }) {
  return (
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="grow leading-loose text-zinc-800 mr-2">{label}</label>
      <input
        type="date"
        className="flex shrink-0 text-center max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value} // Đảm bảo rằng giá trị được truyền vào
        onChange={onChange} // Gọi onChange khi thay đổi
      />
    </div>
  );
}

function TimePicker({ label, startTime, endTime, onChange }) {

  const generateTimeOptions = () => {
    const options = ["Cả ngày"]; // Thêm tùy chọn "Cả ngày" vào đầu danh sách
    const start = new Date(`1970-01-01T${startTime}`); // Không cần thêm ":00" nếu đã có giây
    const end = new Date(`1970-01-01T${endTime}`);

    // Nếu startTime lớn hơn endTime, thêm một ngày cho endTime
    if (start > end) {
      end.setDate(end.getDate() + 1); // Thêm một ngày cho endTime
    }

    while (start < end) { // Thay đổi điều kiện để không bao gồm endTime
      const hours = start.getHours().toString().padStart(2, "0");
      const minutes = start.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      options.push(timeString);
      start.setMinutes(start.getMinutes() + 30); // Tăng thêm 30 phút
    }

    return options;
  };

  const timeOptions = generateTimeOptions(); // Gọi hàm để lấy các tùy chọn thời gian

  return (
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="leading-loose basis-auto text-zinc-800 mr-2">{label}</label>
      <select
        className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onChange(e.target.value === "Cả ngày" ? null : e.target.value)} // Gọi onChange khi chọn thời gian
      >
        {timeOptions.map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
}

function StatusFilter({ label, selectedStatus, onChange }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-gray-300"; // Đang chờ
      case 1:
        return "bg-red-600"; // Đã hủy
      case 2:
        return "bg-orange-600"; // Đang phục vụ
      case 3:
        return "bg-green-600"; // Đã hoàn thành
      default:
        return "bg-gray-600"; // Mặc định
    }
  };

  return (
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="grow leading-loose text-zinc-800 mr-2">{label}</label>
      <div className="relative">
        <select
          className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          value={selectedStatus} // Đảm bảo selectedStatus là một chuỗi
          onChange={(e) => onChange(e.target.value === "All" ? "All" : Number(e.target.value))} // Chuyển đổi giá trị thành số hoặc giữ nguyên "All"
        >
          <option value="All">Tất cả</option>
          <option value={0}>Đang chờ</option>
          <option value={1}>Đã hủy</option>
          <option value={2}>Đang phục vụ</option>
          <option value={3}>Đã hoàn thành</option>
        </select>
        <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${getStatusColor(selectedStatus)}`}></div>
      </div>
    </div>
  );
}

function FilterSection({ onFilterChange, timeRange, initialDate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [bookingDate, setBookingDate] = useState(initialDate);
  const [checkInTime, setCheckInTime] = useState("Cả ngày");

  useEffect(() => {
    handleFilterChange();
  }, []);

  const handleFilterChange = () => {
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

  return (
    <>
      <div className="flex flex-wrap gap-10 items-end leading-loose text-zinc-800 max-md:max-w-full">
        <div className="flex gap-5">
          <FilterInput label="Họ tên:" value={name} onChange={(e) => setName(e.target.value)} />
          <FilterInput label="Số điện thoại:" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <FilterInput label="Email:" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 justify-between mt-9 w-full max-md:mr-1 max-md:max-w-full">
        <div className="flex gap-5 items-center max-md:max-w-full">
          <DatePicker label="Ngày đặt bàn:" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} /> {/* Thêm trường cho ngày đặt bàn */}
          <TimePicker label="Thời gian check-in:" startTime={timeRange.startTime} endTime={timeRange.endTime} onChange={(value) => setCheckInTime(value)} /> {/* Thêm trường cho thời gian check-in */}
          <StatusFilter label="Trạng thái:" selectedStatus={selectedStatus} onChange={(value) => setSelectedStatus(value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="overflow-hidden self-start px-12 italic text-center text-white whitespace-nowrap bg-gray-600 hover:bg-gray-700 transition duration-300 min-h-[45px] rounded-[50px] max-md:px-5">
            Đặt lại
          </button>
          <button onClick={handleFilterChange} className="overflow-hidden self-start px-12 italic text-center text-white whitespace-nowrap bg-blue-600 hover:bg-blue-700 transition duration-300 min-h-[45px] rounded-[50px] max-md:px-5">
            Xem
          </button>
        </div>
      </div>
    </>
  );
}

export default FilterSection;