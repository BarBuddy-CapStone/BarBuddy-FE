import React, { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import TableBarIcon from "@mui/icons-material/TableBar";
import { holdTable, releaseTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection } from 'src/lib/Third-party/signalR/hubConnection';

const TableSelection = ({ selectedTables, setSelectedTables, filteredTables, setFilteredTables, tableTypeInfo, isLoading, hasSearched, barId, selectedTableTypeId, selectedDate, selectedTime }) => {
  const { token } = useAuthStore();
  const [heldTables, setHeldTables] = useState({});

  const updateTableHeldStatus = useCallback((tableId, isHeld, holderId) => {
    setHeldTables(prev => ({
      ...prev,
      [tableId]: { isHeld, holderId }
    }));
    
    setFilteredTables(prevTables => 
      prevTables.map(table => 
        table.tableId === tableId 
          ? { ...table, status: isHeld ? 2 : 1, holderId } 
          : table
      )
    );
  }, [setFilteredTables]);

  useEffect(() => {
    console.log("Setting up SignalR listeners");
    
    hubConnection.on("TableHoId", (response) => {
      console.log("Table HoId:", response);
      updateTableHeldStatus(response.tableId, true, response.holderId);
    });

    hubConnection.on("TableReleased", (response) => {
      console.log("Table released:", response);
      updateTableHeldStatus(response.tableId, false, null);
    });

    return () => {
      hubConnection.off("TableHoId");
      hubConnection.off("TableReleased");
    };
  }, [updateTableHeldStatus]);

  const handleTableSelect = async (table) => {
    if (table.status === 1 || table.status === 3) {
      try {
        const data = {
          barId: barId,
          tableId: table.tableId,
          date: selectedDate,
          time: selectedTime + ":00"
        };
        const response = await holdTable(token, data);
        
        if (response.data.statusCode === 200) {
          const holdData = response.data.data;
          setSelectedTables((prevSelectedTables) => [
            ...prevSelectedTables,
            {
              tableId: table.tableId,
              tableName: table.tableName,
              isHeld: holdData.isHeld,
              holdExpiry: new Date(holdData.holdExpiry).getTime(),
              date: holdData.date,
              time: holdData.time
            }
          ]);
          
          updateTableHeldStatus(table.tableId, true, token);
          
          await hubConnection.invoke("HoldTable", {
            barId: barId,
            tableId: table.tableId,
            date: holdData.date,
            time: holdData.time
          });
        } else {
          console.error("Hold table request failed:", response.data);
        }
      } catch (error) {
        console.error("Error holding table:", error);
      }
    }
  };

  const CustomButton = styled(Button)(({ status, isHeld, isCurrentUserHolding }) => ({
    backgroundColor: 
      isCurrentUserHolding ? '#D2691E' :
      isHeld ? '#FFA500' :
      status === 0 ? '#FFA500' :
      '#D3D3D3',  // Màu trắng cho bàn trống
    color: status === 1 || status === 3 ? '#000' : '#fff',
    '&:hover': {
      backgroundColor: 
        isCurrentUserHolding ? '#A0522D' :
        isHeld ? '#FF8C00' :
        status === 0 ? '#FF8C00' :
        '#C0C0C0',
    },
    '&:disabled': {
      backgroundColor: '#FFA500',
      color: '#fff',
    },
    borderRadius: '4px',
    padding: '8px 16px',
  }));

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
              const heldInfo = heldTables[table.tableId] || {};
              const isHeld = heldInfo.isHeld;
              const isCurrentUserHolding = heldInfo.holderId === token;

              return (
                <CustomButton
                  key={table.tableId}
                  onClick={() => (table.status === 1 || table.status === 3) && !isHeld && handleTableSelect(table)}
                  status={table.status}
                  isHeld={isHeld}
                  isCurrentUserHolding={isCurrentUserHolding}
                  disabled={(table.status === 0) || (isHeld && !isCurrentUserHolding)}
                >
                  {table.tableName}
                </CustomButton>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex gap-6 justify-end items-center mt-8 max-w-full text-sm text-center text-zinc-100">
            <div className="flex gap-2 items-center self-stretch my-auto">
              <div className="flex shrink-0 self-stretch my-auto w-6 h-6 rounded bg-[#FFA500]" aria-hidden="true" />
              <div className="self-stretch my-auto">Đã được đặt</div>
            </div>
            <div className="flex gap-2 items-center self-stretch my-auto">
              <div className="flex shrink-0 self-stretch my-auto w-6 h-6 rounded bg-[#D2691E]" aria-hidden="true" />
              <div className="self-stretch my-auto">Đang chọn</div>
            </div>
            <div className="flex gap-2 items-center self-stretch my-auto">
              <div className="flex shrink-0 self-stretch my-auto w-6 h-6 bg-[#D3D3D3] rounded" aria-hidden="true" />
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