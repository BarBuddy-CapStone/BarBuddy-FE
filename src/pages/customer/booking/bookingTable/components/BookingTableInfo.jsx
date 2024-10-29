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
import { getAllTableTypes } from "src/lib/service/tableTypeService";

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
    backgroundColor: "#1e1e1e",
    padding: "0 4px",
    transform: "translate(14px, -9px) scale(0.75)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
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
  "& .MuiInputLabel-root": {
    color: "white",
    backgroundColor: "#1e1e1e",
    padding: "0 4px",
    transform: "translate(14px, -9px) scale(0.75)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
}));

// CustomMenuItem for Dropdown
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: "#2D2D2D",
  color: "#FFA500",
  "&:hover": {
    backgroundColor: "#3D3D3D",
  },
  "&.Mui-selected": {
    backgroundColor: "#3D3D3D",
    "&:hover": {
      backgroundColor: "#4D4D4D",
    },
  },
  padding: "10px 16px",
  borderBottom: "1px solid #404040",
  "&:last-child": {
    borderBottom: "none",
  },
}));

// Thêm style mới cho dropdown
const CustomSelect = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    backgroundColor: "transparent",
    border: "1px solid white",
    color: "white",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      border: "1px solid #FFA500",
    },
    "&.Mui-focused": {
      border: "1px solid #FFA500",
    },
  },
  "& .MuiSelect-icon": {
    color: "#FFA500",
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    color: "white",
    "&::placeholder": {
      color: "white",
      opacity: 1,
    },
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
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await getAllTableTypes();
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

          <div className="flex flex-nowrap gap-3 mt-3 items-center text-stone-300">
            <FormControl sx={{ flex: '1 1 0', minWidth: '120px', maxWidth: '200px' }}>
              <CustomDatePicker
                label="Ngày"
                value={selectedDate}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                minDate={new Date()}
                shouldDisableDate={(date) => !isDateValid(date)}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
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

            <FormControl sx={{ flex: '1 1 0', minWidth: '120px', maxWidth: '200px' }}>
              <CustomTextField
                select
                label="Giờ"
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                variant="outlined"
                fullWidth
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

            <div className="relative" style={{ flex: '1 1 0', minWidth: '120px', maxWidth: '200px' }}>
              <button
                className="w-full h-[56px] px-4 py-2 bg-transparent border border-white rounded-lg text-white flex items-center justify-between hover:border-amber-400 focus:border-amber-400"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  setAnchorEl({ target, rect });
                }}
              >
                <div className="flex items-center min-w-0">
                  <TableBarIcon style={{ color: '#FFA500', marginRight: '8px', flexShrink: 0 }} />
                  <span className="truncate">
                    {selectedTableType ? tableTypes.find(t => t.tableTypeId === selectedTableType)?.typeName : "Loại bàn"}
                  </span>
                </div>
                <span style={{ 
                  width: 0, 
                  height: 0, 
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '5px solid #FFA500',
                  marginLeft: '8px',
                  flexShrink: 0
                }} />
              </button>

              <Menu
                anchorEl={anchorEl?.target}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    backgroundColor: '#2D2D2D',
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: anchorEl?.rect?.width,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {tableTypes.map((tableType) => (
                  <MenuItem
                    key={tableType.tableTypeId}
                    onClick={() => {
                      handleTableTypeChange(tableType);
                      setAnchorEl(null);
                    }}
                    style={{
                      color: '#FFA500',
                      padding: '10px 16px',
                      borderBottom: '1px solid #404040',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        backgroundColor: '#3D3D3D',
                      },
                    }}
                  >
                    {tableType.typeName}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <Button
              variant="contained"
              onClick={onSearchTables}
              disabled={!selectedTableType}
              sx={{
                flex: '0 0 auto',
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
