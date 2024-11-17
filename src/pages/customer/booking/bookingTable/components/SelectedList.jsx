import React, { useState, useEffect } from "react";
import { releaseTable, releaseTableList } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { releaseTableSignalR, releaseTableListSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { toast } from "react-toastify";

const SelectedList = ({ selectedTables, setSelectedTables, barId, selectedDate, selectedTime }) => {
  const [countdowns, setCountdowns] = useState({});
  const { token } = useAuthStore();
  const [isReleasingAll, setIsReleasingAll] = useState(false);

  // Chỉ update countdown UI
  useEffect(() => {
    let timer;
    if (!isReleasingAll) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const updatedCountdowns = {};
        
        selectedTables.forEach(table => {
          if (table.holdExpiry) {
            const timeLeft = Math.max(0, Math.floor((table.holdExpiry - now) / 1000));
            updatedCountdowns[table.tableId] = timeLeft;
          }
        });

        setCountdowns(updatedCountdowns);
      }, 1000);
    }

    return () => timer && clearInterval(timer);
  }, [selectedTables, isReleasingAll]);

  // Chỉ update UI khi countdown hết
  useEffect(() => {
    if (!isReleasingAll) {
      const expiredTables = selectedTables.filter(table => 
        countdowns[table.tableId] === 0
      );
      
      if (expiredTables.length > 0) {
        setSelectedTables(prev => 
          prev.filter(table => countdowns[table.tableId] > 0)
        );
      }
    }
  }, [countdowns, isReleasingAll, selectedTables, setSelectedTables]);

  const handleRemove = async (tableId, date, time) => {
    if (!date || !time) return;
    try {
      const data = {
        barId: barId,
        tableId: tableId,
        date: date,
        time: time
      };

      const response = await releaseTable(token, data);
      if (response.data.statusCode === 200) {
        await releaseTableSignalR(data);
        setSelectedTables(prev => prev.filter(t => t.tableId !== tableId));
        toast.success("Đã xóa bàn thành công");
      }
    } catch (error) {
      console.error("Error releasing table:", error);
      toast.error("Có lỗi xảy ra khi xóa bàn");
    }
  };

  const handleReleaseAll = async () => {
    if (selectedTables.length === 0) return;

    try {
      setIsReleasingAll(true);

      const data = {
        barId: barId,
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        time: selectedTime + ":00",
        table: selectedTables.map(table => ({
          tableId: table.tableId,
          time: selectedTime + ":00"
        }))
      };

      console.log("Sending releaseTableList request:", data);
      const response = await releaseTableList(token, data);
      
      if (response.data.statusCode === 200) {
        setSelectedTables([]);
        
        const signalRData = {
          barId: data.barId,
          date: data.date,
          time: data.time,
          table: data.table
        };

        await releaseTableListSignalR(signalRData);
        toast.success("Đã xóa tất cả bàn thành công");
      }
    } catch (error) {
      console.error("Error releasing all tables:", error);
      toast.error("Có lỗi xảy ra khi xóa các bàn");
    } finally {
      setIsReleasingAll(false);
    }
  };

  const sortedTables = [...selectedTables].sort((a, b) => {
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
      <Button 
        onClick={handleReleaseAll}
        variant="contained"
        color="secondary"
        style={{ marginTop: '10px' }}
      >
        Xóa hết
      </Button>
    </div>
  );
};

export default SelectedList;
