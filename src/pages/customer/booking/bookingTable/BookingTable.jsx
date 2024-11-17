import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBarById, getBarTableById } from "src/lib/service/customerService";
import { filterBookingTable, holdTable, releaseTable, getAllHoldTable, releaseTableList } from "src/lib/service/BookingTableService";
import CustomerForm from './components/CustomerForm';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import dayjs from "dayjs";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { hubConnection, releaseTableListSignalR, releaseTableSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { LoadingSpinner } from 'src/components';
import { toast } from "react-toastify";

import {
  BookingTableInfo,
  TableSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};
  const navigate = useNavigate();

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
  const [note, setNote] = useState("");

  const uniqueTablesByDateAndTime = selectedTables.filter((seleTable, index, self) =>
    index === self.findIndex((t) => (
      t.tableId === seleTable.tableId && t.date === seleTable.date && t.time === seleTable.time
    ))
  );
  console.log("selectedDate", selectedDate)

  const formatDateAndDay = (date) => {
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const d = dayjs(date);
    const dayOfWeek = dayNames[d.day()];
    return `${dayOfWeek}, ${d.format('DD/MM/YYYY')}`;
  };

  const fetchTableData = async () => {
    try {
      const responseBarDetail = await getBarById(barId);
      const responseBarTable = await getBarTableById(barId);
      
      if (responseBarDetail.status === 200) {
        setBarInfo({
          id: responseBarDetail.data.data.barId,
          name: responseBarDetail.data.data.barName,
          location: responseBarDetail.data.data.address,
          description: responseBarDetail.data.data.description,
          discount: responseBarDetail.data.data.discount,
          openingHours: 'Quán đóng cửa',
        });

        setAllTables(responseBarTable.data.data.tables);
        
        const barTimeResponses = responseBarDetail.data.data.barTimeResponses;
        const selectedDayOfWeek = dayjs(selectedDate).day();

        setStartTime("");
        setEndTime("");
        setSelectedTime("");
        
        if (Array.isArray(barTimeResponses)) {
          const matchingBarTime = barTimeResponses.find(time => 
            Number(time.dayOfWeek) === selectedDayOfWeek
          );

          if (matchingBarTime) {
            const newStartTime = matchingBarTime.startTime.slice(0, 5);
            const newEndTime = matchingBarTime.endTime.slice(0, 5);
            
            setStartTime(newStartTime);
            setEndTime(newEndTime);
            
            setBarInfo(prev => ({
              ...prev,
              openingHours: `${newStartTime} - ${newEndTime}`,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      resetAllStates();
    }
  };

  const resetAllStates = () => {
    setStartTime("");
    setEndTime("");
    setSelectedTime("");
    
    setFilteredTables([]);
    setAllFilteredTables({});
    setSelectedTables([]);
    setSelectedTablesMap({});
    setSelectedTableTypeId("");
    setTableTypeInfo(null);
    setHasSearched(false);
  };

  useEffect(() => {
    if (barId) {
      console.log("Fetching table data due to date change:", selectedDate);
      fetchTableData();
    }
  }, [barId, selectedDate]);

  const mergeTables = (apiTables, holdTables, currentDate, currentTime) => {
    if (!apiTables || !Array.isArray(apiTables)) {
      console.warn("No API tables data or invalid format");
      return [];
    }

    return apiTables.map(apiTable => {
      const matchingHoldTable = holdTables?.find(holdTable => 
        holdTable.tableId === apiTable.tableId &&
        dayjs(holdTable.date).format('YYYY-MM-DD') === currentDate &&
        holdTable.time === currentTime
      );

      if (matchingHoldTable) {
        return {
          ...apiTable,
          status: 2, // Đã được hold
          isHeld: true,
          holderId: matchingHoldTable.accountId,
          holdExpiry: matchingHoldTable.holdExpiry,
          date: matchingHoldTable.date,
          time: matchingHoldTable.time
        };
      }
      return { 
        ...apiTable, 
        status: apiTable.status || 1,
        isHeld: false 
      };
    });
  };

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
      const holdTablesResponse = await getAllHoldTable(barId, dayjs(selectedDate).format("YYYY/MM/DD"), selectedTime);
      const holdTables = holdTablesResponse.data.data;

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

  const handleSearch = async () => {
    if (!barId || !selectedDate || !selectedTime || !selectedTableTypeId) {
      setOpenPopup(true);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const formattedTime = selectedTime + ":00";

      console.log("Searching tables with params:", {
        barId,
        date: formattedDate,
        time: formattedTime,
        tableTypeId: selectedTableTypeId
      });

      const response = await filterBookingTable({
        barId,
        tableTypeId: selectedTableTypeId,
        date: formattedDate,
        time: selectedTime
      });

      console.log("Filter response:", response.data);

      if (response.data.statusCode === 200 && response.data.data) {
        const holdTablesResponse = await getAllHoldTable(token, barId, formattedDate, formattedTime);
        const holdTables = holdTablesResponse.data.data || [];

        const { tableTypeId, typeName, description, bookingTables } = response.data.data;
        
        setTableTypeInfo({ tableTypeId, typeName, description });

        if (bookingTables && Array.isArray(bookingTables) && bookingTables.length > 0 && bookingTables[0].tables) {
          const mergedTables = mergeTables(
            bookingTables[0].tables,
            holdTables,
            formattedDate,
            formattedTime
          );

          if (mergedTables.length > 0) {
            setAllFilteredTables(prev => ({
              ...prev,
              [`${formattedDate}-${formattedTime}`]: mergedTables
            }));
            setFilteredTables(mergedTables);
          } else {
            setFilteredTables([]);
            setOpenPopup(true);
          }
        } else {
          setFilteredTables([]);
          setOpenPopup(true);
        }
      } else if (response.data.statusCode === 400) {
        console.error("Bad Request:", response.data.message);
        setOpenPopup(true);
      } else {
        console.error("Filter API returned unexpected response:", response.data);
        setOpenPopup(true);
      }
    } catch (error) {
      console.error("Error searching tables:", error);
      if (error.response) {
        console.error("Server error details:", error.response.data);
      }
      setOpenPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setFilteredTables([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilteredTables([]);
  };

  const handleTableSelect = async (newSelectedTable) => {
    // Cập nhật selectedTables với bàn mới được chọn
    setSelectedTables(prev => [...prev, newSelectedTable]);
  };

  const handleRemoveTable = async (tableId) => {
    const table = selectedTables.find(t => t.tableId === tableId);
    if (!table) return;

    try {
      const data = {
        barId: barId,
        tableId: tableId,
        date: table.date,
        time: table.time
      };

      console.log("Sending releaseTable request with data:", data);
      const response = await releaseTable(token, data);
      
      if (response.data.statusCode === 200) {
        // Gửi SignalR
        await releaseTableSignalR({
          barId: barId,
          tableId: tableId,
          date: table.date,
          time: table.time
        });

        // Cập nhật UI
        setSelectedTables(prev => prev.filter(t => t.tableId !== tableId));
        
        // Cập nhật trạng thái bàn
        setAllFilteredTables(prev => {
          const currentDateTimeKey = `${dayjs(table.date).format('YYYY-MM-DD')}-${table.time}`;
          return {
            ...prev,
            [currentDateTimeKey]: prev[currentDateTimeKey]?.map(t => 
              t.tableId === tableId ? {
                ...t,
                status: 1,
                isHeld: false,
                holderId: null,
                accountId: null,
                date: null,
                time: null
              } : t
            )
          };
        });

        setFilteredTables(prev =>
          prev.map(t =>
            t.tableId === tableId ? {
              ...t,
              status: 1,
              isHeld: false,
              holderId: null,
              accountId: null,
              date: null,
              time: null
            } : t
          )
        );
      }
    } catch (error) {
      console.error("Error releasing table:", error);
      toast.error("Có lỗi xảy ra khi giải phóng bàn");
    }
  };

  const handleTableTypeChange = (tableTypeId) => {
    setSelectedTableTypeId(tableTypeId);
  };

  // const handleClosePopup = () => {
  //   setOpenPopup(false);
  // };

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

  useEffect(() => {
    const handleTableListStatusChange = (event) => {
      const { tables, barId, date, time } = event.detail;
      console.log("BookingTable received tableListStatusChanged:", event.detail);

      // Cập nhật allFilteredTables
      setAllFilteredTables(prev => {
        const currentDateTimeKey = `${dayjs(date).format('YYYY-MM-DD')}-${time}`;
        return {
          ...prev,
          [currentDateTimeKey]: prev[currentDateTimeKey]?.map(table => {
            const updatedTable = tables.find(t => t.tableId === table.tableId);
            if (updatedTable) {
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
          })
        };
      });

      // Cập nhật selectedTables
      setSelectedTables(prev => 
        prev.filter(table => !tables.some(t => t.tableId === table.tableId))
      );
    };

    document.addEventListener('tableListStatusChanged', handleTableListStatusChange);

    return () => {
      document.removeEventListener('tableListStatusChanged', handleTableListStatusChange);
    };
  }, []);

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
              selectedTime={selectedTime}
              onTimeChange={handleTimeChange}
              startTime={startTime}
              endTime={endTime}
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
            <CustomerForm 
              selectedTables={selectedTables} 
              barId={barId}
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              barInfo={barInfo}
              note={note}
              setNote={setNote}
            />
          </div>
          <div className="flex flex-col w-1/4 max-md:w-full">
            <TableSidebar
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
              barId={barId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              barInfo={barInfo}
            />
          </div>
        </div>
      </main>
      {/* <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          {!selectedTableTypeId
            ? "Vui lòng chn loại bàn trước khi tìm kim."
            : "Không có bàn nào phù hợp với thời gian bạn đã chọn. Vui lòng chọn thời gian khác hoặc loại bàn khác."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog> */}
      <LoadingSpinner open={isLoading} />
    </div>
  );
};

export default BookingTable;
