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
  const [tableStatuses, setTableStatuses] = useState({});
  const prevSearchParamsRef = useRef({ barId, selectedTableTypeId, selectedDate, selectedTime });
  
  const updateTableStatus = useCallback((tableId, isHeld) => {
    setTableStatuses(prev => ({
      ...prev,
      [tableId]: isHeld
    }));
    setFilteredTables(prev => prev.map(table => 
      table.tableId === tableId ? { ...table, status: isHeld ? 2 : 1 } : table
    ));
  }, [setFilteredTables]);

  useEffect(() => {
    console.log("Setting up SignalR listeners");
    
    hubConnection.on("TableHoId", (tableId) => {
      console.log("Table held:", tableId);
      updateTableStatus(tableId, true);
    });

    hubConnection.on("BookedTable", (tableId) => {
      console.log("Table booked:", tableId);
      updateTableStatus(tableId, true);
    });

    hubConnection.on("TableReleased", (tableId) => {
      console.log("Table released:", tableId);
      updateTableStatus(tableId, false);
    });

    return () => {
      hubConnection.off("TableHoId");
      hubConnection.off("BookedTable");
      hubConnection.off("TableReleased");
    };
  }, [updateTableStatus]);

  const syncTableStatusesWithSignalR = useCallback(async (tables) => {
    const updatedTables = await Promise.all(tables.map(async (table) => {
      const signalRStatus = await getTableStatusFromSignalR(barId, table.tableId);
      return {
        ...table,
        status: signalRStatus !== null ? (signalRStatus ? 2 : 1) : table.status
      };
    }));
    setFilteredTables(updatedTables);
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
          await syncTableStatusesWithSignalR(tables);
          prevSearchParamsRef.current = currentSearchParams;
        }
      } catch (error) {
        console.error("Error fetching initial table statuses:", error);
      }
    }
  }, [barId, selectedTableTypeId, selectedDate, selectedTime, hasSearched, syncTableStatusesWithSignalR]);

  useEffect(() => {
    fetchInitialTableStatuses();
  }, [fetchInitialTableStatuses]);

  useEffect(() => {
    console.log("Current table statuses:", tableStatuses);
  }, [tableStatuses]);

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
          updateTableStatus(table.tableId, holdData.isHeld);
        }
      } catch (error) {
        console.error("Error holding table:", error);
      }
    } else {
      setSelectedTables((prevSelectedTables) =>
        prevSelectedTables.filter((t) => t.tableId !== table.tableId)
      );
    }
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
    if (tableStatuses[table.tableId]) {
      return 'unavailable';
    }
    return [1, 3].includes(table.status) ? 'available' : 'unavailable';
  };

  const handleRefresh = async () => {
    try {
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime
      });
      if (response.status === 200) {
        const tables = response.data.data.bookingTables[0].tables;
        await syncTableStatusesWithSignalR(tables);
      }
    } catch (error) {
      console.error("Error refreshing tables:", error);
    }
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
          <Button onClick={handleRefresh}>Refresh Tables</Button>
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