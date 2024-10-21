import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getBarTableById } from "src/lib/service/customerService";
import { filterBookingTable, holdTable, releaseTable, getAllHoldTable } from "src/lib/service/BookingTableService";
import CustomerForm from './components/CustomerForm';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import dayjs from "dayjs";
import { hubConnection } from 'src/lib/Third-party/signalR/hubConnection';
import useAuthStore from 'src/lib/hooks/useUserStore';

import {
  BookingTableInfo,
  TableSelection,
  TimeSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};

  const [allTables, setAllTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [barInfo, setBarInfo] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tableTypeInfo, setTableTypeInfo] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTableTypeId, setSelectedTableTypeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allFilteredTables, setAllFilteredTables] = useState({});
  const { token, userInfo } = useAuthStore();

  const [selectedTablesMap, setSelectedTablesMap] = useState({});
  const [allHoldTables, setAllHoldTables] = useState([]);

  const uniqueTablesByDateAndTime = selectedTables.filter((seleTable, index, self) =>
    index === self.findIndex((t) => (
      t.tableId === seleTable.tableId && t.date === seleTable.date && t.time === seleTable.time
    ))
  );
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await getBarTableById(barId);
        if (response.status === 200) {
          setAllTables(response.data.data.tables);
          setStartTime(response.data.data.startTime.slice(0, 5));
          setEndTime(response.data.data.endTime.slice(0, 5));
          setBarInfo({
            id: response.data.data.barId,
            name: response.data.data.barName,
            location: response.data.data.address,
            description: response.data.data.description,
            discount: response.data.data.discount,
            openingHours: `${response.data.data.startTime.slice(0, 5)} - ${response.data.data.endTime.slice(0, 5)}`,
          });
        } else {
          console.error("Failed to fetch table data");
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    if (barId) {
      fetchTableData();
    }
  }, [barId]);

  const mergeTables = useCallback((apiTables, holdTables, currentDate, currentTime) => {
    return apiTables.map(apiTable => {
      const matchingHoldTable = holdTables.find(holdTable => 
        holdTable.tableId === apiTable.tableId &&
        dayjs(holdTable.date).format('YYYY-MM-DD') === currentDate &&
        holdTable.time === currentTime
      );

      if (matchingHoldTable) {
        return {
          ...apiTable,
          status: 2,
          isHeld: true,
          holderId: matchingHoldTable.accountId,
          holdExpiry: matchingHoldTable.holdExpiry,
          date: matchingHoldTable.date,
          time: matchingHoldTable.time
        };
      }
      return { ...apiTable, status: 1, isHeld: false };
    });
  }, []);

  const fetchAllHoldTables = useCallback(async () => {
    try {
      const response = await getAllHoldTable(barId, dayjs(selectedDate).format("YYYY/MM/DD"), selectedTime);
      if (response.data.statusCode === 200) {
        setAllHoldTables(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching all hold tables:", error);
    }
  }, [barId, selectedDate, selectedTime]);

  useEffect(() => {
    if (barId && selectedDate && selectedTime) {
      fetchAllHoldTables();
    }
  }, [barId, selectedDate, selectedTime]);

  const fetchAndMergeTables = useCallback(async () => {
    if (!barId || !selectedDate || !selectedTime || !selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch hold tables
      const holdTablesResponse = await getAllHoldTable(barId, dayjs(selectedDate).format("YYYY/MM/DD"), selectedTime);
      const holdTables = holdTablesResponse.data.data;

      // Fetch filtered tables
      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: dayjs(selectedDate).format("YYYY/MM/DD"),
        time: selectedTime
      });

      if (response.data.statusCode === 200) {
        const { tableTypeId, typeName, description, bookingTables } = response.data.data;
        setTableTypeInfo({ tableTypeId, typeName, description });
      
        if (bookingTables && bookingTables.length > 0) {
          const currentDate = dayjs(selectedDate).format('YYYY-MM-DD');
          const currentTime = selectedTime + ":00";
          
          const mergedTables = mergeTables(bookingTables[0].tables, holdTables, currentDate, currentTime);
          
          setAllFilteredTables(prev => ({
            ...prev,
            [`${currentDate}-${currentTime}`]: mergedTables
          }));
          
          setFilteredTables(mergedTables);
        } else {
          setFilteredTables([]);
          setOpenPopup(true);
        }
      }
    } catch (error) {
      console.error("Error fetching and merging tables:", error);
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }, [barId, selectedDate, selectedTime, selectedTableTypeId, mergeTables]);

  const handleSearch = () => {
    fetchAndMergeTables();
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (hasSearched) {
      fetchAndMergeTables();
    }
  };

  useEffect(() => {
    if (hasSearched) {
      fetchAndMergeTables();
    }
  }, [selectedDate, selectedTime, selectedTableTypeId, hasSearched, fetchAndMergeTables]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
            time: holdData.time,
            holderId: holdData.accountId || userInfo.accountId
          };
          
          const currentDateTimeKey = `${dayjs(selectedDate).format('YYYY-MM-DD')}-${selectedTime}:00`;
          setSelectedTablesMap(prev => ({
            ...prev,
            [currentDateTimeKey]: [...(prev[currentDateTimeKey] || []), newSelectedTable]
          }));

          setSelectedTables(prevSelectedTables => [...prevSelectedTables, newSelectedTable]);

          updateTableHeldStatus(table.tableId, true, newSelectedTable.holderId, holdData.date, holdData.time);

          await hubConnection.invoke("HoldTable", {
            barId: barId,
            tableId: table.tableId,
            date: holdData.date,
            time: holdData.time,
            accountId: newSelectedTable.holderId
          });
        } else {
          console.error("Hold table request failed:", response.data);
        }
      } catch (error) {
        console.error("Error holding table:", error);
      }
    }

    const currentDateTimeKey = `${dayjs(selectedDate).format('YYYY-MM-DD')}-${selectedTime}:00`;
    setAllFilteredTables(prev => ({
      ...prev,
      [currentDateTimeKey]: prev[currentDateTimeKey].map(t => 
        t.tableId === table.tableId ? { ...t, status: 2, isHeld: true, holderId: userInfo.accountId } : t
      )
    }));
  };

  const handleRemoveTable = async (tableId) => {
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
          
          const currentDateTimeKey = `${dayjs(table.date).format('YYYY-MM-DD')}-${table.time}`;
          setSelectedTablesMap(prev => ({
            ...prev,
            [currentDateTimeKey]: prev[currentDateTimeKey].filter(t => t.tableId !== tableId)
          }));

          updateTableHeldStatus(tableId, false, null, table.date, table.time);
          await hubConnection.invoke("ReleaseTable", data);
        } else {
          console.error("Release table request failed:", response.data);
        }
      } catch (error) {
        console.error("Error releasing table:", error);
      }
    }

    const currentDateTimeKey = `${dayjs(selectedDate).format('YYYY-MM-DD')}-${selectedTime}:00`;
    setAllFilteredTables(prev => ({
      ...prev,
      [currentDateTimeKey]: prev[currentDateTimeKey].map(t => 
        t.tableId === tableId ? { ...t, status: 1, isHeld: false, holderId: null } : t
      )
    }));
  };

  const handleTableTypeChange = (tableTypeId) => {
    setSelectedTableTypeId(tableTypeId);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

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
  }, []);

  const updateTableHeldStatus = useCallback((tableId, isHeld, holderId, date, time) => {
    setAllFilteredTables(prev => {
      const key = `${dayjs(date).format('YYYY-MM-DD')}-${time}`;
      const updatedTables = prev[key] ? prev[key].map(table => 
        table.tableId === tableId
          ? { ...table, status: isHeld ? 2 : 1, holderId, date, time, isHeld }
          : table
      ) : [];

      return {
        ...prev,
        [key]: updatedTables
      };
    });

    setFilteredTables(prevTables =>
      prevTables.map(table =>
        table.tableId === tableId 
          ? { ...table, status: isHeld ? 2 : 1, holderId, date, time, isHeld }
          : table
      )
    );
  }, []);

  useEffect(() => {
    const currentDateTimeKey = `${dayjs(selectedDate).format('YYYY-MM-DD')}-${selectedTime}:00`;
    if (allFilteredTables[currentDateTimeKey]) {
      const updatedTables = allFilteredTables[currentDateTimeKey].map(table => {
        const isSelected = selectedTablesMap[currentDateTimeKey]?.some(
          selectedTable => selectedTable.tableId === table.tableId
        );
        return isSelected ? { ...table, status: 2, isHeld: true } : table;
      });
      setFilteredTables(updatedTables);
    } else if (hasSearched) {
      fetchAndMergeTables();
    }
  }, [selectedDate, selectedTime, hasSearched, allFilteredTables, selectedTablesMap]);

  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]">
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex flex-col w-3/4 max-md:w-full">
            <BookingTableInfo 
              barId={barId} 
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onTableTypeChange={handleTableTypeChange}
              onSearchTables={handleSearch}
              selectedTableTypeId={selectedTableTypeId}
            />
            <TableSelection
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              filteredTables={filteredTables}
              setFilteredTables={setFilteredTables}
              tableTypeInfo={tableTypeInfo}
              isLoading={isLoading}
              hasSearched={hasSearched}
              barId={barId}
              selectedTableTypeId={selectedTableTypeId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTableSelect={handleTableSelect}
            />
            <TimeSelection 
              startTime={startTime} 
              endTime={endTime} 
              onTimeChange={handleTimeChange}
              selectedDate={selectedDate}
            />
            <CustomerForm 
              selectedTables={selectedTables} 
              barId={barId}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              barInfo={barInfo}  // Thêm dòng này
            />
          </div>
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={uniqueTablesByDateAndTime}
              setSelectedTables={setSelectedTables}
              onRemove={handleRemoveTable}
              barInfo={barInfo}
              barId={barId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        </div>
      </main>
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          {!selectedTableTypeId
            ? "Vui lòng chọn loại bàn trước khi tìm kiếm."
            : "Không có bàn nào phù hợp với thời gian bạn đã chọn. Vui lòng chọn thời gian khác hoặc loại bàn khác."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingTable;
