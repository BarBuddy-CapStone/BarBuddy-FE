import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { getBarTableById } from "src/lib/service/customerService";

import {
  BookingTableInfo,
  CustomerForm,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};

  const [tables, setTables] = useState([]);
  const [barInfo, setBarInfo] = useState({});
  const [selectedTables, setSelectedTables] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await getBarTableById(barId);
        if (response.status === 200) {
          setTables(response.data.data.tables); // Set the tables data
          setBarInfo({
            name: response.data.data.barName,
            location: response.data.data.address,
            openingHours: `${response.data.data.startTime.slice(0, 5)} - ${response.data.data.endTime.slice(0, 5)}`,
            description: response.data.data.description,
            // Add any other fields you need to pass to the components
          });
        } else {
          console.error('Failed to fetch table data');
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    if (barId) {
      fetchTableData();
    }
  }, [barId]);

  const handleRemoveTable = (table) => {
    setSelectedTables((prev) => prev.filter((t) => t !== table));
  };

  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]">
        <div className="flex gap-2 max-md:flex-col">
          {/* Left Content: 3/4 Width */}
          <div className="flex flex-col w-3/4 max-md:w-full">
            <BookingTableInfo barInfo={barInfo} />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              tables={tables} // Pass the tables data to the component
            />
            <TimeSelection />
            <CustomerForm selectedTables={selectedTables} />
          </div>

          {/* Right Sidebar: 1/4 Width */}
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={selectedTables}
              onRemove={handleRemoveTable}
              barInfo={barInfo}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingTable;
