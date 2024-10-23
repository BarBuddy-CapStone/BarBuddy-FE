import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableBarIcon from "@mui/icons-material/TableBar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import { TextField, InputAdornment, Button, Menu, MenuItem, FormControl, InputLabel } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import TableTypeService from "src/lib/service/tableTypeService";

// CustomTextField for Date and Type
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
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "white",
  },
}));

// CustomDatePicker for Date
const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    color: "white",
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
  "& .MuiSvgIcon-root": {
    color: "#FFA500",
  },
}));

// CustomMenuItem for Dropdown
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  color: "#FFA500",
  backgroundColor: "#000",
  "&.Mui-selected": {
    backgroundColor: "#333333",
    color: "#FFA500",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "#555555",
  },
  "&:hover": {
    backgroundColor: "#222222",
  },
}));

const BookingTableInfo = ({ 
  barId, 
  selectedDate, 
  onDateChange, 
  onTableTypeChange, 
  onSearchTables,
  selectedTableTypeId,
  selectedTime,
  onTimeChange,
  startTime,
  endTime
}) => {
  const navigate = useNavigate();
  const [selectedTableType, setSelectedTableType] = useState("");
  const [selectedTypeDescription, setSelectedTypeDescription] = useState("");
  const [tableTypes, setTableTypes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await TableTypeService.getAllTableTypes();
        if (response.status === 200) {
          setTableTypes(response.data.data);
        } else {
          console.error("Failed to fetch table types");
        }
      } catch (error) {
        console.error("Error fetching table types:", error);
      }
    };

    fetchTableTypes();
  }, []);

  const generateTimeOptions = (start, end, date) => {
    const options = [];
    const currentDate = dayjs(date);
    const now = dayjs();

    let currentTime = currentDate
      .hour(parseInt(start.split(":")[0]))
      .minute(parseInt(start.split(":")[1]));
    let endTimeObj = currentDate
      .hour(parseInt(end.split(":")[0]))
      .minute(parseInt(end.split(":")[1]));

    if (endTimeObj.isBefore(currentTime)) {
      endTimeObj = endTimeObj.add(1, "day");
    }

    if (currentDate.isSame(now, "day")) {
      const barOpeningTime = dayjs()
        .hour(parseInt(start.split(":")[0]))
        .minute(parseInt(start.split(":")[1]));
      if (now.isAfter(barOpeningTime)) {
        currentTime = now.add(1, "hour").startOf("hour");
      }
    }

    while (currentTime.isBefore(endTimeObj)) {
      options.push(currentTime.format("HH:mm"));
      currentTime = currentTime.add(1, "hour");
    }

    return options;
  };

  useEffect(() => {
    if (startTime && endTime && selectedDate) {
      const newTimeOptions = generateTimeOptions(startTime, endTime, selectedDate);
      setTimeOptions(newTimeOptions);

      if (newTimeOptions.length > 0 && !selectedTime) {
        onTimeChange(newTimeOptions[0]);
      } else if (newTimeOptions.length === 0) {
        onTimeChange("");
      }
    }
  }, [startTime, endTime, selectedDate, selectedTime, onTimeChange]);

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const handleTableTypeChange = (tableType) => {
    setSelectedTableType(tableType.tableTypeId);
    setSelectedTypeDescription(tableType.description);
    onTableTypeChange(tableType.tableTypeId);
  };

  const isDateValid = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day') || dayjs(date).isSame(dayjs(), 'day');
  };

  const handleBack = () => {
    navigate(`/bar-detail/${barId}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
      <section className="flex flex-col py-4 px-4 w-full text-base text-amber-400 bg-neutral-800 max-md:mt-4 max-md:max-w-full">
        <div className="flex flex-col items-start w-full max-md:max-w-full">
          <button 
            onClick={handleBack}
            className="flex items-center text-xl leading-snug text-gray-200 hover:text-amber-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
          >
            <ArrowBackIosIcon sx={{ marginRight: "2px" }} />
            Quay lại
          </button>
          <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />

          <h2 className="mt-4 text-lg">Thông tin đặt bàn</h2>
          <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />

          {selectedTypeDescription && (
            <div className="flex gap-3 items-center mt-4 text-stone-300">
              <InfoIcon sx={{ color: "#FFA500" }} />
              <span>{selectedTypeDescription}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-3 items-center text-stone-300">
            <FormControl>
              <InputLabel shrink htmlFor="date-picker" sx={{ color: 'white' }}>Ngày</InputLabel>
              <CustomDatePicker
                value={selectedDate}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                minDate={new Date()}
                shouldDisableDate={(date) => !isDateValid(date)}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    id="date-picker"
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
            </FormControl>

            <FormControl>
              <InputLabel shrink htmlFor="time-select" sx={{ color: 'white' }}>Giờ</InputLabel>
              <CustomTextField
                id="time-select"
                select
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              >
                {timeOptions.map((time) => (
                  <CustomMenuItem key={time} value={time}>
                    {time}
                  </CustomMenuItem>
                ))}
              </CustomTextField>
            </FormControl>

            <FormControl>
              <InputLabel shrink htmlFor="table-type-select" sx={{ color: 'white' }}>Loại bàn</InputLabel>
              <CustomTextField
                id="table-type-select"
                select
                value={selectedTableType}
                onChange={(event) => handleTableTypeChange(tableTypes.find(t => t.tableTypeId === event.target.value))}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TableBarIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  Chọn loại bàn
                </MenuItem>
                {tableTypes.map((tableType) => (
                  <CustomMenuItem
                    key={tableType.tableTypeId}
                    value={tableType.tableTypeId}
                  >
                    {tableType.typeName}
                  </CustomMenuItem>
                ))}
              </CustomTextField>
            </FormControl>

            <Button
              variant="contained"
              onClick={onSearchTables}
              disabled={!selectedTableType}
              sx={{
                backgroundColor: "#FFA500",
                height: "56px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#FF8C00",
                  opacity: 0.8,
                },
                "&:disabled": {
                  backgroundColor: "#A9A9A9",
                  color: "#D3D3D3",
                },
              }}
            >
              Tìm Bàn
            </Button>
          </div>
        </div>
      </section>
    </LocalizationProvider>
  );
};

export default BookingTableInfo;

