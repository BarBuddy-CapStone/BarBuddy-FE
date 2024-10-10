import React, { useEffect, useState, useCallback, useRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import TableBarIcon from "@mui/icons-material/TableBar";
import { holdTable, filterBookingTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection, getTableStatusFromSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';

const TableSelection = ({ selectedTables, setSelectedTables, filteredTables, setFilteredTables, tableTypeInfo, isLoading, hasSearched, barId, selectedTableTypeId, selectedDate, selectedTime }) => {
  const { token } = useAuthStore();
  const [heldTables, setHeldTables] = useState({});
  const prevSearchParamsRef = useRef({ barId, selectedTableTypeId, selectedDate, selectedTime });
  
  const updateTableHeldStatus = useCallback((tableId, isHeld) => {
    setHeldTables(prev => ({
      ...prev,
      [tableId]: isHeld
    }));
  }, []);

  useEffect(() => {
    console.log("Setting up SignalR listeners");
    
    hubConnection.on("TableHoId", (tableId) => {
      console.log("Table held:", tableId);
      updateTableHeldStatus(tableId, true);
    });

    hubConnection.on("TableReleased", (tableId) => {
      console.log("Table released:", tableId);
      updateTableHeldStatus(tableId, false);
    });

    return () => {
      hubConnection.off("TableHoId");
      hubConnection.off("TableReleased");
    };
  }, [updateTableHeldStatus]);

  const syncTableStatusesWithSignalR = useCallback(async (tables) => {
    const updatedHeldStatuses = {};
    await Promise.all(tables.map(async (table) => {
      const isHeld = await getTableStatusFromSignalR(barId, table.tableId);
      updatedHeldStatuses[table.tableId] = isHeld;
    }));
    setHeldTables(updatedHeldStatuses);
  }, [barId]);

  const fetchInitialTableStatuses = useCallback(async () => {
    const currentSearchParams = { barId, selectedTableTypeId, selectedDate, selectedTime };
    const prevSearchParams = prevSearchParamsRef.current;

    if (
      !hasSearched ||
      currentSearchParams.barId !== prevSearchParams.barId ||
      currentSearchParams.selectedTableTypeId !== prevSearchParams.selectedTableTypeId ||
      currentSearchParams.selectedDate !== prevSearchParams.selectedDate ||
      currentSearchParams.selectedTime !== prevSearchParams.selectedTime
    ) {
      try {
        const response = await filterBookingTable({
          barId,
          tableTypeId: selectedTableTypeId,
          date: dayjs(selectedDate).format("YYYY/MM/DD"),
          time: selectedTime
        });
        if (response.status === 200) {
          const tables = response.data.data.bookingTables[0].tables;
          setFilteredTables(tables);
          await syncTableStatusesWithSignalR(tables);
          prevSearchParamsRef.current = currentSearchParams;
        }
      } catch (error) {
        console.error("Error fetching initial table statuses:", error);
      }
    }
  }, [barId, selectedTableTypeId, selectedDate, selectedTime, hasSearched, syncTableStatusesWithSignalR, setFilteredTables]);

  useEffect(() => {
    fetchInitialTableStatuses();
  }, [fetchInitialTableStatuses]);

  const handleTableSelect = async (table) => {
    if (table.status === 1 || table.status === 3) {
      try {
        const data = {
          barId: barId,
          tableId: table.tableId
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
              holdExpiry: new Date(holdData.holdExpiry).getTime()
            }
          ]);
          updateTableHeldStatus(table.tableId, true);
        }
      } catch (error) {
        console.error("Error holding table:", error);
      }
    }
  };

  const CustomButton = styled(Button)(({ status, isHeld, isSelected }) => ({
    backgroundColor: 
      isSelected ? '#D2691E' :  // Nâu nhạt cho "đang chọn"
      isHeld || status === 0 || status === 2 ? '#FFA500' :  // Cam cho "đã hết bàn"
      '#D3D3D3',  // Xám nhạt cho "trống"
    color: status === 1 || status === 3 ? '#000' : '#fff',
    '&:hover': {
      backgroundColor: 
        isSelected ? '#A0522D' :
        isHeld || status === 0 || status === 2 ? '#FF8C00' :
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
              const isSelected = selectedTables.some((t) => t.tableId === table.tableId);
              const isHeld = heldTables[table.tableId];

              return (
                <CustomButton
                  key={table.tableId}
                  onClick={() => (table.status === 1 || table.status === 3) && !isHeld && handleTableSelect(table)}
                  status={table.status}
                  isHeld={isHeld}
                  isSelected={isSelected}
                  disabled={(table.status === 0 || table.status === 2) || (isHeld && !isSelected)}
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