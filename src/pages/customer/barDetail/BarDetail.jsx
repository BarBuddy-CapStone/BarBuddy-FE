import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBarById } from '../../../lib/service/customerService'; // Removed getBarTableById
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Thêm import này
import { LoadingSpinner } from 'src/components'; // Import LoadingSpinner
import { GoongMap } from 'src/lib';

// Component hiển thị danh sách đánh giá
const FeedbackList = React.memo(({ feedbacks }) => (
    <div className="space-y-4">
        {feedbacks.map((feedback, index) => (
            <div key={index} className="bg-[#3A3B3C] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <img src={feedback.imageAccount} alt="User" className="w-10 h-10 rounded-full mr-2" />
                    <div>
                        <h3 className="text-lg font-bold">{feedback.accountName || "Người dùng"}</h3>
                        <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">{"★".repeat(feedback.rating)}</span>
                            <span className="text-gray-400">{new Date(feedback.createdTime).toLocaleDateString()}, {new Date(feedback.createdTime).toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
                <p>{feedback.comment}</p>
            </div>
        ))}
    </div>
));

const BarDetail = () => {
    const { barId } = useParams();
    const [barDetails, setBarDetails] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // New state for loading

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
        <div className="container bg-inherit p-4">
            {/* Container chính */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <button
                    className="text-gray-200 mb-4 flex items-center text-base hover:text-amber-400 transition-colors duration-300"
                    onClick={handleBack}
                >
                    <ChevronLeftIcon /> Quay Lại
                </button>
                <img src={barDetails.images} alt={barDetails.barName} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h1 className="text-3xl text-yellow-500 font-bold mb-4">{barDetails.barName}</h1>
                
                {/* Các phần thông tin chi tiết giữ nguyên */}
                <div className="mb-4 ml-1 flex items-center">
                    <span className="text-gray-400 my-2">
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

                <div className="flex items-center mb-4">
                    <StarIcon className='text-yellow-500 mr-2' />
                    <span className="text-yellow-500 text-lg mr-2">Đánh giá:</span>
                    <span className="text-yellow-500 text-lg mr-2">{averageRating}</span>
                    <span className="text-white text-sm">({totalReviews} đánh giá)</span>
                </div>

                <div className="mb-6">
                    <p className="text-white my-2">
                        <LocationOnIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Địa chỉ:</span> {barDetails.address}
                    </p>
                    <p className="text-white my-2">
                        <WatchLaterIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Thời gian hoạt động:</span>
                    </p>
                    {isOpenEveryDay ? (
                        <p className="text-green-500 my-2">Mở cửa mỗi ngày</p>
                    ) : (
                        <ul className="text-white my-2 pl-4 list-disc">
                            {sortedBarTimeResponses.map((time) => (
                                <li key={time.barTimeId}>
                                    {dayOfWeekMap[time.dayOfWeek]}: {time.startTime.slice(0, 5)} - {time.endTime.slice(0, 5)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <hr className="border-yellow-500 mb-4" />
                <p className="mb-6">{barDetails.description}</p>
                <button 
                    className={`px-6 py-3 rounded-lg font-semibold ${
                        barDetails.isAnyTableAvailable 
                            ? 'bg-yellow-500 text-gray-800 hover:bg-yellow-600' 
                            : 'bg-gray-500 text-white cursor-not-allowed'
                    }`}
                    onClick={handleBooking}
                    disabled={isLoading || !barDetails.isAnyTableAvailable}
                >
                    {isLoading ? 'Đang xử lý...' : (barDetails.isAnyTableAvailable ? 'Đặt bàn' : 'Hết Bàn')}
                </button>
            </div>

            {/* Phần đánh giá */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-4xl">
                <h2 className="text-2xl text-yellow-500 font-bold mb-4">Đánh giá</h2>
                <FeedbackList feedbacks={barDetails.feedBacks} />
            </div>

            {/* Map container - Đặt ở góc phải */}
            <div className="fixed top-32 right-8 bg-neutral-800 p-4 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl text-yellow-500 font-bold mb-4">Vị trí quán</h2>
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

            <LoadingSpinner open={isLoading} />
        </div>
    );
};

export default BarDetail;
