import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs"; // Import dayjs for date manipulation
import React, { useEffect, useState } from "react";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "#FFA500",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFA500",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
    paddingLeft: "0",
  },
  "& .MuiSvgIcon-root": {
    color: "#FFA500",
  },
  "& .MuiInputAdornment-root": {
    marginRight: "8px",
  },
}));

// Custom styles for Menu and MenuItems
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  color: "#FFA500",
  "&.Mui-selected": {
    backgroundColor: "#333333",
    color: "#FFA500",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#555555",
  },
}));

// Thêm hàm helper để chuyển đổi dayOfWeek
const convertDayOfWeek = (dayjs) => {
  // dayjs.day() trả về: 0 (CN), 1 (T2), 2 (T3), 3 (T4), 4 (T5), 5 (T6), 6 (T7)
  // Cần chuyển thành: 1 (T2), 2 (T3), 3 (T4), 4 (T5), 5 (T6), 6 (T7), 7 (CN)
  const day = dayjs.day();
  return day === 0 ? 7 : day; // Chuyển Chủ nhật từ 0 thành 7
};

const TimeSelection = ({ startTime, endTime, onTimeChange, selectedDate, barId, setFilteredTables, setSelectedTables, timeSlot }) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);

  const generateTimeOptions = (startTime, endTime, selectedDate) => {
    if (!startTime || !endTime || !selectedDate) return [];

    const options = [];
    const currentDate = dayjs(selectedDate);
    const now = dayjs();

    let currentTime = currentDate
      .hour(parseInt(startTime.split(":")[0]))
      .minute(parseInt(startTime.split(":")[1]));
    
    let endTimeObj = currentDate
      .hour(parseInt(endTime.split(":")[0]))
      .minute(parseInt(endTime.split(":")[1]));

    // Xử lý trường hợp endTime là ngày hôm sau
    if (endTimeObj.isBefore(currentTime)) {
      endTimeObj = endTimeObj.add(1, "day");
    }

    // Nếu là ngày hiện tại, bắt đầu từ giờ tiếp theo
    if (currentDate.isSame(now, "day")) {
      currentTime = now.add(1, "hour").startOf("hour");
    }

    // TimeSlot chính là số giờ cách nhau giữa các slot
    const slotDuration = timeSlot || 1; // Mặc định là 1 giờ nếu không có timeSlot

    // Thêm các slot theo khoảng cách timeSlot cho đến khi vượt quá endTime
    while (currentTime.isBefore(endTimeObj) || currentTime.isSame(endTimeObj)) {
      options.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(slotDuration, "hour");
    }

    return options;
  };

  useEffect(() => {
    if (startTime && endTime && selectedDate) {
      const newTimeOptions = generateTimeOptions(startTime, endTime, selectedDate);
      setTimeOptions(newTimeOptions);

      if (newTimeOptions.length > 0 && !selectedTime) {
        setSelectedTime(newTimeOptions[0]);
        onTimeChange(newTimeOptions[0]);
      } else if (newTimeOptions.length === 0) {
        setSelectedTime("");
        onTimeChange("");
      }
    }
  }, [startTime, endTime, selectedDate, timeSlot]);

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onTimeChange(newTime);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg leading-none mb-4 text-amber-400">
        Chọn thời gian
      </h3>
      <CustomTextField
        select
        value={selectedTime}
        onChange={handleTimeChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccessTimeIcon />
            </InputAdornment>
          ),
        }}
        sx={{ width: "200px" }}
      >
        {timeOptions.map((time) => (
          <CustomMenuItem key={time} value={time}>
            {time}
          </CustomMenuItem>
        ))}
      </CustomTextField>
    </div>
  );
};

export default TimeSelection;
