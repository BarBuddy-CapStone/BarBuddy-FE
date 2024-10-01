import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableBarIcon from "@mui/icons-material/TableBar";
import { TextField, InputAdornment, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi"; // Import Vietnamese locale
import { styled } from '@mui/material/styles';

// Tạo một component TextField tùy chỉnh
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '5px',
    backgroundColor: '#1F2937',
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    paddingLeft: '0', // Loại bỏ padding mặc định
  },
  '& .MuiSvgIcon-root': {
    color: '#FFA500',
  },
  '& .MuiInputAdornment-root': {
    marginRight: '8px', // Thêm khoảng cách giữa icon và text
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .Mui-focused .MuiInputLabel-root': {
    color: 'white',
  },
}));

// Cập nhật CustomDatePicker
const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiSvgIcon-root': {
    color: '#FFA500',
  },
}));

const BookingInfo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTableType, setSelectedTableType] = useState("Tiêu chuẩn");

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTableTypeChange = (event) => {
    setSelectedTableType(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
      <section className="flex flex-col py-4 px-4 w-full text-base text-amber-400 bg-neutral-800 max-md:mt-4 max-md:max-w-full">
        <div className="flex flex-col items-start w-full max-md:max-w-full">
          <div className="flex items-center text-xl leading-snug text-gray-200">
            <ArrowBackIosIcon sx={{ marginRight: "8px" }} />
            Quay lại
          </div>
          <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />

          <h2 className="mt-4 text-lg">Thông tin đặt bàn</h2>
          <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />

          {/* Booking Notice Section */}
          <h3 className="mt-4 text-md">Lưu ý trước khi đặt bàn</h3>
          <div className="flex flex-wrap gap-3 mt-3 text-gray-200">
          <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/80a0905ae3e6166bd70cf1df30466a09ecb84fdb8f839af7a1abaf8baa6d71d2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 self-start w-5 aspect-square mt-1"
              alt="Info icon"
            />
            <div className="flex-auto max-md:max-w-full">
              
              Bàn SVIP: 1-20 khách. Mức giá tối thiểu 9.300.000 VND <br />
              Bàn VIP: 1-14 khách. Mức giá tối thiểu 4.650.000 VND <br />
              Bàn tiêu chuẩn: 1-10 khách. Mức giá tối thiểu 3.500.000 VND <br />
              Bàn quầy bar: 1 khách. Mức giá tối thiểu 500.000 VND
            </div>
          </div>
          <hr className="shrink-0 mt-4 w-full h-0.5 border border-amber-400 border-solid" />

          <h3 className="mt-4 text-md">Chọn Ngày</h3>
          <div className="flex flex-wrap gap-3 mt-3 items-center text-stone-300">
            <div className="flex gap-2 items-center">
              <CustomDatePicker
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <CustomTextField
                select
                value={selectedTableType}
                onChange={handleTableTypeChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TableBarIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Tiêu chuẩn">Tiêu chuẩn</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="SVIP">SVIP</MenuItem>
              </CustomTextField>
            </div>
            <button className="px-4 py-2 text-black bg-amber-400 rounded-md">
              Tìm Bàn
            </button>
          </div>
        </div>
      </section>
    </LocalizationProvider>
  );
};

export default BookingInfo;
