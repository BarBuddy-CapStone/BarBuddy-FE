import React from "react";
import { BarDetail, SelectedList } from "src/pages";

const TableSidebar = ({ selectedTables, setSelectedTables, barId, selectedDate, selectedTime, barInfo }) => {
  return (
    <div className="flex flex-col gap-4 lg:w-full">
      <BarDetail 
        barInfo={barInfo} 
        selectedDate={selectedDate}
      />
      <SelectedList 
        selectedTables={selectedTables} 
        setSelectedTables={setSelectedTables}
        barId={barId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default TableSidebar;
