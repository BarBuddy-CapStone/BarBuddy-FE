import React, { useState, useEffect, useCallback } from "react";
import { releaseTable, releaseTableList } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection, releaseTableSignalR, releaseTableListSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { toast } from "react-toastify";

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
        await releaseTableSignalR(data);
        onRemove(tableId);
        document.dispatchEvent(new CustomEvent('tableStatusChanged', {
          detail: { 
            tableId, 
            isHeld: false, 
            holderId: null, 
            date: null, 
            time: null 
          }
        }));
      }
    } catch (error) {
      console.error("Error releasing expired table:", error);
    }
  }, [barId, onRemove, token]);

  // Sửa lại useEffect để xử lý sự kiện TableListReleased
  useEffect(() => {
    const handleTableReleased = (response) => {
      console.log("Table released event received:", response);
      setSelectedTables(prev => prev.filter(table => 
        !(table.tableId === response.tableId && 
          table.date === response.date && 
          table.time === response.time)
      ));
    };

    const handleTableListReleased = (response) => {
      console.log("Table list released event received:", response);
      // Xóa tất cả bàn khỏi selectedTables
      setSelectedTables([]);
      
      // Dispatch event để cập nhật trạng thái cho từng bàn
      if (response.tables && Array.isArray(response.tables)) {
        response.tables.forEach(table => {
          document.dispatchEvent(new CustomEvent('tableStatusChanged', {
            detail: { 
              tableId: table.tableId, 
              isHeld: false, 
              holderId: null,
              date: null,
              time: null
            }
          }));
        });
      }
    };

    // Đăng ký lắng nghe sự kiện từ hubConnection
    const handleSignalRTableReleased = (response) => {
      handleTableReleased(response);
    };

    const handleSignalRTableListReleased = (response) => {
      handleTableListReleased(response);
    };

    hubConnection.on("TableReleased", handleSignalRTableReleased);
    hubConnection.on("TableListReleased", handleSignalRTableListReleased);

    // Cleanup khi component unmount
    return () => {
      hubConnection.off("TableReleased", handleSignalRTableReleased);
      hubConnection.off("TableListReleased", handleSignalRTableListReleased);
    };
  }, [setSelectedTables]);

  const handleReleaseAll = async () => {
    if (selectedTables.length === 0) return;

    try {
      const data = {
        barId: barId,
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
        time: selectedTime + ":00",
        table: selectedTables.map(table => ({
          tableId: table.tableId,
          time: table.time
        }))
      };

      const response = await releaseTableList(token, data);
      if (response.data.statusCode === 200) {
        // Gửi SignalR để thông báo cho các clients khác
        await releaseTableListSignalR(data);
        
        // Xóa tất cả bàn khỏi danh sách đã chọn
        setSelectedTables([]);
        
        // Dispatch event để cập nhật UI và trạng thái holdTable cho từng bàn
        selectedTables.forEach(table => {
          document.dispatchEvent(new CustomEvent('tableStatusChanged', {
            detail: { 
              tableId: table.tableId, 
              isHeld: false, 
              holderId: null,
              date: null,
              time: null,
              fromReleaseList: true  // Thêm flag để đánh dấu là từ releaseList
            }
          }));
        });

        toast.success("Đã xóa tất cả bàn đã chọn");
      }
    } catch (error) {
      console.error("Error releasing all tables:", error);
      toast.error("Có lỗi xảy ra khi xóa các bàn");
    }
  };

  const handleRemove = async (tableId, date, time) => {
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
        // Gửi SignalR để thông báo cho các clients khác
        await releaseTableSignalR(data);
        
        // Xóa bàn khỏi danh sách đã chọn
        onRemove(tableId);
        
        // Dispatch event để cập nhật UI
        document.dispatchEvent(new CustomEvent('tableStatusChanged', {
          detail: { 
            tableId, 
            isHeld: false, 
            holderId: null, 
            date: null, 
            time: null 
          }
        }));
      }
    } catch (error) {
      console.error("Error releasing table:", error);
      // toast.error("Có lỗi xảy ra khi giải phóng bàn");
    }
  };

  // Countdown timer effect
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

  // Sắp xếp bàn theo thời gian
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
