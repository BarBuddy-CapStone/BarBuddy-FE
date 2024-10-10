import React from "react";
import { BarDetail, SelectedList } from "src/pages";
import useAuthStore from 'src/lib/hooks/useUserStore';

const TableSidebar = ({ selectedTables, setSelectedTables, onRemove, barInfo, barId }) => {
  const { token } = useAuthStore();

  return (
    <div className="flex flex-col gap-4 lg:w-full">
      <BarDetail barInfo={barInfo} />
      <SelectedList 
        selectedTables={selectedTables} 
        setSelectedTables={setSelectedTables}
        onRemove={onRemove} 
        barId={barId}
        token={token}
      />
    </div>
  );
};

export default TableSidebar;