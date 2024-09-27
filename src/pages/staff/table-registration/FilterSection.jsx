import React, { useState } from "react";

const BarTime = {
  timeOpen: "22:00", // Thay đổi từ "10:00 CH" thành "22:00"
  timeClose: "02:00", // Thay đổi từ "2:00 AM" thành "02:00"
}

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

function DatePicker({ label }) {
  return (
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="grow leading-loose text-zinc-800 mr-2">{label}</label>
      <input
        type="date" // Thay đổi loại input thành date
        className="flex shrink-0 text-center max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TimePicker({ label }) {
  const generateTimeOptions = () => {
    const options = [];
    const startTime = new Date(`1970-01-01T${BarTime.timeOpen}:00`);
    const endTime = new Date(`1970-01-01T${BarTime.timeClose}:00`);

    // Thay đổi để đảm bảo startTime luôn nhỏ hơn endTime
    if (startTime > endTime) {
      endTime.setDate(endTime.getDate() + 1); // Nếu thời gian mở lớn hơn thời gian đóng, thêm một ngày
    }

    while (startTime <= endTime) {
      const hours = startTime.getHours().toString().padStart(2, "0");
      const minutes = startTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      options.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    return options;
  };

  return (
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="leading-loose basis-auto text-zinc-800 mr-2">{label}</label>
      <select className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500">
        {generateTimeOptions().map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
}

function StatusFilter({ label, selectedStatus, onChange }) {
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
    <div className="flex flex-row self-stretch my-auto rounded-md">
      <label className="grow leading-loose text-zinc-800 mr-2">{label}</label>
      <div className="relative">
        <select
          className="flex shrink-0 max-w-full bg-white rounded-3xl border border-solid border-stone-300 h-[38px] pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          value={selectedStatus}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="Đang phục vụ">Đang phục vụ</option>
          <option value="Đã đặt">Đã đặt</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
        <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${getStatusColor(selectedStatus)}`}></div>
      </div>
    </div>
  );
}

function FilterSection({ onFilterChange }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Đang phục vụ");

  const handleFilterChange = () => {
    onFilterChange({ name, phone, email, status: selectedStatus });
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
          <DatePicker label="Ngày đặt bàn:" />
          <TimePicker label="Thời gian check-in:" />
          <StatusFilter label="Trạng thái:" selectedStatus={selectedStatus} onChange={(value) => setSelectedStatus(value)} />
        </div>
        <button onClick={handleFilterChange} className="overflow-hidden self-start px-12 italic text-center text-white whitespace-nowrap bg-blue-600 hover:bg-blue-700 transition duration-300 min-h-[45px] rounded-[50px] max-md:px-5">
          Xem
        </button>
      </div>
    </>
  );
}

export default FilterSection;
