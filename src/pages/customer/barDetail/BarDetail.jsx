import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBarById } from '../../../lib/service/customerService'; // Removed getBarTableById
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Thêm import này
import { LoadingSpinner } from 'src/components'; // Import LoadingSpinner
import { GoongMap } from 'src/lib';
import { getEventByBarId } from '../../../lib/service/eventManagerService';
import { ArrowForward, ArrowBack, ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';

// Component hiển thị danh sách đánh giá
const FeedbackList = React.memo(({ feedbacks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 5;

  // Tính toán feedback cho trang hiện tại
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to reviews section smoothly
    document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center justify-center gap-8 p-6 bg-neutral-900 rounded-lg mb-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-yellow-500 mb-2">
            {(feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length || 0).toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} className="text-yellow-500 w-5 h-5" />
            ))}
          </div>
          <div className="text-sm text-gray-400">{feedbacks.length} đánh giá</div>
        </div>
        
        {/* Rating Distribution */}
        <div className="flex-1 max-w-xs">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = feedbacks.filter(f => Math.floor(f.rating) === rating).length;
            const percentage = (count / feedbacks.length) * 100 || 0;
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm mb-1">
                <div className="flex items-center gap-1 w-16">
                  <span>{rating}</span>
                  <StarIcon className="text-yellow-500 w-4 h-4" />
                </div>
                <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-400 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {currentFeedbacks.map((feedback, index) => (
          <div key={index} className="bg-neutral-900 p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <img 
                src={feedback.imageAccount} 
                alt={feedback.accountName} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {feedback.accountName || "Người dùng"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon 
                            key={i}
                            className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <time>
                        {new Date(feedback.createdTime).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-300">{feedback.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
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

      {/* No Reviews Message */}
      {feedbacks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Chưa có đánh giá nào cho quán bar này
        </div>
      )}
    </div>
  );
});

// Cập nhật component EventSlider
const EventSlider = React.memo(({ events, onEventClick }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const viewAllEvents = () => {
    navigate('/event');
  };

  useEffect(() => {
    if (!events || events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [events]);

  if (!events || events.length === 0) return null;

  return (
    <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-yellow-500 font-bold">Sự kiện đang diễn ra</h2>
        <button
          onClick={viewAllEvents}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1 text-sm group transition-all duration-300"
        >
          Xem tất cả
          <ArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      
      {/* Điều chỉnh chiều cao của slider container */}
      <div className="relative w-full h-[300px] overflow-hidden rounded-lg"> {/* Giảm từ 400px xuống 300px */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {events.map((event, index) => (
            <div
              key={event.eventId}
              className="flex-none w-full h-full relative cursor-pointer"
              onClick={() => onEventClick(event.eventId)}
            >
              <img
                src={event.images}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
              {/* Điều chỉnh overlay và content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4"> {/* Giảm padding từ p-6 xuống p-4 */}
                <h3 className="text-xl font-bold text-yellow-500 mb-1"> {/* Giảm font-size và margin */}
                  {event.eventName}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows - Điều chỉnh vị trí */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all duration-300 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
          }}
        >
          <ArrowBackIos className="text-yellow-500 w-4 h-4" />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all duration-300 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSlide((prev) => (prev + 1) % events.length);
          }}
        >
          <ArrowForwardIos className="text-yellow-500 w-4 h-4" />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {events.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentSlide === index ? 'bg-yellow-500 w-3' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

const BarDetail = () => {
    const { barId } = useParams();
    const [barDetails, setBarDetails] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [events, setEvents] = useState([]);

    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const handleBooking = () => {
        if (!barDetails.isAnyTableAvailable) return; // Prevent booking if no tables available
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/bookingtable', { state: { barId } });
        }, 1000);
    };

    useEffect(() => {
        const fetchBarDetails = async () => {
            try {
                const barData = await getBarById(barId);
                if (barData.status === 200) {
                    const barInfo = barData.data.data;
                    setBarDetails(barInfo);
                    const rating = barInfo.feedBacks.length > 0
                        ? (barInfo.feedBacks.reduce((acc, feedback) => acc + feedback.rating, 0) / barInfo.feedBacks.length).toFixed(1)
                        : 0;
                    setAverageRating(rating);
                    setTotalReviews(barInfo.feedBacks.length);
                } else {
                    console.error("Failed to fetch bar details");
                }
            } catch (error) {
                console.error("Error fetching bar details:", error);
            }
        };

        if (barId) {
            fetchBarDetails();
        }
    }, [barId]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getEventByBarId(barId);
                if (response.data.statusCode === 200) {
                    setEvents(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (barId) {
            fetchEvents();
        }
    }, [barId]);

    const handleEventClick = useCallback((eventId) => {
        navigate(`/event/${eventId}`);
    }, [navigate]);

    const dayOfWeekMap = {
        0: 'Chủ Nhật',
        1: 'Thứ Hai',
        2: 'Thứ Ba',
        3: 'Thứ Tư',
        4: 'Thứ Năm',
        5: 'Thứ Sáu',
        6: 'Thứ Bảy'
    };

    const sortedBarTimeResponses = barDetails?.barTimeResponses.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    const isOpenEveryDay = barDetails?.barTimeResponses.length === 7;

    if (!barDetails) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 max-w-[1440px]">
            {/* Main content */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg mb-6">
                <button
                    className="text-gray-200 mb-4 flex items-center text-base hover:text-amber-400 transition-colors duration-300"
                    onClick={handleBack}
                >
                    <ChevronLeftIcon /> Quay Lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column - Main info */}
                    <div>
                        <img 
                            src={barDetails.images} 
                            alt={barDetails.barName} 
                            className="w-full h-64 object-cover rounded-lg mb-4" 
                        />
                        <h1 className="text-3xl text-yellow-500 font-bold mb-4">{barDetails.barName}</h1>
                        
                        <div className="flex items-center mb-4">
                            <StarIcon className='text-yellow-500 mr-2' />
                            <span className="text-yellow-500 text-lg mr-2">Đánh giá:</span>
                            <span className="text-yellow-500 text-lg mr-2">{averageRating}</span>
                            <span className="text-white text-sm">({totalReviews} đánh giá)</span>
                        </div>

                        <p className="text-white mb-4">
                            <LocationOnIcon className='text-yellow-500 mr-2' />
                            <span className="text-yellow-500">Địa chỉ:</span> {barDetails.address}
                        </p>

                        <hr className="border-yellow-500 my-4" />
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
                                <span className="w-5 h-5">📝</span>
                                Giới thiệu về quán
                            </h3>
                            <p className="text-gray-300 leading-relaxed pl-7">
                                {barDetails.description}
                            </p>
                        </div>
                    </div>

                    {/* Right column - Operating info */}
                    <div className="bg-neutral-900 p-6 rounded-lg">
                        {/* Header với tên quán */}
                        <div className="mb-6 text-center pb-4 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-yellow-500">{barDetails.barName}</h2>
                            <p className="text-sm text-gray-400 mt-1">Chi nhánh Bar Buddy</p>
                        </div>

                        <div className="mb-6">
                            {/* Status và Booking Button */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between bg-neutral-800 p-3 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-gray-400">
                                            <img
                                                src={barDetails.isAnyTableAvailable
                                                    ? "https://img.icons8.com/?size=100&id=60362&format=png&color=40C057"
                                                    : "https://img.icons8.com/?size=100&id=60362&format=png&color=FA5252"
                                                }
                                                alt={barDetails.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}
                                                className="inline-block w-5 h-5 mr-2"
                                            />
                                        </span>
                                        <span className="text-lg text-white">{barDetails.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <button 
                                    className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                        barDetails.isAnyTableAvailable 
                                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-yellow-500/50' 
                                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                    }`}
                                    onClick={handleBooking}
                                    disabled={isLoading || !barDetails.isAnyTableAvailable}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {barDetails.isAnyTableAvailable ? (
                                                <>
                                                    <span>Đặt bàn ngay</span>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </>
                                            ) : 'Hết Bàn'}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Operating Hours */}
                            <div className="bg-neutral-800 p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <WatchLaterIcon className='text-yellow-500 mr-2' />
                                    <span className="text-yellow-500">Thời gian hoạt động</span>
                                </h3>
                                {isOpenEveryDay ? (
                                    <p className="text-green-500 ml-8">Mở cửa mỗi ngày</p>
                                ) : (
                                    <ul className="space-y-2 ml-8">
                                        {sortedBarTimeResponses.map((time) => (
                                            <li key={time.barTimeId} className="text-gray-300 flex justify-between">
                                                <span className="text-yellow-500">{dayOfWeekMap[time.dayOfWeek]}</span>
                                                <span>{time.startTime.slice(0, 5)} - {time.endTime.slice(0, 5)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Features */}
                            <div className="bg-neutral-800 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 text-yellow-500">Tiện ích</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-300">
                                        <span className="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded-full mr-3">🎵</span>
                                        Âm nhạc sôi động
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <span className="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded-full mr-3">🍸</span>
                                        Cocktail đặc biệt
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <span className="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded-full mr-3">🎉</span>
                                        Không gian rộng rãi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <EventSlider events={events} onEventClick={handleEventClick} />

            {/* Map Section */}
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl text-yellow-500 font-bold mb-4">Vị trí quán</h2>
                <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span className="text-sm text-white">Vị trí của bạn</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-sm text-white">Chi nhánh</span>
                    </div>
                </div>
                <div className="w-full h-[280px] rounded-lg overflow-hidden border border-gray-700">
                    <GoongMap
                        branches={[{
                            barId: barDetails.barId,
                            barName: barDetails.barName,
                            address: barDetails.address,
                            latitude: barDetails.latitude,
                            longitude: barDetails.longitude
                        }]}
                    />
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                    Nhấn vào marker để xem thông tin chi tiết
                </div>
            </div>

            {/* Reviews Section - Thay đổi layout */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg" id="reviews-section">
                <div className="max-w-3xl mx-auto"> {/* Thêm container giới hạn chiều rộng và căn giữa */}
                    <h2 className="text-2xl text-yellow-500 font-bold mb-6 text-center">Đánh giá từ khách hàng</h2>
                    
                    {/* Thống kê đánh giá */}
                    <div className="flex justify-center items-center gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500 mb-1">{averageRating}</div>
                            <div className="text-sm text-gray-400">Điểm trung bình</div>
                        </div>
                        <div className="h-12 w-px bg-gray-700"></div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500 mb-1">{totalReviews}</div>
                            <div className="text-sm text-gray-400">Lượt đánh giá</div>
                        </div>
                    </div>

                    {/* Danh sách đánh giá */}
                    <FeedbackList feedbacks={barDetails.feedBacks} />
                </div>
            </div>

            <LoadingSpinner open={isLoading} />
        </div>
    );
};

export default BarDetail;
