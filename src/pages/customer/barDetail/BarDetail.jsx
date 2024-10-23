import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBarById } from '../../../lib/service/customerService'; // Removed getBarTableById
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Thêm import này

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

    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const handleBooking = () => {
        // Navigate to the booking table page and pass the barId
        navigate('/bookingtable', { state: { barId } });
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

    if (!barDetails) return <div>Loading...</div>;

    return (
        <div className="container bg-inherit p-4 flex flex-col items-center">
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
                <button 
                    className="text-gray-200 mb-4 flex items-center text-base hover:text-amber-400 transition-colors duration-300" 
                    onClick={handleBack}
                >
                    <ChevronLeftIcon /> Quay Lại
                </button>
                <img src={barDetails.images} alt={barDetails.barName} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h1 className="text-2xl text-yellow-500 font-bold mb-2">{barDetails.barName}</h1>
                <div className="flex items-center mb-2">
                    <StarIcon className='text-yellow-500 mr-2' />
                    <span className="text-yellow-500 text-base mr-2">Đánh giá:</span>
                    <span className="text-yellow-500 text-base mr-2">{averageRating}</span>
                    <span className="text-white text-sm">({totalReviews} đánh giá)</span>
                </div>
                <div className="mb-4">
                    <p className="text-white my-2">
                        <LocationOnIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Địa chỉ:</span> {barDetails.address}
                    </p>
                    <p className="text-white my-2">
                        <WatchLaterIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Thời gian mở cửa - đóng cửa:</span> {barDetails.startTime.slice(0, 5)} - {barDetails.endTime.slice(0, 5)}
                    </p>
                </div>
                <hr className="border-yellow-500 mb-4" />
                <p className="mb-4">{barDetails.description}</p>
                <button className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg" onClick={handleBooking}>Đặt bàn</button>
            </div>
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg mt-4 w-full max-w-4xl">
                <h2 className="text-2xl text-yellow-500 font-bold mb-4">Đánh giá</h2>
                <FeedbackList feedbacks={barDetails.feedBacks} />
            </div>
        </div>
    );
};

export default BarDetail;
