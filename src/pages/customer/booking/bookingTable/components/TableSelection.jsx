import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const TableSelection = ({ selectedTables, setSelectedTables, tables }) => {
  
  const handleTableSelect = (table) => {
    setSelectedTables((prevSelectedTables) => {
      // Toggle table selection
      if (prevSelectedTables.some((t) => t.tableId === table.tableId)) {
        return prevSelectedTables.filter((t) => t.tableId !== table.tableId); // Deselect the table
      } else {
        // Chỉ thêm các thuộc tính cần thiết
        return [...prevSelectedTables, { tableId: table.tableId, tableName: table.tableName }];
      }
    });
  };

  const CustomButton = styled(Button)(({ status }) => ({
    backgroundColor: status === 'selected' ? '#757575' : status === 'disabled' ? '#9e9e9e' : '#FFA500',
    color: status === 'selected' || status === 'disabled' ? '#fff' : '#000',
    '&:hover': {
      backgroundColor: status === 'selected' ? '#616161' : status === 'disabled' ? '#9e9e9e' : '#FF8C00',
    },
    '&:disabled': {
      backgroundColor: '#9e9e9e',
      color: '#fff',
    },
    borderRadius: '4px',
    padding: '8px 16px',
  }));

  return (
    <div className="mt-6">
      <h3 className="text-lg leading-none mb-4 text-amber-400">Chọn Bàn</h3>
      <div className="flex flex-wrap gap-3.5 items-start text-center text-black max-md:max-w-full">
        {tables.map((table) => {
          const status = table.status === 1 ? 'disabled' : selectedTables.some((t) => t.tableId === table.tableId) ? 'selected' : 'available';

          return (
            <CustomButton
              key={table.tableId}
              onClick={() => handleTableSelect(table)}
              status={status}
              disabled={status === 'disabled'}
            >
              {table.tableName} {/* Display the table name */}
            </CustomButton>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-end items-center mt-8 max-w-full text-sm text-center text-zinc-100">
        <div className="flex gap-2 items-center self-stretch my-auto">
          <div className="flex shrink-0 self-stretch my-auto w-6 h-6 rounded bg-neutral-500" aria-hidden="true" />
          <div className="self-stretch my-auto">Đã hết bàn</div>
        </div>
        <div className="flex gap-2 items-center self-stretch my-auto">
          <div className="flex shrink-0 self-stretch my-auto w-6 h-6 rounded bg-stone-600" aria-hidden="true" />
          <div className="self-stretch my-auto">Đang chọn</div>
        </div>
        <div className="flex gap-2 items-center self-stretch my-auto">
          <div className="flex shrink-0 self-stretch my-auto w-6 h-6 bg-amber-400 rounded" aria-hidden="true" />
          <div className="self-stretch my-auto">Trống</div>
        </div>
      </div>
    </div>
  );
};

export default TableSelection;
