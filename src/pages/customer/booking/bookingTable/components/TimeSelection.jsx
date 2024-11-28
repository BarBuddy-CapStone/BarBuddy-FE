import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Menu, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const TimeSelection = ({
  startTime,
  endTime,
  onTimeChange,
  selectedDate,
  selectedTime,
}) => {
  const [timeOptions, setTimeOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

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

    if (endTimeObj.isBefore(currentTime)) {
      endTimeObj = endTimeObj.add(1, "day");
    }

    if (currentDate.isSame(now, "day")) {
      currentTime = now.add(1, "hour").startOf("hour");
    }

    while (currentTime.isBefore(endTimeObj)) {
      options.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(1, "hour");
    }

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
    }
  }, [startTime, endTime, selectedDate]);

  const handleTimeChange = (time) => {
    onTimeChange(time);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    setAnchorEl({ target, rect });
  };

  return (
    <div
      className="relative"
      style={{ flex: "1 1 0", minWidth: "120px", maxWidth: "200px" }}
    >
      <button
        onClick={handleClick}
        className="w-full h-[56px] px-4 py-2 bg-transparent border border-white rounded-lg text-white flex items-center justify-between hover:border-amber-400 focus:border-amber-400"
      >
        <div className="flex items-center min-w-0">
          <AccessTimeIcon
            style={{ color: "#FFA500", marginRight: "8px", flexShrink: 0 }}
          />
          <span className="truncate">{selectedTime || "Chọn giờ"}</span>
        </div>
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #FFA500",
            marginLeft: "8px",
            flexShrink: 0,
          }}
        />
      </button>

      <Menu
        anchorEl={anchorEl?.target}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            backgroundColor: "#2D2D2D",
            borderRadius: "8px",
            marginTop: "8px",
            minWidth: anchorEl?.rect?.width,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {timeOptions.map((time) => (
          <MenuItem
            key={time}
            onClick={() => handleTimeChange(time)}
            style={{
              color: "#FFA500",
              padding: "10px 16px",
              borderBottom: "1px solid #404040",
              "&:last-child": {
                borderBottom: "none",
              },
              "&:hover": {
                backgroundColor: "#3D3D3D",
              },
            }}
          >
            {time}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default TimeSelection;
