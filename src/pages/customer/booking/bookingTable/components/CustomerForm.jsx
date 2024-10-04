import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

const CustomerForm = ({ selectedTables }) => { // Nhận selectedTables từ props
  const [name, setName] = useState('Bob Smith');
  const [email, setEmail] = useState('BobSmith22@gmail.com');
  const [phone, setPhone] = useState('1234567890');
  const [note, setNote] = useState('Tôi muốn bàn view sài gòn');

  const navigate = useNavigate();

  const handleBookingDrinkClick = () => {
    if (selectedTables.length === 0) {
      toast.error('Vui lòng chọn ít nhất một bàn trước khi đặt trước thức uống!');
      return;
    }
    navigate('/bookingdrink'); // Chuyển hướng nếu có bàn được chọn
  };

  return (
    <section className="flex flex-col px-4 mt-6 w-full max-md:px-3 max-md:mt-4 max-md:max-w-full">
      <h2 className="self-start text-lg text-amber-400 max-md:ml-1">Thông tin khách hàng</h2>
      <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />
      
      <div className="mt-3 text-amber-400">Họ và tên</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Địa chỉ Email</div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Số điện thoại</div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Ghi chú</div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <hr className="shrink-0 mt-6 w-full h-px border border-amber-400 border-solid" />
      <div className="flex gap-3 justify-between mt-4 text-black">
        <button
          className="py-2 px-3 bg-amber-400 rounded-md"
          onClick={handleBookingDrinkClick} // Thêm onClick handler
        >
          Đặt trước thức uống với chiết khấu 10%
        </button>
        <div className="my-auto text-gray-400">Hoặc</div>
        <button className="py-2 px-4 bg-amber-400 rounded-md">Đặt bàn ngay</button>
      </div>
    </section>
  );
};

export default CustomerForm;
