import React, { useState } from "react";
import {
  BookingTableInfo,
  CustomerForm,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const [selectedTables, setSelectedTables] = useState([]);
  const barInfo = {
    name: "BarBuddy 1",
    location: "87A Hàm Nghi, Phường Nguyễn Thái Bình, Quận 1",
    openingHours: "10:30 PM - 02:00 AM",
  };

  const handleRemoveTable = (table) => {
    setSelectedTables((prev) => prev.filter((t) => t !== table));
  };

  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]">
        <div className="flex gap-2 max-md:flex-col">
          {/* Left Content: 3/4 Width */}
          <div className="flex flex-col w-3/4 max-md:w-full">
            <BookingTableInfo />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
            />
            <TimeSelection />
            {/* Truyền selectedTables vào CustomerForm */}
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
