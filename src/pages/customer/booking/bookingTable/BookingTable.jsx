import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBarById, getBarTableById } from "src/lib/service/customerService";
import { filterBookingTable } from "src/lib/service/BookingTableService";
import CustomerForm from './components/CustomerForm';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import dayjs from "dayjs";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import {
  BookingTableInfo,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};
  const navigate = useNavigate();

  const [allTables, setAllTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [barInfo, setBarInfo] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tableTypeInfo, setTableTypeInfo] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTableTypeId, setSelectedTableTypeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const uniqueTablesByDateAndTime = selectedTables.filter((seleTable, index, self) =>
    index === self.findIndex((t) => (
      t.tableId === seleTable.tableId && t.date === seleTable.date && t.time === seleTable.time
    ))
  );
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await getBarTableById(barId);
        if (response.status === 200) {
          setAllTables(response.data.data.tables);
          setStartTime(response.data.data.startTime.slice(0, 5));
          setEndTime(response.data.data.endTime.slice(0, 5));
          setBarInfo({
            id: response.data.data.barId,
            name: response.data.data.barName,
            location: response.data.data.address,
            description: response.data.data.description,
            discount: response.data.data.discount,
            openingHours: `${response.data.data.startTime.slice(0, 5)} - ${response.data.data.endTime.slice(0, 5)}`,
          });
        } else {
          console.error("Failed to fetch table data");
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    if (barId) {
      fetchTableData();
    }
  }, [barId]);

  const mergeTables = (apiTables, filteredTables) => {
    filteredTables.forEach(table => {
      if (!table.time) {
        console.warn(`Table ${table.tableId} bi thieu time`);
        table.time = "00:00:00";
      }
    });
  
    return apiTables?.tables.map(apiTable => {
      const apiDate = dayjs(apiTables.reservationDate).format("YYYY-MM-DD");
      const apiTime = apiTables.reservationTime || "00:00:00";
  
      const matchingTable = filteredTables.find(filteredTable => {
        const filteredDate = dayjs(filteredTable.date).format("YYYY-MM-DD");
        const filteredTime = filteredTable.time || "00:00:00";
  
        return (
          filteredTable.tableId === apiTable.tableId &&
          filteredDate === apiDate &&
          filteredTime === apiTime
        );
      });
  
      if (matchingTable) {
        return {
          ...apiTable,
          isHeld: matchingTable.isHeld || apiTable.isHeld,
          date: matchingTable.date || apiTable.date,
          time: matchingTable.time || apiTable.time,
          status: matchingTable.status || apiTable.status,
          holderId: matchingTable.holderId || apiTable.holderId,
        };
      }
  
      return apiTable;
    });
  };
  const fetchFilteredTables = useCallback(async () => {
    if (!barId || !selectedDate || !selectedTime || !selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime
      });

      if (response.data.statusCode === 200) {
        const { tableTypeId, typeName, description, bookingTables } = response.data.data;
        console.log("filter", filteredTables);
        console.log("filterAPI", response.data.data);
      
        setTableTypeInfo({ tableTypeId, typeName, description });
      
        if (bookingTables && bookingTables.length > 0 && bookingTables[0].tables.length > 0) {
          const mergedTables = mergeTables(bookingTables[0], filteredTables);
          console.log("mergedTables", mergedTables);
      
          // Cập nhật state với mergedTables
          setFilteredTables(mergedTables);
        } else {
          setFilteredTables([]);
          setOpenPopup(true);
        }
      }

    } catch (error) {
      console.error("Error fetching filtered tables:", error);
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }, [barId, selectedDate, selectedTime, selectedTableTypeId]);

  useEffect(() => {
    if (hasSearched) {
      fetchFilteredTables();
    }
  }, [selectedDate, selectedTime, fetchFilteredTables, hasSearched]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Không xóa selectedTables nữa
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    // Không xóa selectedTables nữa
  };

  const handleRemoveTable = (tableId) => {
    setSelectedTables((prev) => prev.filter((t) => t.tableId !== tableId));
  };

  const handleTableTypeChange = (tableTypeId) => {
    setSelectedTableTypeId(tableTypeId);
  };

  const handleSearch = async () => {
    if (!barId || !selectedDate || !selectedTime || !selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime
      });


      console.log("filter Response",response)

      if (response.data.statusCode === 200) {
        const { tableTypeId, typeName, description, bookingTables } = response.data.data;
        console.log("filter", filteredTables);
        console.log("filterAPI", response.data.data);
      
        setTableTypeInfo({ tableTypeId, typeName, description });
      
        if (bookingTables && bookingTables.length > 0 && bookingTables[0].tables.length > 0) {
          let filteredTables = bookingTables[0].tables;
          setFilteredTables(filteredTables);
        } else {
          setFilteredTables([]);
          setOpenPopup(true);
        }
      }
    } catch (error) {
      console.error("Error fetching filtered tables:", error);
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]">
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex flex-col w-3/4 max-md:w-full">
            <BookingTableInfo 
              barId={barId} 
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onTableTypeChange={handleTableTypeChange}
              onSearchTables={handleSearch}
              selectedTableTypeId={selectedTableTypeId}
            />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              filteredTables={filteredTables}
              setFilteredTables={setFilteredTables}
              tableTypeInfo={tableTypeInfo}
              isLoading={isLoading}
              hasSearched={hasSearched}
              barId={barId}
              selectedTableTypeId={selectedTableTypeId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
            <TimeSelection 
              startTime={startTime} 
              endTime={endTime} 
              onTimeChange={handleTimeChange}
              selectedDate={selectedDate}
            />
            <CustomerForm 
              selectedTables={selectedTables} 
              barId={barId}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              barInfo={barInfo}  // Thêm dòng này
            />
          </div>
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={uniqueTablesByDateAndTime}
              setSelectedTables={setSelectedTables}
              onRemove={handleRemoveTable}
              barInfo={barInfo}
              barId={barId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        </div>
      </main>
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          {!selectedTableTypeId
            ? "Vui lòng chọn loại bàn trước khi tìm kiếm."
            : "Không có bàn nào phù hợp với thời gian bạn đã chọn. Vui lòng chọn thời gian khác hoặc loại bàn khác."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingTable;
