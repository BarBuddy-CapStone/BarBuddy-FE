import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NoteIcon from '@mui/icons-material/Note';
import StoreIcon from '@mui/icons-material/Store';
import TableBarIcon from "@mui/icons-material/TableBar";
import dayjs from 'dayjs';

function BookingDetail({ barInfo, selectedTables, customerInfo }) {
  const [openTablePopup, setOpenTablePopup] = useState(false);
  const [openNotePopup, setOpenNotePopup] = useState(false);

  const handleOpenTablePopup = () => setOpenTablePopup(true);
  const handleCloseTablePopup = () => setOpenTablePopup(false);
  const handleOpenNotePopup = () => setOpenNotePopup(true);
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
    <section className="flex flex-col px-4 py-3 w-full bg-neutral-800 text-white rounded-md shadow-[0px_0px_14px_rgba(0,0,0,0.07)]">
      <h2 className="text-lg font-bold text-amber-400">Thông tin đặt bàn</h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      <div className="flex mt-2 text-sm">
        <div className="w-1/2 space-y-2">
          <div className="flex items-center justify-start">
            <LocationOnIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Địa chỉ:</span>
              {barInfo?.location}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <StoreIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Chi nhánh:</span>
              {barInfo?.name}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <AccessTimeIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Mở cửa:</span>
              {barInfo?.openingHours?.split('-')[0].trim() || "N/A"}
              <span className="text-amber-400 mx-2">Đóng cửa:</span>
              {barInfo?.openingHours?.split('-')[1].trim() || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <TableBarIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Bàn:</span>
              {selectedTables?.length} bàn đã chọn
              <button onClick={handleOpenTablePopup} className="ml-2 text-amber-400 underline">
                Xem chi tiết
              </button>
            </span>
          </div>
        </div>
        <div className="w-1/2 space-y-2">
          <div className="flex items-center justify-start">
            <PersonIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Khách hàng:</span>
              {customerInfo?.name}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <EmailIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Email:</span>
              {customerInfo?.email}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <PhoneIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Số điện thoại:</span>
              {customerInfo?.phone}
            </span>
          </div>
          <div className="flex items-center justify-start">
            <NoteIcon className="text-amber-400" />
            <span className="ml-2">
              <span className="text-amber-400 mr-1">Ghi chú:</span>
              {customerInfo?.note ? (
                <>
                  {customerInfo.note.slice(0, 20)}
                  {customerInfo.note.length > 20 && "..."}
                  <button onClick={handleOpenNotePopup} className="ml-2 text-amber-400 underline">
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
}

export default BookingDetail;
