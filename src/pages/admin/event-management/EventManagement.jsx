import { useState, useEffect } from 'react';
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { toast } from 'react-toastify';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search'; // Thêm import cho icon Search
import { useNavigate } from 'react-router-dom';
import { getBars } from 'src/lib/service/adminService';
import { Add } from '@mui/icons-material';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Thêm state mới cho input tìm kiếm
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await getBars();
        if (response.data && response.data.data) {
          setBars(response.data.data);
        } else {
          console.error('Invalid response format:', response);
          toast.error('Không thể tải danh sách quán bar');
        }
      } catch (error) {
        console.error('Error fetching bars:', error);
        toast.error('Không thể tải danh sách quán bar');
      }
    };

    fetchBars();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const allEvents = [
            {
              eventId: 1,
              eventName: "Đêm nhạc Jazz, Jazz, Jazz, Jazz, Jazz, Jazz",
              image: "https://thedotmagazine.com/wp-content/uploads/2022/12/Restaurant-Collage-no-logo-1.jpg",
              date: "2023-12-15",
              startTime: "20:00",
              endTime: "23:00",
              barsName: ["Jazz Club", "Blue Note", "Saxophone Lounge"]
            },
            {
              eventId: 2,
              eventName: "Lễ hội Cocktail",
              image: "https://cdn.tgdd.vn/Files/2021/01/11/1319612/list-5-quan-bar-noi-tieng-dong-vui-de-quay-het-minh-o-sai-gon-202101112314046551.jpg",
              date: "2023-12-20",
              startTime: "18:00",
              endTime: "22:00",
              barsName: ["Mixology Bar", "Speakeasy"]
            },
            {
              eventId: 3,
              eventName: "Đêm nhạc Rock",
              image: "https://prosound.vn/cdn/article_thumb/202304/nhung-dia-diem-quan-bar-pub-lounge-o-ha-noi-khong-the-bo-lo-thumb-1680577589.jpg",
              date: "2023-12-22",
              startTime: "21:00",
              endTime: "02:00",
              barsName: ["Rock Arena", "Guitar Hero", "Drumstick"]
            },
            {
              eventId: 4,
              eventName: "Tiệc Năm Mới",
              image: "https://lasinfoniavietnam.com/wp-content/uploads/2023/06/Terraco-view-1.jpg",
              date: "2023-12-31",
              startTime: "22:00",
              endTime: "04:00",
              barsName: ["Skyline Lounge", "Rooftop Bar", "Champagne Club", "Fireworks View"]
            },
            {
              eventId: 5,
              eventName: "Đêm Karaoke",
              image: "https://static.vinwonders.com/production/quan-bar-sai-gon-6.jpg",
              date: "2024-01-05",
              startTime: "19:00",
              endTime: "23:00",
              barsName: ["Sing Your Heart Out"]
            }
          ];
          
          const filteredEvents = allEvents.filter((event) =>
            event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedBar === '' || event.barsName.includes(selectedBar))
          );

          const indexOfLastEvent = currentPage * itemsPerPage;
          const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
          const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

          setEvents(currentEvents);
          setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm, currentPage, selectedBar]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleBarChange = (event) => {
    setSelectedBar(event.target.value);
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
          bars={bars}
          selectedBar={selectedBar}
          onBarChange={handleBarChange}
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

const BelowHeader = ({ searchInput, onSearchChange, onSearch, navigate, bars, selectedBar, onBarChange }) => (
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
        value={selectedBar}
        onChange={onBarChange}
        className="w-full sm:w-64 px-4 py-2 border border-sky-900 rounded-full"
      >
        <option value="">Tất cả quán bar</option>
        {bars.map((bar) => (
          <option key={bar.barId} value={bar.barName}>
            {bar.barName}
          </option>
        ))}
      </select>
    </div>
    <button
      className="flex items-center justify-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
      onClick={() => navigate('/admin/event-management/add-event')}
    >
      <Add className="w-5 h-5" />
      <span>Thêm sự kiện</span>
    </button>
  </div>
);

const EventList = ({ events }) => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    {events.map((event) => (
      <EventCard key={event.eventId} {...event} />
    ))}
  </div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${dayOfWeek}, ${day}/${month}/${year}`;
};

const EventCard = ({ eventName, image, date, startTime, endTime, barsName }) => {
  const formattedBars = barsName.length > 1 
    ? `${barsName[0]} và ${barsName.length - 1} quán khác`
    : barsName[0];

  const formattedDate = formatDate(date);

  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-200 bg-opacity-50 shadow-md text-base overflow-hidden">
      <img src={image} alt={eventName} className="w-full h-48 object-cover" />
      <div className="px-4 py-5">
        <div className="flex justify-between items-start w-full mb-4">
          <div className="text-lg font-bold text-black truncate overflow-hidden pr-2 flex-1" title={eventName}>{eventName}</div>
          <InfoOutlinedIcon className="cursor-pointer flex-shrink-0 text-black" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <CalendarTodayIcon className="text-gray-600 flex-shrink-0" />
            <div className="flex-1 truncate" title={formattedDate}>{formattedDate}</div>
          </div>
          <div className="flex items-center gap-2">
            <AccessTimeIcon className="text-gray-600 flex-shrink-0" />
            <div className="flex-1 truncate" title={`${startTime} - ${endTime}`}>{startTime} - {endTime}</div>
          </div>
          <div className="flex items-center gap-2">
            <LocationOnIcon className="text-gray-600 flex-shrink-0" />
            <div className="flex-1 truncate" title={formattedBars}>{formattedBars}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
