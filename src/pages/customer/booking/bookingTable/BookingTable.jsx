import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from 'src/components';
import { hubConnection, releaseTableListSignalR, releaseTableSignalR } from 'src/lib/Third-party/signalR/hubConnection';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { filterBookingTable, getAllHoldTable, releaseTable, releaseTableList } from "src/lib/service/BookingTableService";
import { getBarById, getBarTableById } from "src/lib/service/customerService";
import CustomerForm from './components/CustomerForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {
  BookingTableInfo,
  TableSelection,
  TableSidebar,
} from "src/pages";

const BookingTable = () => {
  const { state } = useLocation();
  const { barId } = state || {};
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

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
  const { token } = useAuthStore();

  const [selectedTablesMap, setSelectedTablesMap] = useState({});
  const [allHoldTables, setAllHoldTables] = useState([]);
  const [note, setNote] = useState("");
  const [barTimeSlot, setBarTimeSlot] = useState(1);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);

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

        setBarTimeSlot(responseBarDetail.data.data.timeSlot);
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
    return apiTables.map(apiTable => {
      const matchingHoldTable = holdTables?.find(holdTable => 
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
      return { 
        ...apiTable, 
        status: apiTable.status !== undefined ? apiTable.status : 1,
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
      const holdTablesResponse = await getAllHoldTable(
        barId, 
        dayjs(selectedDate).format("YYYY/MM/DD"), 
        selectedTime + ":00"
      );
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

  const handleTimeChange = async (time) => {
    if (selectedTables.length > 0) {
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
          await releaseTableListSignalR(data);
          setSelectedTables([]);
          setSelectedTime(time);
          
          // Fetch lại danh sách bàn đã hold từ cache với time mới
          const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
          const formattedTime = time + ":00";

          try {
            const holdTablesResponse = await getAllHoldTable(token, barId, formattedDate, formattedTime);
            
            if (holdTablesResponse.data.statusCode === 200) {
              const holdTables = holdTablesResponse.data.data || [];
              
              // Cập nhật lại trạng thái các bàn với dữ liệu mới từ cache
              setAllFilteredTables(prev => {
                const currentDateTimeKey = `${formattedDate}-${formattedTime}`;
                const updatedTables = prev[currentDateTimeKey]?.map(table => {
                  const holdTable = holdTables.find(ht => ht.tableId === table.tableId);
                  if (holdTable) {
                    return {
                      ...table,
                      status: 2,
                      isHeld: true,
                      holderId: holdTable.accountId,
                      date: holdTable.date,
                      time: holdTable.time
                    };
                  }
                  return {
                    ...table,
                    status: 1,
                    isHeld: false,
                    holderId: null,
                    date: null,
                    time: null
                  };
                });
                
                return {
                  ...prev,
                  [currentDateTimeKey]: updatedTables
                };
              });

              // Cập nhật filteredTables hiện tại
              setFilteredTables(prev => 
                prev.map(table => {
                  const holdTable = holdTables.find(ht => ht.tableId === table.tableId);
                  if (holdTable) {
                    return {
                      ...table,
                      status: 2,
                      isHeld: true,
                      holderId: holdTable.accountId,
                      date: holdTable.date,
                      time: holdTable.time
                    };
                  }
                  return {
                    ...table,
                    status: 1,
                    isHeld: false,
                    holderId: null,
                    date: null,
                    time: null
                  };
                })
              );
            }
          } catch (error) {
            console.error("Error fetching hold tables:", error);
          }
        }
      } catch (error) {
        console.error("Error releasing table list:", error);
        toast.error("Có lỗi xảy ra khi xóa danh sách bàn");
      }
    } else {
      setSelectedTime(time);
      
      // Fetch lại danh sách bàn đã hold từ cache khi chỉ thay đổi time
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const formattedTime = time + ":00";

      try {
        const holdTablesResponse = await getAllHoldTable(token, barId, formattedDate, formattedTime);
        
        if (holdTablesResponse.data.statusCode === 200) {
          const holdTables = holdTablesResponse.data.data || [];
          
          // Cập nhật lại trạng thái các bàn
          if (filteredTables.length > 0) {
            setFilteredTables(prev => 
              prev.map(table => {
                const holdTable = holdTables.find(ht => ht.tableId === table.tableId);
                if (holdTable) {
                  return {
                    ...table,
                    status: 2,
                    isHeld: true,
                    holderId: holdTable.accountId,
                    date: holdTable.date,
                    time: holdTable.time
                  };
                }
                return {
                  ...table,
                  status: 1,
                  isHeld: false,
                  holderId: null,
                  date: null,
                  time: null
                };
              })
            );
          }
        }
      } catch (error) {
        console.error("Error fetching hold tables:", error);
      }
    }
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

  useEffect(() => {
    if (!userInfo?.phone) {
      setShowPhoneWarning(true);
    }
  }, [userInfo]);

  const handleCloseWarning = () => {
    setShowPhoneWarning(false);
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${userInfo?.accountId}`, { 
      state: { 
        returnPath: `/bookingtable`,
        returnState: { barId },
        showPhoneUpdate: true 
      } 
    });
  };

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
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
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
            : "Không có bàn nào phù hợp với thời gian bạn đã chọn. Vui lng chọn thời gian khác hoặc loại bàn khác."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={showPhoneWarning}
        onClose={handleCloseWarning}
        PaperProps={{
          style: {
            backgroundColor: '#262626',
            borderRadius: '12px',
            border: '1px solid #404040',
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        <div className="p-6">
          <div className="flex flex-col items-center mb-4">
            <WarningAmberIcon className="text-amber-400 mb-2" sx={{ fontSize: 40 }} />
            <DialogTitle className="text-amber-400 font-medium text-center p-0">
              Thông báo bổ sung thông tin
            </DialogTitle>
          </div>
          
          <DialogContent className="text-gray-300 text-center p-0 mb-6">
            Tài khoản của bạn chưa có số điện thoại. Vui lòng cập nhật số điện thoại để tiếp tục đặt bàn.
          </DialogContent>

          <DialogActions className="p-0 flex justify-center gap-3">
            <Button
              onClick={handleCloseWarning}
              className="px-5 py-2 bg-neutral-700 text-gray-300 rounded-full hover:bg-neutral-600 transition duration-200 min-w-[100px] text-sm font-medium normal-case"
            >
              Để sau
            </Button>
            <Button
              onClick={handleNavigateToProfile}
              className="px-5 py-2 bg-amber-400 text-neutral-900 rounded-full hover:bg-amber-500 transition duration-200 min-w-[100px] text-sm font-medium normal-case"
            >
              Cập nhật ngay
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <LoadingSpinner open={isLoading} />
    </div>
  );
};

export default BookingTable;
