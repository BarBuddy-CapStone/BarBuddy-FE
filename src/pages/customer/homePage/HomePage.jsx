import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBar, getAllBarAvailable, getAllBarForMap } from "src/lib/service/customerService";
import { Add, ArrowForward, Search, ArrowBackIos, ArrowForwardIos, AccessTime } from "@mui/icons-material";
import { getAllDrinkCustomer } from "src/lib/service/managerDrinksService";
import { Button, Pagination, PaginationItem, TextField } from "@mui/material";
import { LoadingSpinner } from 'src/components';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GoongMap } from 'src/lib';
import { getEventAllBar } from '../../../lib/service/eventManagerService';


const BranchCard = React.memo(({ branch, onClick, selectedDate }) => {
  const rating = useMemo(
    () =>
      branch.feedBacks.length > 0
        ? (
          branch.feedBacks.reduce(
            (acc, feedback) => acc + feedback.rating,
            0
          ) / branch.feedBacks.length
        ).toFixed(1)
        : 0,
    [branch.feedBacks]
  );

  const reviews = branch.feedBacks.length;

  const getOpeningHours = () => {
    const daySchedule = branch.barTimeResponses.find(
      (time) => time.dayOfWeek === new Date(selectedDate).getDay()
    );
    return daySchedule
      ? `${daySchedule.startTime.slice(0, 5)} - ${daySchedule.endTime.slice(0, 5)}`
      : "Không có thông tin";
  };

  return (
    <div
      onClick={onClick}
      className="bg-neutral-700 text-white rounded-lg shadow-md overflow-hidden w-full max-w-[300px] transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img
        src={
          branch.images === "default"
            ? "https://giayphepkinhdoanh.vn/wp-content/uploads/2023/10/mo-quan-bar-pub-can-xin-nhung-loai-giay-phep-nao.jpg"
            : branch.images
        }
        alt={branch.barName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg text-yellow-500 font-bold mb-2">
          {branch.barName}
        </h3>

        <div className="text-orange-400">
          <span className="text-gray-400"><img
            src={
              branch.isAnyTableAvailable
                ? "https://img.icons8.com/?size=100&id=60362&format=png&color=40C057"
                : "https://img.icons8.com/?size=100&id=60362&format=png&color=FA5252"
            }
            alt={branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}
            className="inline-block w-4 h-4 mr-2"
          /></span>
          <span className="text-sm text-white">{branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}</span>
        </div>

        <div className="text-orange-400 mb-2">
          <span className="text-sm">Đánh giá: {rating}</span>
          <span className="ml-2 text-gray-400">({reviews} reviews)</span>
        </div>
        <p className="text-sm mb-2 inline-block">
          <span className="text-orange-400">Địa chỉ:</span> {branch.address}
        </p>
        <p className="text-sm break-words inline-block">
          <span className="text-orange-400">Thời gian mở cửa - đóng cửa:</span>{" "}
          {getOpeningHours()}
        </p>
      </div>
    </div>
  );
});

const EventSlider = React.memo(({ onEventClick }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStill, setIsStill] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getEventAllBar({
        pageIndex: currentPage,
        pageSize: 6,
        isStill: isStill
      });
      if (response.data.statusCode === 200) {
        setEvents(response.data.data.eventResponses);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, isStill]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [events.length]);

  const handleEventTypeChange = (value) => {
    setIsStill(value);
    setCurrentPage(1);
    setCurrentSlide(0);
  };

  if (loading) return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 mb-6 p-6">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    </section>
  );

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 mb-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-yellow-500 font-bold">Sự kiện tại Bar Buddy</h2>
        <div className="flex items-center gap-4">
          <select 
            className="bg-neutral-700 text-white px-4 py-2 rounded-lg border border-yellow-500"
            value={isStill}
            onChange={(e) => {
              const value = e.target.value;
              handleEventTypeChange(value === '' ? undefined : Number(value));
            }}
          >
            <option value={0}>Sự kiện hiện tại</option>
            <option value={1}>Sự kiện sắp tới</option>
            <option value="">Tất cả sự kiện</option>
          </select>
          <button
            onClick={() => navigate('/event')}
            className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 text-sm group transition-all duration-300"
          >
            Xem tất cả
            <ArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="relative overflow-hidden group">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {events.map((event) => (
              <div
                key={event.eventId}
                className="w-full flex-shrink-0 px-2"
                onClick={() => navigate(`/event/${event.eventId}`)}
              >
                <div className="bg-neutral-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48">
                    <img
                      src={event.images}
                      alt={event.eventName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1">{event.eventName}</h3>
                      <p className="text-sm text-yellow-500">{event.barName}</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    
                    {event.eventTimeResponses.map((time, index) => (
                      <div key={index} className="flex items-center text-gray-400 text-sm">
                        <AccessTime className="w-4 h-4 mr-2" />
                        {`${time.startTime.slice(0, 5)} - ${time.endTime.slice(0, 5)}`}
                      </div>
                    ))}

                    {event.eventVoucherResponse && (
                      <div className="mt-2 bg-yellow-500/10 p-2 rounded">
                        <p className="text-yellow-500 text-sm font-semibold">
                          Giảm {event.eventVoucherResponse.discount}%
                          (Tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(event.eventVoucherResponse.maxPrice)})
                        </p>
                        <p className="text-xs text-gray-400">
                          Mã: {event.eventVoucherResponse.voucherCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-500/80 hover:bg-yellow-600/80 p-2 rounded-full text-black transition-all duration-300 opacity-0 group-hover:opacity-100 invisible group-hover:visible"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
            }}
          >
            <ArrowBackIos className="h-5 w-5" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-500/80 hover:bg-yellow-600/80 p-2 rounded-full text-black transition-all duration-300 opacity-0 group-hover:opacity-100 invisible group-hover:visible"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev + 1) % events.length);
            }}
          >
            <ArrowForwardIos className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {events.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-yellow-500 w-6' 
                    : 'bg-gray-400 w-2 hover:bg-yellow-500/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(index);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-neutral-900 rounded-lg">
          <img 
            src="https://img.icons8.com/clouds/100/000000/calendar.png" 
            alt="No events" 
            className="w-24 h-24 mb-4 opacity-50"
          />
          <p className="text-gray-400 text-lg text-center mb-2">
            {isStill === 0 && "Không có sự kiện nào đang diễn ra"}
            {isStill === 1 && "Không có sự kiện nào sắp diễn ra"}
            {isStill === undefined && "Không tìm thấy sự kiện nào"}
          </p>
          <p className="text-gray-500 text-sm text-center">
            Vui lòng quay lại sau hoặc thử chọn thời gian khác
          </p>
        </div>
      )}
    </section>
  );
});

const BarBuddyBranches = ({ onBranchesLoaded, onBarClick }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchBranches = useCallback(async (searchTerm = search, page = pageIndex, size = pageSize) => {
    setLoading(true);
    try {
      const response = await getAllBar(searchTerm, page, size);
      if (response.data.statusCode === 200) {
        setBranches(response.data.data);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.totalCount / size));
        setTotalItems(response.data.totalCount || response.data.data.length);
        onBranchesLoaded(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, [onBranchesLoaded, pageSize]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCardClick = useCallback((barId) => {
    onBarClick(barId);
  }, [onBarClick]);

  const handlePageChange = (event, value) => {
    setPageIndex(value);
    fetchBranches(search, value, pageSize);
  };

  const handleSearch = () => {
    setPageIndex(1);
    fetchBranches(search, 1, pageSize);
  };

  const isFirstPage = pageIndex === 1;
  const isLastPage = pageIndex === totalPages;
  const isLastPageWithLessThanSixItems = isLastPage && totalItems <= (pageIndex - 1) * pageSize + branches.length;

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-10 mt-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-2xl text-start mb-8 text-yellow-400">
          Tất cả chi nhánh Bar Buddy
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between ml-4 mr-4 mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto ">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                borderRadius: 2,
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'black',
                border: '1px solid rgb(12 74 110)',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: '#d97706',
                },
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => (
          <BranchCard
            key={index}
            branch={branch}
            onClick={() => handleCardClick(branch.barId)}
            selectedDate={new Date().toISOString().split('T')[0]}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          count={totalPages}
          page={pageIndex}
          onChange={handlePageChange}
          color="primary"
          size="large"
          variant="outlined"
          shape="rounded"
          disabled={branches.length === 0}
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={
                (item.type === 'previous' && isFirstPage) ||
                (item.type === 'next' && isLastPageWithLessThanSixItems) ||
                item.disabled
              }
            />
          )}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#fff',
              borderColor: '#f59e0b',
              '&:hover': {
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
              },
              '&.Mui-selected': {
                backgroundColor: '#f59e0b',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#d97706',
                },
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                pointerEvents: 'none',
              },
            },
          }}
        />
      </div>
    </section>
  );
};

const BarBuddyBranchesAvailable = ({ onBranchesLoaded, onBarClick }) => {
  const [branchesAvailable, setBranchesAvailable] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const fetchBranchesAvailable = useCallback(async (searchTerm = searchAvailable, date = selectedDate) => {
    setLoadingAvailable(true);
    try {
      const response = await getAllBarAvailable(
        date.toISOString().split('T')[0],
        searchTerm
      );
      if (response.data.statusCode === 200) {
        setBranchesAvailable(response.data.data);
        onBranchesLoaded(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingAvailable(false);
    }
  }, [onBranchesLoaded, searchAvailable, selectedDate]);

  useEffect(() => {
    fetchBranchesAvailable();
  }, [selectedDate]);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    fetchBranchesAvailable(searchAvailable, newValue);
  };

  const handleCardClickAvailable = useCallback((barId) => {
    onBarClick(barId);
  }, [onBarClick]);

  const handleSearchAvailable = () => {
    fetchBranchesAvailable(searchAvailable, selectedDate);
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Th năm", "Thứ sáu", "Thứ bảy"];
    return daysOfWeek[date.getDay()];
  };

  const today = new Date();
  const dayOfWeek = selectedDate.toDateString() === today.toDateString() ? "ngày hôm nay" : getDayOfWeek(selectedDate);

  if (loadingAvailable) return <div>Loading...</div>;

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 mb-6">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-yellow-400 text-sm">Lọc chi nhánh quán bar theo ngày hoạt động:</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className="bg-white rounded"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán bar"
              value={searchAvailable}
              onChange={(e) => setSearchAvailable(e.target.value)}
              className="px-4 py-2 border border-sky-900 rounded-full"
            />
            <Button
              variant="contained"
              onClick={handleSearchAvailable}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f59e0b',
                '&:hover': { backgroundColor: '#d97706' },
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        <h2 className="text-2xl text-yellow-500 font-bold mb-4">
          {`Chi nhánh Bar Buddy hoạt động vào ${dayOfWeek}`}
        </h2>
        <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branchesAvailable.map((branch, index) => (
            <BranchCard
              key={index}
              branch={branch}
              onClick={() => handleCardClickAvailable(branch.barId)}
              selectedDate={selectedDate.toISOString().split('T')[0]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

function HomePage() {
  const [branches, setBranches] = useState([]);
  const [mapBranches, setMapBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapBranches = async () => {
      try {
        const response = await getAllBarForMap();
        if (response.data.statusCode === 200) {
          console.log("Fetched map branches:", response.data.data);
          setMapBranches(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching map branches:", error);
      }
    };
    fetchMapBranches();
  }, []);

  const handleBarClick = useCallback((barId) => {
    setIsLoading(true);
    new Promise(resolve => setTimeout(resolve, 1000))
      .then(() => {
        setIsLoading(false);
        navigate(`/bar-detail/${barId}`);
      });
  }, [navigate]);

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-6 bg-inherit">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-8">
          <BarBuddyBranchesAvailable onBranchesLoaded={setBranches} onBarClick={handleBarClick} />
          <EventSlider />
        </div>
        
        <aside className="col-span-1 lg:col-span-4 space-y-6">
          <div className="bg-neutral-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl text-yellow-500 font-bold mb-4">Bản đồ chi nhánh</h2>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-white">Vị trí của bạn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-white">Chi nhánh</span>
                </div>
              </div>
              <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-700">
                <GoongMap branches={mapBranches} />
              </div>
              <div className="mt-3 text-xs text-gray-400 text-center">
                Nhấn vào marker để xem thông tin chi tiết
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-yellow-500">
                  Tất cả chi nhánh
                </h2>
                <button
                  onClick={() => navigate('/bar-branch')}
                  className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 text-sm group transition-all duration-300"
                >
                  Xem tất c���
                  <ArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="border-b border-yellow-500 mt-4 mb-4" />
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <ul className="space-y-3 pr-2">
                  {mapBranches.map((location, index) => (
                    <li 
                      key={index} 
                      className="flex items-start hover:bg-neutral-700 p-2 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleBarClick(location.barId)}
                    >
                      <span className="mr-2 text-yellow-500">📍</span>
                      <span className="text-sm text-gray-200">
                        <span className="font-medium text-yellow-500">{location.barName}</span>
                        <br />
                        <span className="text-gray-400">{location.address}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <LoadingSpinner open={isLoading} />
    </main>
  );
}

export default HomePage;
