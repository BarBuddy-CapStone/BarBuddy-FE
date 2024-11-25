import React, { useState, useEffect, useCallback } from 'react';
import { getEventAllBar } from '../../../lib/service/eventManagerService';
import { AccessTime, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isStill, setIsStill] = useState(''); // Default là tất cả sự kiện
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getEventAllBar({
        pageIndex: currentPage,
        pageSize: 6,
        isStill: isStill === '' ? undefined : Number(isStill)
      });
      if (response.data.statusCode === 200) {
        setEvents(response.data.data.eventResponses);
        setTotalPages(response.data.data.totalPages);
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getDayOfWeekText = (dayOfWeek) => {
    const days = [
      'Chủ nhật',
      'Thứ 2', 
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7'
    ];
    return days[dayOfWeek];
  };

  const sortEventTimes = (times) => {
    return times.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderEventTime = (time) => {
    if (time.date) {
      return (
        <div className="flex items-center text-gray-400 text-sm">
          <AccessTime className="w-4 h-4 mr-2" />
          <span className="text-yellow-500 mr-2">
            Diễn ra vào ngày {formatDate(time.date)}:
          </span>
          <span>
            <span className="text-yellow-500">Bắt đầu: </span>
            {time.startTime.slice(0, 5)}
            <span className="text-yellow-500 ml-2">Kết thúc: </span>
            {time.endTime.slice(0, 5)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-400 text-sm">
          <AccessTime className="w-4 h-4 mr-2" />
          <span className="text-yellow-500 mr-2">
            {getDayOfWeekText(time.dayOfWeek)} hằng tuần:
          </span>
          <span>
            <span className="text-yellow-500">Bắt đầu: </span>
            {time.startTime.slice(0, 5)}
            <span className="text-yellow-500 ml-2">Kết thúc: </span>
            {time.endTime.slice(0, 5)}
          </span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2"
          >
            <ArrowBack /> Quay lại
          </button>
          <h1 className="text-3xl font-bold text-yellow-500">Sự kiện tại Bar Buddy</h1>
        </div>
        <select
          className="bg-neutral-700 text-white px-4 py-2 rounded-lg border border-yellow-500"
          value={isStill}
          onChange={(e) => setIsStill(e.target.value)}
        >
          <option value="">Tất cả sự kiện</option>
          <option value="0">Sự kiện hiện tại</option>
          <option value="1">Sự kiện sắp tới</option>
        </select>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/event/${event.eventId}`)}
            >
              <div className="relative h-48">
                <img
                  src={event.images}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{event.eventName}</h3>
                  <p className="text-yellow-500">{event.barName}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                  {event.description}
                </p>

                <div className="space-y-2">
                  {sortEventTimes(event.eventTimeResponses).map((time, index) => (
                    <React.Fragment key={index}>
                      {renderEventTime(time)}
                    </React.Fragment>
                  ))}
                </div>

                {event.eventVoucherResponse && (
                  <div className="mt-3 bg-yellow-500/10 p-3 rounded">
                    <p className="text-yellow-500 font-semibold">
                      Giảm {event.eventVoucherResponse.discount}%
                    </p>
                    <p className="text-gray-400 text-sm">
                      Tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(event.eventVoucherResponse.maxPrice)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Mã: {event.eventVoucherResponse.voucherCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <img 
            src="https://img.icons8.com/clouds/100/000000/calendar.png" 
            alt="No events" 
            className="w-24 h-24 mb-4 opacity-50"
          />
          <p className="text-gray-400 text-lg text-center mb-2">
            {isStill === '0' && "Không có sự kiện nào đang diễn ra"}
            {isStill === '1' && "Không có sự kiện nào sắp diễn ra"}
            {isStill === '' && "Không tìm thấy sự kiện nào"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
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
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Event;