import React from "react";
import { BarDetail, SelectedList } from "src/pages";

const TableSidebar = ({ selectedTables, setSelectedTables, onRemove, onReleaseList, barInfo, barId, selectedDate, selectedTime }) => {
  return (
    <div className="flex flex-col gap-4 lg:w-full">
      <BarDetail 
        barInfo={barInfo} 
        selectedDate={selectedDate}
      />
      <SelectedList 
        selectedTables={selectedTables} 
        setSelectedTables={setSelectedTables}
        onRemove={onRemove} 
        onReleaseList={onReleaseList}
        barId={barId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default TableSidebar;
