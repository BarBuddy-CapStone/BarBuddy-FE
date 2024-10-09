import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getBarTableById } from "src/lib/service/customerService";
import CustomerForm from './components/CustomerForm';

import {
  BookingTableInfo,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};

  const [tables, setTables] = useState([]);
  const [barInfo, setBarInfo] = useState({});
  const [startTime, setStartTime] = useState(""); // State for startTime
  const [endTime, setEndTime] = useState(""); // State for endTime
  const [selectedTime, setSelectedTime] = useState(""); // State for capturing selected time
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0].replace(/\//g, '-')); // Khởi tạo với ngày hiện tại, sử dụng dấu gạch ngang

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await getBarTableById(barId);
        if (response.status === 200) {
          setTables(response.data.data.tables); // Set the tables data

          // Set startTime and endTime correctly
          setStartTime(response.data.data.startTime.slice(0, 5));
          setEndTime(response.data.data.endTime.slice(0, 5));

          // Set barInfo for the sidebar or other components
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

  // Function to handle time changes from TimeSelection component
  const handleTimeChange = (time) => {
    setSelectedTime(time); // Set the selected time
  };

  const handleRemoveTable = (tableId) => {
    setSelectedTables((prev) => prev.filter((t) => t.tableId !== tableId));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString().split('T')[0].replace(/\//g, '-'));
  };

  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]">
        <div className="flex gap-2 max-md:flex-col">
          {/* Left Content: 3/4 Width */}
          <div className="flex flex-col w-3/4 max-md:w-full">
            <BookingTableInfo 
              barId={barId} 
              setTables={setTables} 
              selectedTime={selectedTime} // Pass selected time
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              tables={tables} // Pass the tables data to the component
            />
            {/* Pass startTime, endTime, and handleTimeChange to TimeSelection */}
            <TimeSelection 
              startTime={startTime} 
              endTime={endTime} 
              onTimeChange={handleTimeChange} // Handle time changes
            />
            <CustomerForm 
              selectedTables={selectedTables} 
              barId={barId}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
            />
          </div>

          {/* Right Sidebar: 1/4 Width */}
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              onRemove={handleRemoveTable}
              barInfo={barInfo} // Bar info for sidebar if needed
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingTable;
