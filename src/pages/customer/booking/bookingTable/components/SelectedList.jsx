import React, { useState, useEffect, useCallback } from "react";
import { releaseTable } from 'src/lib/service/BookingTableService';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { hubConnection } from 'src/lib/Third-party/signalR/hubConnection';

const SelectedList = ({ selectedTables, setSelectedTables, onRemove, barId }) => {
  const [countdowns, setCountdowns] = useState({});
  const { token } = useAuthStore();
  // console.log("Current token:", token);

  const handleExpiredTable = useCallback(async (tableId) => {
    try {
      const response = await releaseTable(token, { barId, tableId });
      if (response.data.statusCode === 200) {
        onRemove(tableId);
        // Notify other components about the table release
        hubConnection.invoke("ReleaseTable", barId, tableId);
      } else {
        console.error("Failed to release expired table:", response.data);
      }
    } catch (error) {
      console.error("Error releasing expired table:", error);
    }
  }, [token, barId, onRemove]);

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
            handleExpiredTable(table.tableId);
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

  const handleRemove = async (tableId) => {
    console.log("Attempting to release table:", tableId);
    try {
      const response = await releaseTable(token, { barId, tableId });
      console.log("Release table response:", response);
      if (response.data.statusCode === 200) {
        onRemove(tableId);
      } else {
        console.error("Failed to release table:", response.data);
      }
    } catch (error) {
      console.error("Error releasing table:", error);
    }
  };

  return (
    <div className={`flex flex-col px-8 pt-4 pb-10 mt-4 w-full text-xs text-white rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] ${selectedTables.length === 0 ? 'hidden' : ''}`}>
      <div className="self-center text-xl font-bold text-center text-amber-400 text-opacity-90">
        Danh sách đã chọn
      </div>
      <div className="shrink-0 self-stretch mt-4 h-px border border-amber-400 border-solid" />
      {selectedTables.map((table) => (
        <div key={table.tableId} className="flex gap-5 justify-between mt-4 ml-7 max-w-full leading-none w-[164px] max-md:ml-2.5">
          <div className="my-auto text-sm font-notoSansSC">
            {table.tableName}
            {countdowns[table.tableId] !== undefined && (
              <span className="ml-2 text-xs text-amber-400">
                ({countdowns[table.tableId]}s)
              </span>
            )}
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/60b2292fdddb88def1d62fba646def558e1bd6c427bf27025633c14ac4a99ae3?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            className="object-contain shrink-0 w-6 aspect-square cursor-pointer"
            alt="Remove icon"
            onClick={() => handleRemove(table.tableId)}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedList;
