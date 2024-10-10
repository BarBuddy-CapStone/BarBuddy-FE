import React, { useState, useEffect } from "react";
import { TextField, MenuItem, InputAdornment } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs"; // Import dayjs for date manipulation

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

const TimeSelection = ({ startTime, endTime, onTimeChange }) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);

  // Generate time options between startTime and endTime with 1-hour interval
  const generateTimeOptions = (start, end) => {
    const options = [];
    let currentTime = dayjs(`2000-01-01 ${start}`);
    let endTimeObj = dayjs(`2000-01-01 ${end}`);

    // If endTime is earlier than startTime, assume endTime is the next day
    if (endTimeObj.isBefore(currentTime)) {
      endTimeObj = endTimeObj.add(1, "day");
    }

    // Generate time options every 1 hour
    while (currentTime.isBefore(endTimeObj) || currentTime.isSame(endTimeObj)) {
      options.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(1, "hour"); // Add 1-hour intervals
    }

    return options;
  };

  // Update time options whenever startTime or endTime changes
  useEffect(() => {
    if (startTime && endTime) {
      const newTimeOptions = generateTimeOptions(startTime, endTime);
      setTimeOptions(newTimeOptions);

      if (newTimeOptions.length > 0) {
        setSelectedTime(newTimeOptions[0]); // Set default selected time to the first option
        onTimeChange(newTimeOptions[0]); // Pass default selected time to parent
      }
    }
  }, [startTime, endTime]);

  const handleTimeChange = (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onTimeChange(newTime); // Pass selected time to parent
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg leading-none mb-4 text-amber-400">Chọn thời gian</h3>
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