import React, { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import TableBarIcon from "@mui/icons-material/TableBar";
import { holdTable, releaseTable, getAllHoldTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';
import { toast } from "react-toastify";

const TableSelection = (
  { selectedTables,
    setSelectedTables,
    filteredTables,
    setFilteredTables,
    tableTypeInfo, isLoading,
    hasSearched,
    barId,
    selectedTableTypeId,
    selectedDate,
    selectedTime,
    onTableSelect
  }) => {
  const { token, userInfo } = useAuthStore();
  const [heldTables, setHeldTables] = useState({});
  const [currentHoldCount, setCurrentHoldCount] = useState(0);
  const [heldTableIds, setHeldTableIds] = useState(new Set());

  const updateTableHeldStatus = useCallback((tableId, isHeld, holderId, date, time) => {
    console.log("Updating table held status:", { tableId, isHeld, holderId, date, time });
    
    setHeldTableIds(prev => {
      const newSet = new Set(prev);
      if (isHeld) {
        newSet.add(tableId);
      } else {
        newSet.delete(tableId);
      }
      return newSet;
    });

    setFilteredTables(prevTables =>
      prevTables.map(table => {
        if (table.tableId === tableId) {
          return {
            ...table,
            status: isHeld ? 2 : 1,
            isHeld: isHeld,
            holderId: holderId,
            date: date,
            time: time
          };
        }
        return table;
      }) 
    );
  }, []);

  const handleTableListRelease = useCallback((response) => {
    console.log("Table list released event received:", response);
    if (response.tables && Array.isArray(response.tables)) {
      const releasedTableIds = response.tables.map(t => t.tableId);
      setHeldTableIds(prev => {
        const newSet = new Set(prev);
        releasedTableIds.forEach(id => newSet.delete(id));
        return newSet;
      });

      setFilteredTables(prevTables => 
        prevTables.map(table => {
          if (releasedTableIds.includes(table.tableId)) {
            return {
              ...table,
              status: 1,
              isHeld: false,
              holderId: null,
              date: null,
              time: null
            };
          }
          return table;
        })
      );
    }
  }, []);

  useEffect(() => {
    const handleTableStatusChange = (event) => {
      const { tableId, isHeld, holderId, accountId, status, date, time } = event.detail;
      console.log("TableSelection received tableStatusChanged:", event.detail);
      
      setFilteredTables(prevTables =>
        prevTables.map(table => {
          if (table.tableId === tableId) {
            return {
              ...table,
              status: status || (isHeld ? 2 : 1),
              isHeld: isHeld,
              holderId: holderId,
              accountId: accountId,
              date: date,
              time: time
            };
          }
          return table;
        })
      );
    };

    const handleTableListStatusChange = (event) => {
      const { tables, barId, date, time } = event.detail;
      console.log("TableSelection received tableListStatusChanged:", {
        tables,
        barId,
        date,
        time,
        currentFilteredTables: filteredTables
      });

      if (!tables || !Array.isArray(tables)) {
        console.error("Invalid tables data:", tables);
        return;
      }

      setFilteredTables(prevTables => {
        const updatedTables = prevTables.map(table => {
          const updatedTable = tables.find(t => t.tableId === table.tableId);
          if (updatedTable) {
            console.log(`Updating table ${table.tableId} status to available`);
            return {
              ...table,
              status: 1,
              isHeld: false,
              holderId: null,
              accountId: null,
              date: null,
              time: null
            };
          }
          return table;
        });
        console.log("Updated filteredTables:", updatedTables);
        return updatedTables;
      });
    };

    document.addEventListener('tableStatusChanged', handleTableStatusChange);
    document.addEventListener('tableListStatusChanged', handleTableListStatusChange);
    console.log("TableListStatusChanged event listener added");

    return () => {
      document.removeEventListener('tableStatusChanged', handleTableStatusChange);
      document.removeEventListener('tableListStatusChanged', handleTableListStatusChange);
      console.log("TableListStatusChanged event listener removed");
    };
  }, [filteredTables]);

  useEffect(() => {
    const checkHoldTables = async () => {
      if (barId && selectedDate && selectedTime) {
        try {
          const response = await getAllHoldTable(token, barId, selectedDate, selectedTime);
          if (response.data.statusCode === 200) {
            const userHoldTables = response.data.data.filter(
              table => table.accountId === userInfo.accountId
            );
            setCurrentHoldCount(userHoldTables.length);
          }
        } catch (error) {
          console.error("Error checking hold tables:", error);
        }
      }
    };

    checkHoldTables();
  }, [barId, selectedDate, selectedTime, token, userInfo.accountId]);

  const handleTableSelect = async (table) => {
    if (currentHoldCount >= 5) {
      toast.error("Bạn chỉ được phép giữ tối đa 5 bàn cùng lúc.");
      return;
    }

    if (table.isHeld || table.status === 2) {
      console.log("Table is already held:", table.tableId);
      return;
    }

    if (table.status === 1 || table.status === 3) {
      try {
        const data = {
          barId: barId,
          tableId: table.tableId,
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
          time: selectedTime + ":00"
        };

        console.log("Sending holdTable request:", data);
        const response = await holdTable(token, data);

        if (response.data.statusCode === 200) {
          const holdData = response.data.data;
          const newSelectedTable = {
            tableId: table.tableId,
            tableName: table.tableName,
            isHeld: true,
            holdExpiry: new Date(holdData.holdExpiry).getTime(),
            date: holdData.date,
            time: holdData.time,
            holderId: holdData.accountId,
            accountId: holdData.accountId
          };

          // Cập nhật UI
          setHeldTableIds(prev => new Set([...prev, table.tableId]));
          onTableSelect(newSelectedTable);

          // Gửi SignalR
          await hubConnection.invoke("HoldTable", {
            barId: barId,
            tableId: table.tableId,
            date: holdData.date,
            time: holdData.time,
            accountId: holdData.accountId
          });

          // Cập nhật số lượng bàn đang giữ
          setCurrentHoldCount(prev => prev + 1);
        }
      } catch (error) {
        if (error.response?.data?.statusCode === 400 && 
            error.response?.data?.message?.includes("Bạn chỉ được phép giữ tối đa 5 bàn")) {
          toast.error("Bạn chỉ được phép giữ tối đa 5 bàn cùng lúc.");
        } else {
          console.error("Error holding table:", error);
          toast.error("Có lỗi xảy ra khi giữ bàn");
        }
      }
    }
  };

  const handleTableRelease = async (tableId) => {
    const table = selectedTables.find(t => t.tableId === tableId);
    if (table) {
      try {
        const data = {
          barId: barId,
          tableId: tableId,
          date: table.date,
          time: table.time
        };
        const response = await releaseTable(token, data);
        if (response.data.statusCode === 200) {
          setSelectedTables(prev => prev.filter(t => t.tableId !== tableId));
          updateTableHeldStatus(tableId, false, null, null, null);
          await hubConnection.invoke("ReleaseTable", data);
        }
      } catch (error) {
        console.error("Error releasing table:", error);
      }
    }
  };

  const CustomButton = styled(Button)(({ status, isHeld, isCurrentUserHolding }) => ({
    backgroundColor: 
      isCurrentUserHolding ? '#D2691E' :
      isHeld ? '#FFA500' :
      status === 0 ? '#FFA500' :
      status === 2 ? '#FFA500' :
      '#D3D3D3',
    color: '#fff',
    '&:hover': {
      backgroundColor: 
        isCurrentUserHolding ? '#A0522D' :
        isHeld ? '#FF8C00' :
        status === 0 ? '#FF8C00' :
        status === 2 ? '#FF8C00' :
        '#C0C0C0',
    },
    '&:disabled': {
      backgroundColor: status === 1 || status === 3 ? '#A9A9A9' : '#FFA500',
      color: '#fff',
      opacity: 0.7,
    },
    borderRadius: '4px',
    padding: '8px 16px',
  }));

  const isTableHeldForCurrentTime = (table) => {
    return table.isHeld && 
           dayjs(table.date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
           table.time === selectedTime + ":00";
  };

  const isTableDisabled = useCallback((table) => {
    const isCurrentUserHolding = table.isHeld && table.holderId === userInfo.accountId;
    const isAvailable = table.status === 1 || table.status === 3;
    return (!isAvailable && !isCurrentUserHolding) || 
           (currentHoldCount >= 5 && !isCurrentUserHolding);
  }, [currentHoldCount, userInfo.accountId]);

  const getButtonStyle = useCallback((table) => {
    const isCurrentUserHolding = table.isHeld && table.holderId === userInfo.accountId;
    const isHeld = table.isHeld || table.status === 2;
    
    return {
      backgroundColor: 
        isCurrentUserHolding ? '#D2691E' :
        isHeld ? '#FFA500' :
        table.status === 0 ? '#FFA500' :
        table.status === 1 ? '#D3D3D3' :
        '#FFA500',
      cursor: isTableDisabled(table) ? 'not-allowed' : 'pointer',
      opacity: isTableDisabled(table) ? 0.5 : 1,
    };
  }, [isTableDisabled, userInfo.accountId]);

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
            {filteredTables.map(table => (
              <CustomButton
                key={table.tableId}
                onClick={() => !isTableDisabled(table) && handleTableSelect(table)}
                status={table.status}
                isHeld={table.isHeld}
                isCurrentUserHolding={table.holderId === userInfo.accountId}
                disabled={isTableDisabled(table)}
                sx={getButtonStyle(table)}
              >
                {table.tableName}
              </CustomButton>
            ))}
          </div>

          {currentHoldCount >= 5 && (
            <div className="text-red-500 text-sm mt-4 text-center">
              Bạn đã giữ tối đa 5 bàn. Vui lòng hủy bớt bàn trước khi chọn thêm.
            </div>
          )}

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
