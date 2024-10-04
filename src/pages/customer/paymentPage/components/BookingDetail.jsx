import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NoteIcon from '@mui/icons-material/Note';
import StoreIcon from '@mui/icons-material/Store';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

const bookingData = {
  location: "97A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
  time: "23h30 - 17 December, 2024",
  branch: "Chi nhánh Bar Buddy1",
  table: "1x Bàn tiêu chuẩn",
  name: "Bob Smith",
  phone: "0113111415",
  email: "BobSmith22@gmail.com",
  note: "Tôi muốn bàn view sôi động",
};

function BookingDetail() {
  return (
    <section className="flex flex-col px-4 py-3 w-full bg-neutral-800 text-white rounded-md shadow-[0px_0px_14px_rgba(0,0,0,0.07)]">
      <h2 className="text-lg font-bold text-amber-400">Thông tin đặt bàn</h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      <div className="flex flex-wrap mt-2 text-sm space-y-2">
        <div className="w-1/2 flex items-center justify-start">
          <LocationOnIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.location}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <AccessTimeIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.time}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <StoreIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.branch}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <TableRestaurantIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.table}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <PersonIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.name}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <PhoneIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.phone}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <EmailIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.email}</span>
        </div>
        <div className="w-1/2 flex items-center justify-start">
          <NoteIcon className="text-amber-400" />
          <span className="ml-2">{bookingData.note}</span>
        </div>
      </div>
    </section>
  );
}

export default BookingDetail;