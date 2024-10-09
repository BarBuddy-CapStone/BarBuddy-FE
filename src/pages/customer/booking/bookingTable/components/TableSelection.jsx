import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import TableBarIcon from "@mui/icons-material/TableBar";

const TableSelection = ({ selectedTables, setSelectedTables, filteredTables, tableTypeInfo, isLoading, hasSearched }) => {
  
  const handleTableSelect = (table) => {
    setSelectedTables((prevSelectedTables) => {
      if (prevSelectedTables.some((t) => t.tableId === table.tableId)) {
        return prevSelectedTables.filter((t) => t.tableId !== table.tableId);
      } else {
        return [...prevSelectedTables, { tableId: table.tableId, tableName: table.tableName }];
      }
    });
  };

  const CustomButton = styled(Button)(({ status }) => ({
    backgroundColor: status === 'selected' ? '#757575' : status === 'unavailable' ? '#9e9e9e' : '#FFA500',
    color: status === 'selected' || status === 'unavailable' ? '#fff' : '#000',
    '&:hover': {
      backgroundColor: status === 'selected' ? '#616161' : status === 'unavailable' ? '#9e9e9e' : '#FF8C00',
    },
    '&:disabled': {
      backgroundColor: '#9e9e9e',
      color: '#fff',
    },
    borderRadius: '4px',
    padding: '8px 16px',
  }));

  const getTableStatus = (table) => {
    return [1, 3].includes(table.status) ? 'available' : 'unavailable';
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg leading-none mb-2 text-amber-400">Chọn Bàn</h3>
      {tableTypeInfo && (
        <div className="flex items-center mb-4">
          <TableBarIcon sx={{ color: "#FFA500", marginRight: "8px" }} />
          <h4 className="text-md leading-none text-white">{tableTypeInfo.typeName}</h4>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress size={40} style={{ color: '#FFA500' }} />
        </div>
      ) : hasSearched && filteredTables.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-3.5 items-start text-center text-black max-md:max-w-full">
            {filteredTables.map((table) => {
              const status = getTableStatus(table);
              const isSelected = selectedTables.some((t) => t.tableId === table.tableId);

              return (
                <CustomButton
                  key={table.tableId}
                  onClick={() => status === 'available' && handleTableSelect(table)}
                  status={isSelected ? 'selected' : status}
                  disabled={status === 'unavailable'}
                >
                  {table.tableName}
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
        </>
      ) : hasSearched ? (
        <p className="text-white">Không tìm thấy bàn nào phù hợp. Vui lòng thử lại với các tiêu chí khác.</p>
      ) : (
        <p className="text-white">Vui lòng chọn ngày, giờ và loại bàn, sau đó nhấn "Tìm Bàn" để xem các bàn có sẵn.</p>
      )}

    </div>
  );
};

export default TableSelection;