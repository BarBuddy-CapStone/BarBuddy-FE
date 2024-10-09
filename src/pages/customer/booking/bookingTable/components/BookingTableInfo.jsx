import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableBarIcon from "@mui/icons-material/TableBar";
import InfoIcon from "@mui/icons-material/Info";
import { TextField, InputAdornment, MenuItem, Button } from "@mui/material";
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
  selectedTime, 
  selectedDate, 
  onDateChange, 
  onTableTypeChange, 
  onSearchTables,
  selectedTableTypeId,
}) => {
  const [selectedTableType, setSelectedTableType] = useState("");
  const [selectedTypeDescription, setSelectedTypeDescription] = useState("");
  const [tableTypes, setTableTypes] = useState([]);

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await TableTypeService.getAllTableTypes();
        if (response.status === 200) {
          const types = response.data.data;
          setTableTypes(types);

          if (types.length > 0) {
            const defaultType = types[0];
            setSelectedTableType(defaultType.typeName);
            setSelectedTypeDescription(defaultType.description);
            onTableTypeChange(defaultType.tableTypeId);
          }
        } else {
          console.error("Failed to fetch table types");
        }
      } catch (error) {
        console.error("Error fetching table types:", error);
      }
    };

    fetchTableTypes();
  }, []); // Chỉ gọi một lần khi component mount

  const handleDateChange = (newDate) => {
    onDateChange(newDate);
  };

  const handleSearch = () => {
    onSearchTables();
  };

  const handleTableTypeChange = (event) => {
    const selectedTypeName = event.target.value;
    setSelectedTableType(selectedTypeName);

    const selectedType = tableTypes.find(
      (type) => type.typeName === selectedTypeName
    );
    if (selectedType) {
      setSelectedTypeDescription(selectedType.description);
      onTableTypeChange(selectedType.tableTypeId);
    }
  };

  const isDateValid = (date) => {
    return dayjs(date).isAfter(dayjs(), 'day') || dayjs(date).isSame(dayjs(), 'day');
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

          {/* Display table type description */}
          <div className="flex gap-3 items-center mt-4 text-stone-300">
            <InfoIcon sx={{ color: "#FFA500" }} />
            <span>{selectedTypeDescription}</span>
          </div>

          <h3 className="mt-4 text-md">Chọn Ngày</h3>
          <div className="flex flex-wrap gap-3 mt-3 items-center text-stone-300">
            <div className="flex gap-2 items-center">
              <CustomDatePicker
                value={selectedDate}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                minDate={new Date()}
                shouldDisableDate={(date) => !isDateValid(date)}
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
                {tableTypes.map((tableType) => (
                  <CustomMenuItem
                    key={tableType.tableTypeId}
                    value={tableType.typeName}
                  >
                    {tableType.typeName}
                  </CustomMenuItem>
                ))}
              </CustomTextField>
            </div>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#FFA500",
                height: "56px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#FF8C00",
                  opacity: 0.8,
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