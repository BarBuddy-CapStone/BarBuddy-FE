import React, { useState } from 'react';

const CustomerForm = () => {
  const [name, setName] = useState('Bob Smith');
  const [email, setEmail] = useState('BobSmith22@gmail.com');
  const [phone, setPhone] = useState('1234567890');
  const [note, setNote] = useState('Tôi muốn bàn view sài gòn');

  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
  const handleNoteChange = (event) => setNote(event.target.value);

  return (
    <section className="flex flex-col px-4 mt-6 w-full max-md:px-3 max-md:mt-4 max-md:max-w-full">
      <h2 className="self-start text-lg text-amber-400 max-md:ml-1">Thông tin khách hàng</h2>
      <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />
      
      <div className="mt-3 text-amber-400">Họ và tên</div>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Địa chỉ Email</div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Số điện thoại</div>
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <div className="mt-3 text-amber-400">Ghi chú</div>
      <textarea
        value={note}
        onChange={handleNoteChange}
        className="px-4 py-2 mt-2 text-gray-400 rounded border border-gray-400 border-solid"
      />
      
      <hr className="shrink-0 mt-6 w-full h-px border border-amber-400 border-solid" />
      <div className="flex gap-3 justify-between mt-4 text-black">
        <button className="py-2 px-3 bg-amber-400 rounded-md">
          Đặt trước thức uống với chiết khấu 10%
        </button>
        <div className="my-auto text-gray-400">Hoặc</div>
        <button className="py-2 px-4 bg-amber-400 rounded-md">Đặt bàn ngay</button>
      </div>
    </section>
  );
};

export default CustomerForm;
