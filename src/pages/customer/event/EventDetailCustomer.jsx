import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventByEventID } from '../../../lib/service/eventManagerService';
import { AccessTime, ArrowBack, LocationOn, LocalOffer } from '@mui/icons-material';

const EventDetailCustomer = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await getEventByEventID(eventId);
        if (response.data.statusCode === 200) {
          setEvent(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);

  const getDayOfWeek = (day) => {
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    return days[day];
  };

  const getEventStatus = (isStill) => {
    switch(isStill) {
      case 0:
        return { text: "Đang diễn ra", class: "bg-green-500" };
      case 1:
        return { text: "Sắp diễn ra", class: "bg-yellow-500" };
      default:
        return { text: "Đã kết thúc", class: "bg-red-500" };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2"
        >
          <ArrowBack /> Quay lại
        </button>
        <h1 className="text-2xl font-bold text-yellow-500">Chi tiết sự kiện</h1>
      </div>

      <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <div className="relative h-[500px]">
          <img
            src={event.images}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex gap-2">
                {(() => {
                  const status = getEventStatus(event.isStill);
                  return (
                    <span className={`${status.class} text-black px-4 py-1 rounded-full text-sm font-semibold`}>
                      {status.text}
                    </span>
                  );
                })()}
              </div>

              <h1 className="text-5xl font-bold text-white">{event.eventName}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <LocationOn className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-yellow-500">Địa điểm</p>
                    <p>{event.barName}</p>
                  </div>
                </div>

                {event.eventTimeResponses.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AccessTime className="text-yellow-500" />
                    <div>
                      <p className="text-sm text-yellow-500">Thời gian</p>
                      <p>{getDayOfWeek(time.dayOfWeek)}, {time.startTime.slice(0, 5)} - {time.endTime.slice(0, 5)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">Thông tin chi tiết</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {event.eventVoucherResponse && (
              <div className="bg-neutral-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <LocalOffer className="text-yellow-500" />
                  <h2 className="text-xl font-bold text-yellow-500">
                    Ưu đãi đặc biệt
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-yellow-500/10 p-6 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-500">
                      Giảm {event.eventVoucherResponse.discount}%
                    </p>
                    <p className="text-gray-400 mt-2">
                      Tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(event.eventVoucherResponse.maxPrice)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 mb-2 text-center">Mã ưu đãi của bạn</p>
                    <div className="bg-neutral-800 p-4 rounded-lg border-2 border-yellow-500/30">
                      <p className="text-2xl font-mono text-yellow-500 text-center tracking-wider">
                        {event.eventVoucherResponse.voucherCode}
                      </p>
                    </div>
                  </div>

                  <div className="text-center bg-neutral-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Còn lại
                    </p>
                    <p className="text-xl font-bold text-yellow-500">
                      {event.eventVoucherResponse.quantity} voucher
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-neutral-700 bg-neutral-900">
          <button
            onClick={() => navigate(`/bar-detail/${event.barId}`)}
            className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <LocationOn />
            Xem chi tiết quán bar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailCustomer;