import React from "react";
import { BarDetail, SelectedList } from "src/pages";

const TableSidebar = ({ selectedTables, setSelectedTables, onRemove, barInfo }) => {
  return (
    <div className="flex flex-col gap-4 lg:w-full">
      <BarDetail barInfo={barInfo} />
      <SelectedList 
        selectedTables={selectedTables} 
        setSelectedTables={setSelectedTables}
        onRemove={onRemove} 
      />
    </div>
  );
};

export default TableSidebar;
