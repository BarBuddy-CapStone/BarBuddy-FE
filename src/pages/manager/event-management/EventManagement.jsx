import { useState, useEffect } from 'react';
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { toast } from 'react-toastify';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search'; // Thêm import cho icon Search
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { getEventByBarId } from '../../../lib/service/eventManagerService';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Thêm state mới cho input tìm kiếm
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDay, setSelectedDay] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const barId = userInfo?.identityId;

        if (!barId) {
          toast.error('Không tìm thấy thông tin quán bar!');
          return;
        }

        const response = await getEventByBarId(barId);
        
        if (response.data.statusCode === 200 && response.data.data) {
          const transformedEvents = response.data.data.flatMap(event => 
            event.eventTimeResponses.map(timeEvent => ({
              eventId: event.eventId,
              eventName: event.eventName,
              image: event.images,
              date: timeEvent.date,
              dayOfWeek: timeEvent.dayOfWeek,
              startTime: timeEvent.startTime.substring(0, 5),
              endTime: timeEvent.endTime.substring(0, 5),
              barsName: [userInfo?.barName || ""],
              voucher: event.eventVoucherResponse
            }))
          );

          const uniqueEvents = Object.values(transformedEvents.reduce((acc, event) => {
            if (!acc[event.eventId]) {
              acc[event.eventId] = event;
            }
            return acc;
          }, {}));

          const filteredEvents = uniqueEvents.filter((event) => {
            const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            let eventDayName;
            
            if (event.date) {
              const eventDate = new Date(event.date);
              eventDayName = dayNames[eventDate.getDay()];
            } else {
              eventDayName = dayNames[event.dayOfWeek % 7];
            }
            
            return event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectedDay === '' || eventDayName === selectedDay);
          });

          const sortedEvents = filteredEvents.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date();
            const dateB = b.date ? new Date(b.date) : new Date();
            return dateA - dateB;
          });

          const totalPages = Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage));
          setTotalPages(totalPages);

          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          }

          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, sortedEvents.length);
          const currentEvents = sortedEvents.slice(startIndex, endIndex);

          setEvents(currentEvents);
        } else {
          throw new Error('Không tìm thấy sự kiện nào!');
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error('Có lỗi xảy ra khi tải danh sách sự kiện!');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm, currentPage, selectedDay]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        <BelowHeader 
          searchInput={searchInput} 
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          navigate={navigate}
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
        />
        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : events.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500 text-lg font-semibold">Không có sự kiện</p>
            </div>
          ) : (
            <>
              <EventList events={events} />
              <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2}}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

const BelowHeader = ({ searchInput, onSearchChange, onSearch, navigate, selectedDay, onDayChange }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mx-4 my-6">
    <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={searchInput}
          onChange={onSearchChange}
          className="w-full px-4 py-2 pr-10 border border-sky-900 rounded-full"
        />
        <SearchIcon 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
          onClick={onSearch}
        />
      </div>
      <select
        value={selectedDay}
        onChange={onDayChange}
        className="w-full sm:w-64 px-4 py-2 border border-sky-900 rounded-full"
      >
        <option value="">Tất cả các ngày</option>
        <option value="Chủ Nhật">Chủ Nhật</option>
        <option value="Thứ 2">Thứ 2</option>
        <option value="Thứ 3">Thứ 3</option>
        <option value="Thứ 4">Thứ 4</option>
        <option value="Thứ 5">Thứ 5</option>
        <option value="Thứ 6">Thứ 6</option>
        <option value="Thứ 7">Thứ 7</option>
      </select>
    </div>
    <button
      className="flex items-center justify-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
      onClick={() => navigate('/manager/event-management/add-event')}
    >
      <Add className="w-5 h-5" />
      <span>Thêm sự kiện</span>
    </button>
  </div>
);

const EventList = ({ events }) => {
  const uniqueEvents = Object.values(events.reduce((acc, event) => {
    if (!acc[event.eventId]) {
      acc[event.eventId] = {
        ...event,
        timeSlots: []
      };
    }
    acc[event.eventId].timeSlots.push({
      date: event.date,
      dayOfWeek: event.dayOfWeek,
      startTime: event.startTime,
      endTime: event.endTime
    });
    return acc;
  }, {}));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
      {uniqueEvents.map((event) => (
        <EventCard key={event.eventId} {...event} />
      ))}
    </div>
  );
};

const formatDate = (date, dayOfWeek) => {
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  
  if (date) {
    // Trường hợp có ngày cố định
    const eventDate = new Date(date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
    const year = eventDate.getFullYear();
    return `${day}/${month}/${year}`;
  } else {
    // Trường hợp lặp lại hàng tuần
    return `${dayNames[dayOfWeek]} hàng tuần`;
  }
};

// Thêm hàm format tiền VND
const formatCurrency = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return '';
  return number.toLocaleString('vi-VN');
};

// Thêm hàm parse giá trị tiền từ format VND về số
const parseCurrency = (value) => {
  return value.replace(/[^\d]/g, '');
};

const EventCard = ({ eventId, eventName, image, timeSlots, barsName, voucher }) => {
  const formattedBars = barsName.length > 1 
    ? `${barsName[0]} và ${barsName.length - 1} quán khác`
    : barsName[0];

  const navigate = useNavigate();

  // Format giá voucher khi hiển thị
  const formattedMaxPrice = voucher ? formatCurrency(voucher.maxPrice) : '0';

  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-200 bg-opacity-50 shadow-md text-base overflow-hidden">
      <img src={image} alt={eventName} className="w-full h-48 object-cover" />
      <div className="px-4 py-5">
        <div className="flex justify-between items-start w-full mb-4">
          <div className="text-lg font-bold text-black truncate overflow-hidden pr-2 flex-1" title={eventName}>{eventName}</div>
          <InfoOutlinedIcon onClick={() => navigate(`/manager/event-management/event-detail/${eventId}`)} className="cursor-pointer flex-shrink-0 text-black" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          {timeSlots.map((slot, index) => (
            <div key={index} className="p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarTodayIcon className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 truncate" title={formatDate(slot.date, slot.dayOfWeek)}>
                  {formatDate(slot.date, slot.dayOfWeek)}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <AccessTimeIcon className="text-gray-600 flex-shrink-0" />
                <div className="flex-1 truncate" title={`${slot.startTime} - ${slot.endTime}`}>
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
            </div>
          ))}
          {voucher && (
            <div className="mt-2 p-2 bg-green-100 rounded-md">
              <p className="text-sm font-semibold text-green-700">
                Voucher: {voucher.eventVoucherName} - Giảm {voucher.discount}% (Tối đa {formattedMaxPrice} VNĐ)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
