import React, { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import TableBarIcon from "@mui/icons-material/TableBar";
import { holdTable, releaseTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';

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
    selectedTime
  }) => {
  const { token, userInfo } = useAuthStore();
  const [heldTables, setHeldTables] = useState({});

  console.log("he", heldTables)
  console.log("date", selectedDate)
  console.log("time", selectedTime)
  
  console.log("acc", userInfo.accountId)
  const updateTableHeldStatus = useCallback((tableId, isHeld, holderId, date, time) => {
    setHeldTables(prev => ({
      ...prev,
      [tableId]: { isHeld, holderId, date, time }
    }));

    setFilteredTables(prevTables =>
      prevTables.map(table =>
        table.tableId === tableId
          ? { ...table, status: isHeld ? 2 : 1, holderId, date, time, isHeld }
          : table
      )
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
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
          time: selectedTime + ":00"
        };
        const response = await holdTable(token, data);

        if (response.data.statusCode === 200) {
          const holdData = response.data.data;
          const newSelectedTable = {
            tableId: table.tableId,
            tableName: table.tableName,
            isHeld: true,
            holdExpiry: new Date(holdData.holdExpiry).getTime(),
            date: holdData.date,
            time: holdData.time
          };
          setSelectedTables(prevSelectedTables => [...prevSelectedTables, newSelectedTable]);

          // Cập nhật trạng thái bàn ngay lập tức
          updateTableHeldStatus(table.tableId, true, accountId, holdData.date, holdData.time);

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
      isCurrentUserHolding ? '#D2691E' :  // Nâu xám cho bàn đang được chọn bởi người dùng hiện tại
      isHeld ? '#FFA500' :  // Cam cho bàn đã được đặt bởi người khác
      status === 0 || status === 2 ?  '#FFA500' :  // Cam cho bàn không khả dụng
      '#D3D3D3',  // Xám nhạt cho bàn trống
    color: '#fff',
    '&:hover': {
      backgroundColor: 
        isCurrentUserHolding ? '#A0522D' :
        isHeld ? '#FF8C00' :
        status === 0 || status === 2 ? '#FF8C00' :
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
        {console.log("fiter", filteredTables)}
          <div className="flex flex-wrap gap-3.5 items-start text-center text-black max-md:max-w-full">
            {filteredTables.map(table => {
              // const isCurrentUserHolding = table.isHeld && table.holderId === userInfo.accountId &&
              //   dayjs(table.date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
              //   table.time === selectedTime + ":00";
                const isCurrentUserHolding = table.isHeld && table.holderId === userInfo.accountId &&
                dayjs(table.date).format('YYYY-MM-DD') === dayjs(selectedDate).format('YYYY-MM-DD') &&
                table.time === selectedTime + ":00";
                {console.log("g", table)}
              console.log("Current", isCurrentUserHolding)
              return (
                <CustomButton
                  key={table.tableId}
                  onClick={() => isCurrentUserHolding ? handleTableRelease(table.tableId) : handleTableSelect(table)}
                  status={table.status}
                  isHeld={table.isHeld}
                  isCurrentUserHolding={isCurrentUserHolding}
                  disabled={table.status === 0 || (table.isHeld && !isCurrentUserHolding)}
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