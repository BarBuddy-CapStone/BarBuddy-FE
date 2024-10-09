import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TableBarIcon from "@mui/icons-material/TableBar";
import InfoIcon from "@mui/icons-material/Info"; // Thêm icon thông tin
import { TextField, InputAdornment, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import viLocale from "date-fns/locale/vi";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import TableTypeService from "src/lib/service/tableTypeService";
import { filterBookingTable } from "src/lib/service/BookingTableService";

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

const BookingTableInfo = ({ barId, setTables, selectedTime }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTableType, setSelectedTableType] = useState("");
  const [selectedTableTypeId, setSelectedTableTypeId] = useState(""); // Add state for tableTypeId
  const [selectedTypeDescription, setSelectedTypeDescription] = useState(""); // Store table description
  const [tableTypes, setTableTypes] = useState([]);

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await TableTypeService.getAllTableTypes();
        if (response.status === 200) {
          const types = response.data.data;
          setTableTypes(types);

          if (types.length > 0) {
            setSelectedTableType(types[0].typeName);
            setSelectedTableTypeId(types[0].tableTypeId); // Store the tableTypeId for the first entry
            setSelectedTypeDescription(types[0].description); // Set default description
          }
        } else {
          console.error("Failed to fetch table types");
        }
      } catch (error) {
        console.error("Error fetching table types:", error);
      }
    };

    fetchTableTypes();
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate); // Keep the actual date object for backend use
  };

  const handleSearchTables = async () => {
    try {
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId, // Send the correct tableTypeId to the backend
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime, // Use the selected time from TimeSelection
      });

      if (response.status === 200) {
        setTables(response.data.data.bookingTables[0].tables);
      } else {
        console.error("Failed to fetch tables");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const handleTableTypeChange = (event) => {
    const selectedTypeName = event.target.value;
    setSelectedTableType(selectedTypeName);

    // Find the selected table type and update the tableTypeId
    const selectedType = tableTypes.find(
      (type) => type.typeName === selectedTypeName
    );
    if (selectedType) {
      setSelectedTypeDescription(selectedType.description);
      setSelectedTableTypeId(selectedType.tableTypeId); // Store the correct tableTypeId
    }
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
              sx={{
                backgroundColor: "#FFA500",
                height: "56px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#FF8C00",
                  opacity: 0.8,
                },
              }}
              onClick={handleSearchTables}
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
