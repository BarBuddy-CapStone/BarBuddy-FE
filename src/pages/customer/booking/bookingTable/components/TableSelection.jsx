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

  const updateTableHeldStatus = useCallback((tableId, isHeld, holderId, date, time) => {
    console.log("Updating table held status:", { tableId, isHeld, holderId, date, time });
    setHeldTables(prev => ({
      ...prev,
      [tableId]: { isHeld, holderId, date, time }
    }));

    setFilteredTables(prevTables =>
      prevTables.map(table => {
        if (table.tableId === tableId) {
          console.log("Updating table:", { ...table, status: isHeld ? 2 : 1, holderId, date, time, isHeld });
        }
        return table.tableId === tableId 
          ? { ...table, status: isHeld ? 2 : 1, holderId, date, time, isHeld }
          : table
      })
    );
  }, [setFilteredTables]);

  useEffect(() => {
    console.log("Setting up SignalR listeners");

    hubConnection.on("TableHoId", (response) => {
      console.log("Table HoId:", response);
      updateTableHeldStatus(response.tableId, true, response.accountId, response.date, response.time);
    });

    hubConnection.on("TableReleased", (response) => {
      console.log("Table released:", response);
      updateTableHeldStatus(response.tableId, false, null, response.date, response.time);
    });

    hubConnection.on("TableListReleased", (barId) => {
      console.log("Table list released for bar:", barId);
      if (barId === barId) {
        // Cập nhật trạng thái của tất cả các bàn về trạng thái trống
        setFilteredTables(prevTables => 
          prevTables.map(table => ({
            ...table,
            status: 1,
            isHeld: false,
            holderId: null
          }))
        );
      }
    });

    return () => {
      hubConnection.off("TableHoId");
      hubConnection.off("TableReleased");
      hubConnection.off("TableListReleased");
    };
  }, [barId, updateTableHeldStatus]);

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
      toast.error("Bạn chỉ được phép giữ tối đa 5 bàn cùng lúc.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (table.status === 1 || table.status === 3) {
      onTableSelect(table);
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
          updateTableHeldStatus(tableId, false, null, table.date, table.time);
          await hubConnection.invoke("ReleaseTable", data);
        } else {
          console.error("Release table request failed:", response.data);
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
      status === 0 || status === 2 ? '#FFA500' :
      '#D3D3D3',
    color: '#fff',
    '&:hover': {
      backgroundColor: 
        isCurrentUserHolding ? '#A0522D' :
        isHeld ? '#FF8C00' :
        status === 0 || status === 2 ? '#FF8C00' :
        '#C0C0C0',
    },
    '&:disabled': {
      backgroundColor: status === 1 ? '#A9A9A9' : '#FFA500',
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
            {filteredTables.map(table => {
              const isCurrentUserHolding = table.isHeld && table.holderId === userInfo.accountId;
              const isAvailable = table.status === 1 || table.status === 3;
              const isDisabled = (!isAvailable && !isCurrentUserHolding) || 
                               (currentHoldCount >= 5 && !isCurrentUserHolding);
              
              return (
                <CustomButton
                  key={table.tableId}
                  onClick={() => isCurrentUserHolding ? handleTableRelease(table.tableId) : handleTableSelect(table)}
                  status={table.status}
                  isHeld={table.isHeld}
                  isCurrentUserHolding={isCurrentUserHolding}
                  disabled={isDisabled}
                  sx={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  {table.tableName}
                </CustomButton>
              );
            })}
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
