import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const TableSelection = ({ selectedTables, setSelectedTables }) => {
  const tables = [
    'TC A01', 'TC A02', 'TC A03', 'TC A04', 'TC A05', 'TC A06', 'TC A07', 'TC A08',
    'TC A09', 'TC A10', 'TC A11', 'TC A12', 'TC A13', 'TC A14', 'TC A15', 'TC A16'
  ];

  const handleTableSelect = (table) => {
    setSelectedTables((prevSelectedTables) => {
      // Toggle table selection
      if (prevSelectedTables.includes(table)) {
        return prevSelectedTables.filter((t) => t !== table);
      } else {
        return [...prevSelectedTables, table];
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
          const status = table === 'TC A05' || table === 'TC A13' ? 'disabled' : selectedTables.includes(table) ? 'selected' : 'available';

          return (
            <CustomButton
              key={table}
              onClick={() => handleTableSelect(table)}
              status={status}
              disabled={status === 'disabled'}
            >
              {table}
            </CustomButton>
          );
        })}
      </div>
      {/* Legend for table selection */}
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
