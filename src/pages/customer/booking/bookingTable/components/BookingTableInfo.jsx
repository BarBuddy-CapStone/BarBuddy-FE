import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import TableBarIcon from "@mui/icons-material/TableBar";
import PersonIcon from "@mui/icons-material/Person";
import {
  Button,
  FormControl,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import viLocale from "date-fns/locale/vi";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "src/lib/hooks/useUserStore";
import { getAllHoldTable } from "src/lib/service/BookingTableService";
import { getTableTypeOfBar } from "src/lib/service/tableTypeService";
import TimeSelection from "./TimeSelection";

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
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
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
  endTime,
}) => {
  const navigate = useNavigate();
  const [selectedTableType, setSelectedTableType] = useState("");
  const [selectedTypeDescription, setSelectedTypeDescription] = useState("");
  const [tableTypes, setTableTypes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const { token, userInfo } = useAuthStore();
  const [currentHoldCount, setCurrentHoldCount] = useState(0);
  const [selectedTables, setSelectedTables] = useState([]);
  const [guestCount, setGuestCount] = useState("");

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await getTableTypeOfBar(barId);
        if (response?.data?.data?.tableTypeResponses) {
          setTableTypes(response.data.data.tableTypeResponses);
        } else {
          setTableTypes([]);
        }
      } catch (error) {
        console.error("Error fetching table types:", error);
      }
    };

    fetchTableTypes();
  }, [barId]);

  const generateTimeOptions = (start, end, date) => {
    if (!start || !end) {
      return [];
    }

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
    if (!startTime || !endTime) {
      setTimeOptions([]);
      onTimeChange("");
      return;
    }

    const newTimeOptions = generateTimeOptions(
      startTime,
      endTime,
      selectedDate
    );
    setTimeOptions(newTimeOptions);

    if (!newTimeOptions.includes(selectedTime)) {
      onTimeChange("");
    }
  }, [startTime, endTime, selectedDate]);

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
    onTimeChange("");
    setSelectedTableType("");
    onTableTypeChange("");
  };

  const handleTableTypeChange = (tableType) => {
    setSelectedTableType(tableType.tableTypeId);
    setSelectedTypeDescription(tableType.description);
    onTableTypeChange(tableType.tableTypeId);
  };

  const isDateValid = (date) => {
    return (
      dayjs(date).isAfter(dayjs(), "day") || dayjs(date).isSame(dayjs(), "day")
    );
  };

  const handleBack = () => {
    navigate(`/bar-detail/${barId}`);
  };

  useEffect(() => {
    const checkHoldTables = async () => {
      if (barId && selectedDate && selectedTime && startTime && endTime) {
        const currentTime = dayjs(selectedTime, 'HH:mm');
        const start = dayjs(startTime, 'HH:mm');
        const end = dayjs(endTime, 'HH:mm');

        if (currentTime.isBetween(start, end, 'minute', '[]')) {
          try {
            console.log("Calling getAllHoldTable with:", {
              barId,
              selectedDate,
              selectedTime
            });
            
            const response = await getAllHoldTable(
              token,
              barId,
              selectedDate,
              selectedTime + ":00"
            );
            if (response.data.statusCode === 200) {
              const userHoldTables = response.data.data.filter(
                table => table.accountId === userInfo.accountId
              );
              setCurrentHoldCount(userHoldTables.length);
            }
          } catch (error) {
            console.error("Error checking hold tables:", error);
          }
        }
      }
    };

    checkHoldTables();
  }, [barId, selectedDate, selectedTime, startTime, endTime, token, userInfo.accountId]);

  const handleSearch = async () => {
    if (currentHoldCount >= 5) {
      toast.error(
        "Bạn đã giữ tối đa 5 bàn. Vui lòng hủy bớt bàn trước khi tìm thêm.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    
    const selectedTypeInfo = tableTypes.find(t => t.tableTypeId === selectedTableType);
    if (selectedTypeInfo) {
      const typeInfoWithGuests = {
        ...selectedTypeInfo,
        currentGuestCount: parseInt(guestCount)
      };
      onSearchTables(typeInfoWithGuests, parseInt(guestCount));
    }
  };

  const handleGuestCountChange = (event) => {
    setGuestCount(event.target.value);
    setSelectedTableType("");
    onTableTypeChange("");
  };

  const getFilteredTableTypes = () => {
    if (!guestCount) return [];
    const count = parseInt(guestCount);
    return tableTypes.filter(
      type => count >= type.minimumGuest && count <= type.maximumGuest
    );
  };

  const guestCountOptions = Array.from({length: 30}, (_, i) => i + 1);

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
            <FormControl
              sx={{ flex: "1 1 0", minWidth: "120px", maxWidth: "250px" }}
            >
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

            <TimeSelection
              startTime={startTime}
              endTime={endTime}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeChange={onTimeChange}
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              barId={barId}
            />

            <div className="relative" style={{ flex: "1 1 0", minWidth: "120px", maxWidth: "200px" }}>
              <button
                className="w-full h-[56px] px-4 py-2 bg-transparent border border-white rounded-lg text-white flex items-center justify-between hover:border-amber-400 focus:border-amber-400"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  setAnchorEl({ target, rect, type: 'guest' });
                }}
                disabled={!selectedTime}
              >
                <div className="flex items-center min-w-0">
                  <PersonIcon style={{ color: "#FFA500", marginRight: "8px", flexShrink: 0 }} />
                  <span className="truncate">
                    {guestCount ? `${guestCount} người` : "Số người"}
                  </span>
                </div>
                <span className="dropdown-arrow" />
              </button>

              <Menu
                anchorEl={anchorEl?.type === 'guest' ? anchorEl.target : null}
                open={Boolean(anchorEl?.type === 'guest')}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    backgroundColor: "#2D2D2D",
                    borderRadius: "8px",
                    marginTop: "8px",
                    minWidth: anchorEl?.rect?.width,
                    maxHeight: "300px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  },
                }}
              >
                {guestCountOptions.map((count) => (
                  <MenuItem
                    key={count}
                    onClick={() => {
                      handleGuestCountChange({ target: { value: count } });
                      setAnchorEl(null);
                    }}
                    style={{
                      color: "#FFA500",
                      padding: "10px 16px",
                      borderBottom: "1px solid #404040",
                    }}
                  >
                    {count} người
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <div className="relative" style={{ flex: "1 1 0", minWidth: "120px", maxWidth: "200px" }}>
              <button
                className="w-full h-[56px] px-4 py-2 bg-transparent border border-white rounded-lg text-white flex items-center justify-between hover:border-amber-400 focus:border-amber-400"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  setAnchorEl({ target, rect, type: 'table' });
                }}
                disabled={!guestCount}
              >
                <div className="flex items-center min-w-0">
                  <TableBarIcon style={{ color: "#FFA500", marginRight: "8px", flexShrink: 0 }} />
                  <span className="truncate">
                    {selectedTableType
                      ? tableTypes.find((t) => t.tableTypeId === selectedTableType)?.typeName
                      : "Loại bàn"}
                  </span>
                </div>
                <span className="dropdown-arrow" />
              </button>

              <Menu
                anchorEl={anchorEl?.type === 'table' ? anchorEl.target : null}
                open={Boolean(anchorEl?.type === 'table')}
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
              >
                {getFilteredTableTypes().map((tableType) => (
                  <MenuItem
                    key={tableType.tableTypeId}
                    onClick={() => {
                      handleTableTypeChange(tableType);
                      setAnchorEl(null);
                    }}
                    style={{
                      color: "#FFA500",
                      padding: "10px 16px",
                      borderBottom: "1px solid #404040",
                    }}
                  >
                    {tableType.typeName}
                  </MenuItem>
                ))}
              </Menu>
            </div>

            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={
                !startTime ||
                !endTime ||
                !selectedTime ||
                !selectedTableTypeId ||
                !guestCount ||
                currentHoldCount >= 5
              }
              sx={{
                flex: "0 0 auto",
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
              {currentHoldCount >= 5 ? "Đã đạt giới hạn bàn" : "Tìm Bàn"}
            </Button>

            {currentHoldCount >= 5 && (
              <div className="text-red-500 text-sm mt-2">
                Bạn đã giữ tối đa 5 bàn. Vui lòng hủy bớt bàn trước khi tìm
                thêm.
              </div>
            )}
          </div>
        </div>
      </section>
    </LocalizationProvider>
  );
};

export default BookingTableInfo;
