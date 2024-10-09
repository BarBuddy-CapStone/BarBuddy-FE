import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getBarTableById } from "src/lib/service/customerService";
import { filterBookingTable } from "src/lib/service/BookingTableService";
import CustomerForm from './components/CustomerForm';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import dayjs from "dayjs";

import {
  BookingTableInfo,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};

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

  const fetchFilteredTables = async () => {
    if (!barId || !selectedDate || !selectedTime || !selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }

    try {
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime
      });

      console.log("Filter response:", response.data);

      if (response.status === 200) {
        const { tableTypeId, typeName, description, bookingTables } = response.data.data;
        setTableTypeInfo({ tableTypeId, typeName, description });
        if (bookingTables && bookingTables.length > 0 && bookingTables[0].tables.length > 0) {
          console.log("Filtered tables:", bookingTables[0].tables);
          setFilteredTables(bookingTables[0].tables);
        } else {
          setFilteredTables([]);
          setOpenPopup(true);
        }
      }
    } catch (error) {
      console.error("Error fetching filtered tables:", error);
      setOpenPopup(true);
    }
    setHasSearched(true);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleRemoveTable = (tableId) => {
    setSelectedTables((prev) => prev.filter((t) => t.tableId !== tableId));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTableTypeChange = (tableTypeId) => {
    setSelectedTableTypeId(tableTypeId);
  };

  const handleSearchTables = async () => {
    if (!selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }
    setIsLoading(true);
    await fetchFilteredTables();
    setIsLoading(false);
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
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onTableTypeChange={handleTableTypeChange}
              onSearchTables={handleSearchTables}
              selectedTableTypeId={selectedTableTypeId}  // Truyền prop này
            />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              filteredTables={filteredTables}
              tableTypeInfo={tableTypeInfo}
              isLoading={isLoading}
              hasSearched={hasSearched}
            />
            <TimeSelection 
              startTime={startTime} 
              endTime={endTime} 
              onTimeChange={handleTimeChange}
            />
            <CustomerForm 
              selectedTables={selectedTables} 
              barId={barId}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
            />
          </div>
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              onRemove={handleRemoveTable}
              barInfo={barInfo}
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