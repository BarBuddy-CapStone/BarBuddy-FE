import React, { useState, useEffect, useCallback } from "react";
import { releaseTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection, releaseTableSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';

const SelectedList = ({ selectedTables, setSelectedTables, onRemove, barId, selectedDate, selectedTime }) => {
  const [countdowns, setCountdowns] = useState({});
  const { token } = useAuthStore();
  const handleExpiredTable = useCallback(async (tableId, date, time) => {
    if (!date || !time) {
      console.error("date or time is missing");
      return;
    }
    try {
      const data = {
        barId: barId,
        tableId: tableId,
        date: date,
        time: time
      };
      const response = await releaseTable(token, data);
      if (response.data.statusCode === 200) {
        onRemove(tableId);
        await releaseTableSignalR(data);
      }
    } catch (error) {
      console.error("Error releasing expired table:", error);
    }
  }, [barId, onRemove, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const updatedCountdowns = {};
      let tablesChanged = false;

      selectedTables.forEach(table => {
        if (table.holdExpiry) {
          const timeLeft = Math.max(0, Math.floor((table.holdExpiry - now) / 1000));
          updatedCountdowns[table.tableId] = timeLeft;

          if (timeLeft === 0 && countdowns[table.tableId] !== 0) {
            handleExpiredTable(table.tableId, table.date, table.time);
            tablesChanged = true;
          }
        }
      });

      setCountdowns(updatedCountdowns);

      if (tablesChanged) {
        setSelectedTables(prev => prev.filter(table => updatedCountdowns[table.tableId] > 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTables, handleExpiredTable, setSelectedTables, countdowns]);

  const handleRemove = async (tableId, date, time) => {
    if (!date || !time) {
      console.error("date or time is missing");
      return;
    }
    console.log("Attempting to release table:", tableId);
    try {
      const data = {
        barId: barId,
        tableId: tableId,
        date: date,
        time: time
      };
      const response = await releaseTable(token, data);
      if (response.data.statusCode === 200) {
        onRemove(tableId);
        await releaseTableSignalR(data);
      }
    } catch (error) {
      console.error("Error releasing table:", error);
    }
  };

  // Lọc bàn theo ngày và giờ hiện tại
  // const filteredTables = selectedTables.filter(table => 
  //   dayjs(table.date).isSame(dayjs(selectedDate), 'day') && table.time === selectedTime + ":00"
  // );

  // Sắp xếp bàn theo thời gian
  const sortedTables = selectedTables.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  return (
    <div className={`flex flex-col px-8 pt-4 pb-10 mt-4 w-full text-xs text-white rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] ${sortedTables.length === 0 ? 'hidden' : ''}`}>
      <div className="self-center text-xl font-bold text-center text-amber-400 text-opacity-90">
        Danh sách đã chọn
      </div>
      <div className="shrink-0 self-stretch mt-4 h-px border border-amber-400 border-solid" />
      {sortedTables?.map((table) => (
        <div key={table.tableId} className="flex flex-col gap-2 mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
          <div className="flex justify-between items-center">
            <div className="text-sm font-notoSansSC">
              {table.tableName}
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/60b2292fdddb88def1d62fba646def558e1bd6c427bf27025633c14ac4a99ae3?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
              className="object-contain shrink-0 w-6 aspect-square cursor-pointer"
              alt="Remove icon"
              onClick={() => handleRemove(table.tableId, table.date, table.time)}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span>{dayjs(table.date).isValid() ? dayjs(table.date).format('YYYY-MM-DD') : 'Invalid Date'}</span>
            <span>{table.time ? table.time.slice(0, 5) : 'Invalid Time'}</span>
          </div>
          {countdowns[table.tableId] !== undefined && (
            <span className="text-xs text-amber-400">
              ({countdowns[table.tableId]}s)
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectedList;