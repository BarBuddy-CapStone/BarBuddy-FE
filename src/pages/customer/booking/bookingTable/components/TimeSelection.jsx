import React, { useState, useEffect } from "react";
import { TextField, MenuItem, InputAdornment } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs"; // Import dayjs for date manipulation
import { filterBookingTable, getAllHoldTable } from 'src/lib/service/BookingTableService';

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

const TimeSelection = ({ startTime, endTime, onTimeChange, selectedDate, barId, setFilteredTables, setSelectedTables }) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);

  const generateTimeOptions = (start, end, date) => {
    const options = [];
    const currentDate = dayjs(date);
    const now = dayjs();

    // Parse the start and end times
    let currentTime = currentDate
      .hour(parseInt(start.split(":")[0]))
      .minute(parseInt(start.split(":")[1]));
    let endTimeObj = currentDate
      .hour(parseInt(end.split(":")[0]))
      .minute(parseInt(end.split(":")[1]));

    // If the bar's closing time (end) is before the start time, assume it extends to the next day
    if (endTimeObj.isBefore(currentTime)) {
      endTimeObj = endTimeObj.add(1, "day");
    }

    // Handle the case when the selected date is today
    if (currentDate.isSame(now, "day")) {
      const barOpeningTime = dayjs()
        .hour(parseInt(start.split(":")[0]))
        .minute(parseInt(start.split(":")[1]));
      if (now.isAfter(barOpeningTime)) {
        currentTime = now.add(1, "hour").startOf("hour");
      }
    }

    // Generate hourly slots between startTime and endTime
    while (currentTime.isBefore(endTimeObj)) {
      options.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(1, "hour");
    }

    // Ensure that times after midnight are displayed correctly
    return options;
  };

  useEffect(() => {
    if (startTime && endTime && selectedDate) {
      const newTimeOptions = generateTimeOptions(
        startTime,
        endTime,
        selectedDate
      );
      setTimeOptions(newTimeOptions);

      if (newTimeOptions.length > 0 && !selectedTime) {
        setSelectedTime(newTimeOptions[0]);
        onTimeChange(newTimeOptions[0]);
      } else if (newTimeOptions.length === 0) {
        setSelectedTime("");
        onTimeChange("");
      }
    }
  }, [startTime, endTime, selectedDate]);

  const handleTimeChange = async (event) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onTimeChange(newTime);

    // Refresh the table list
    await refreshTableList(newTime);
  };

  const refreshTableList = async (time) => {
    try {
      const holdTablesResponse = await getAllHoldTable(barId, dayjs(selectedDate).format("YYYY/MM/DD"), time);
      const holdTables = holdTablesResponse.data.data;

      const response = await filterBookingTable({
        barId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: time
      });

      if (response.data.statusCode === 200 && response.data.data.bookingTables.length > 0) {
        const updatedTables = response.data.data.bookingTables[0].tables.map(table => {
          const holdInfo = holdTables.find(ht => 
            ht.tableId === table.tableId && 
            dayjs(ht.date).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD") && 
            ht.time === time + ":00"
          );

          if (holdInfo && holdInfo.isHeld) {
            return {
              ...table,
              status: 2,
              isHeld: true,
              holdExpiry: holdInfo.holdExpiry,
              holderId: holdInfo.accountId,
              date: holdInfo.date,
              time: holdInfo.time,
            };
          }
          return { ...table, status: 1, isHeld: false };
        });

        setFilteredTables(updatedTables);
        // Clear selected tables as they are no longer valid for the new time
        setSelectedTables([]);
      } else {
        setFilteredTables([]);
        setSelectedTables([]);
      }
    } catch (error) {
      console.error("Error refreshing table list:", error);
    }
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
