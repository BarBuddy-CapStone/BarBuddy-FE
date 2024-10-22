import React, { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import dayjs from "dayjs";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NoteIcon from '@mui/icons-material/Note';
import StoreIcon from '@mui/icons-material/Store';
import TableBarIcon from "@mui/icons-material/TableBar";

const BookingDrinkInfo = ({
  barInfo,
  selectedTables,
  customerInfo,
  userInfo,
  onBackClick
}) => {
  const navigate = useNavigate();
  const [openTablePopup, setOpenTablePopup] = useState(false);
  const [openNotePopup, setOpenNotePopup] = useState(false);

  const handleShowAllTables = () => setOpenTablePopup(true);
  const handleCloseTablePopup = () => setOpenTablePopup(false);
  const handleShowNote = () => setOpenNotePopup(true);
  const handleCloseNotePopup = () => setOpenNotePopup(false);

  const formatDateTime = (dateString, timeString) => {
    const date = dayjs(dateString).format('YYYY-MM-DD');
    let time = 'Invalid Time';
    if (timeString) {
      time = timeString.slice(0, 5);
    }
    return { date, time };
  };

  return (
    <section className="flex flex-col px-4 py-4 mt-4 lg:mt-8 w-full text-lg bg-neutral-800 rounded-lg">
      {/* <button
        className="flex items-center gap-1.5 self-start ml-0 pl-2 cursor-pointer text-gray-200 hover:text-amber-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
        onClick={onBackClick}
      >
        <ChevronLeftIcon className="object-contain w-6 h-6" />
        <span>Quay lại</span>
      </button> */}
      <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid" />
      <h2 className="self-start mt-4 text-xl text-amber-400 font-aBeeZee">
        Thông tin đặt bàn
      </h2>
      <div className="shrink-0 mt-2 w-full border border-amber-400 border-solid" />

      <div className="flex mt-4 w-full leading-none text-gray-200">
        <div className="w-1/2 space-y-4">
          <div className="flex items-center">
            <LocationOnIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Địa chỉ:</span>
              {barInfo?.location || "Địa chỉ không có sẵn"}
            </span>
          </div>
          <div className="flex items-center">
            <StoreIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Chi nhánh:</span>
              {barInfo?.name || "Tên quán bar không có sẵn"}
            </span>
          </div>
          <div className="flex items-center">
            <AccessTimeIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Mở cửa:</span>
              {barInfo?.openingHours?.split('-')[0].trim() || "N/A"}
              <span className="text-amber-400 mx-2">Đóng cửa:</span>
              {barInfo?.openingHours?.split('-')[1].trim() || "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <TableBarIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Bàn:</span>
              {selectedTables?.length} bàn đã chọn
              <button onClick={handleShowAllTables} className="ml-2 text-amber-400 underline">
                Xem chi tiết
              </button>
            </span>
          </div>
        </div>
        <div className="w-1/2 space-y-4">
          <div className="flex items-center">
            <PersonIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Khách hàng:</span>
              {customerInfo?.name || userInfo?.fullname || "Tên không có sẵn"}
            </span>
          </div>
          <div className="flex items-center">
            <EmailIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Email:</span>
              {customerInfo?.email || userInfo?.email || "Email không có sẵn"}
            </span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin">
              <span className="text-amber-400 mr-1">Số điện thoại:</span>
              {customerInfo?.phone || userInfo?.phone || "Số điện thoại không có sẵn"}
            </span>
          </div>
          <div className="flex items-center">
            <NoteIcon className="text-amber-400 mr-2" />
            <span className="font-sans font-thin ">
              <span className="text-amber-400 mr-1">Ghi chú:</span>
              {customerInfo?.note ? (
                <>
                  {customerInfo.note.length > 20 && "..."}
                  <button onClick={handleShowNote} className="ml-2 text-amber-400 underline">
                    Xem chi tiết
                  </button>
                </>
              ) : (
                "Không có ghi chú"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Table Popup */}
      <Dialog 
        open={openTablePopup} 
        onClose={handleCloseTablePopup} 
        PaperProps={{
          style: { backgroundColor: '#333', color: 'white', minWidth: '400px' },
        }}
      >
        <DialogTitle style={{ color: '#FFA500' }}>Danh sách bàn đã chọn</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#FFA500' }}>STT</TableCell>
                  <TableCell style={{ color: '#FFA500' }}>Bàn</TableCell>
                  <TableCell style={{ color: '#FFA500' }}>Ngày</TableCell>
                  <TableCell style={{ color: '#FFA500' }}>Giờ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTables?.map((table, index) => {
                  const { date, time } = formatDateTime(table.date, table.time);
                  return (
                    <TableRow key={index}>
                      <TableCell style={{ color: 'white' }}>{index + 1}</TableCell>
                      <TableCell style={{ color: 'white' }}>{table.tableName}</TableCell>
                      <TableCell style={{ color: 'white' }}>{date}</TableCell>
                      <TableCell style={{ color: 'white' }}>{time}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTablePopup} style={{ color: '#FFA500' }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Note Popup */}
      <Dialog 
        open={openNotePopup} 
        onClose={handleCloseNotePopup} 
        PaperProps={{
          style: { backgroundColor: '#333', color: 'white', minWidth: '300px' },
        }}
      >
        <DialogTitle style={{ color: '#FFA500' }}>Ghi chú</DialogTitle>
        <DialogContent>
          <p>{customerInfo?.note || "Không có ghi chú"}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotePopup} style={{ color: '#FFA500' }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default BookingDrinkInfo;
