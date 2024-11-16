import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBarById } from '../../../lib/service/customerService';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import StarIcon from '@mui/icons-material/Star';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { LoadingSpinner, ImageGallery } from 'src/components';
import { GoongMap } from 'src/lib';
import { getAllDrinkByBarId } from 'src/lib/service/managerDrinksService';
import { Pagination } from '@mui/material';
import Login from 'src/pages/(auth)/login/Login';
import { toast } from 'react-toastify';

const FeedbackList = React.memo(({ feedbacks }) => {
    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    }, []);

    return (
        <div className="space-y-4">
            {feedbacks.map((feedback) => {
                const { date, time } = formatDate(feedback.createdTime);
                return (
                    <div key={feedback.id} className="bg-[#3A3B3C] p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <img
                                src={feedback.imageAccount}
                                alt="User"
                                className="w-10 h-10 rounded-full mr-2"
                                loading="lazy" // Thêm lazy loading cho ảnh
                            />
                            <div>
                                <h3 className="text-lg font-bold">{feedback.accountName || "Người dùng"}</h3>
                                <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1">{"★".repeat(feedback.rating)}</span>
                                    <span className="text-gray-400">{date}, {time}</span>
                                </div>
                            </div>
                        </div>
                        <p>{feedback.comment}</p>
                    </div>
                );
            })}
        </div>
    );
});

const DrinkCard = React.memo(({ images, drinkName, price, drinkId }) => {
    const redirect = useNavigate();
    const drinkDetailHandle = () => {
        redirect(`/drink-detail?drinkId=${drinkId}`);
    };

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);

    return (
        <div className="flex flex-col w-[calc(33.333%-1rem)] min-w-[250px] transition-transform transform hover:scale-105">
            <div className="flex flex-col grow items-center w-full text-center rounded-xl bg-neutral-700 p-4">
                <img
                    loading="lazy"
                    src={images}
                    alt={drinkName}
                    className="object-contain w-full h-48 rounded-md"
                />
                <div className="flex flex-col justify-between h-[80px] w-full">
                    <button onClick={drinkDetailHandle} className="w-full" title={drinkName}>
                        <h3 className="mt-3 text-base leading-7 text-zinc-100 hover:text-amber-400 truncate">
                            {drinkName}
                        </h3>
                    </button>
                    <p className="text-sm leading-snug text-amber-400">{formattedPrice}</p>
                </div>
            </div>
        </div>
    );
});

const BarBuddyDrinks = React.memo(({ barId, barName }) => {
    const [drinkData, setDrinkData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const MAX_DISPLAY_ITEMS = 6;

    const handleViewMore = () => {
        navigate('/drink-list', {
            state: {
                drinksOfBar: drinkData,
                barId: barId,
                barName: barName
            }
        });
    };

    useEffect(() => {
        const dataFetchDrink = async () => {
            try {
                setIsLoading(true);
                const response = await getAllDrinkByBarId(barId);
                const dataFetch = response?.data?.data || [];
                setDrinkData(dataFetch);
            } catch (error) {
                console.error('Error fetching drinks:', error);
            } finally {
                setIsLoading(false);
            }
        };
        dataFetchDrink();
    }, [barId]);

    // Chỉ lấy 6 phần tử đầu tiên
    const displayedDrinks = drinkData.slice(0, MAX_DISPLAY_ITEMS);
    const hasMoreDrinks = drinkData.length > MAX_DISPLAY_ITEMS;

    return (
        <section className="w-full rounded-lg flex flex-col">
            <header className="flex flex-wrap gap-3 justify-between w-full leading-snug">
                <h2 className="text-2xl text-amber-400">Đồ uống tại chi nhánh</h2>
            </header>
            <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid max-md:max-w-full" />
            <div className="mt-5 max-md:max-w-full">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="flex flex-wrap gap-4">
                            {displayedDrinks.map((drink, index) => (
                                <DrinkCard key={drink.id || index} {...drink} />
                            ))}
                        </div>
                        {hasMoreDrinks && (
                            <div className="flex justify-center mt-6 mb-2">
                                <button 
                                    onClick={handleViewMore}
                                    className="px-6 py-2 bg-yellow-500 text-gray-800 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-semibold"
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
});


const BarDetail = () => {
    const { barId } = useParams();
    const [barDetails, setBarDetails] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const handleLoginSuccess = (userData) => {
        setShowLoginPopup(false);
        toast.success("Đăng nhập thành công! Bạn có thể tiếp tục đặt bàn.");
    };

    const handleBooking = () => {
        if (!barDetails.isAnyTableAvailable) return;

        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            setShowLoginPopup(true);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/bookingtable', { state: { barId } });
        }, 1000);
    };

    const calculateRatingStats = useCallback((feedbacks) => {
        if (!feedbacks?.length) return { averageRating: 0, totalReviews: 0 };
        const total = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
        return {
            averageRating: (total / feedbacks.length).toFixed(1),
            totalReviews: feedbacks.length
        };
    }, []);

    useEffect(() => {
        const fetchBarDetails = async () => {
            try {
                setIsLoading(true);
                const barData = await getBarById(barId);
                if (barData.status === 200) {
                    const barInfo = barData.data.data;
                    setBarDetails(barInfo);
                    const { averageRating, totalReviews } = calculateRatingStats(barInfo.feedBacks);
                    setAverageRating(averageRating);
                    setTotalReviews(totalReviews);
                }
            } catch (error) {
                console.error("Error fetching bar details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (barId) {
            fetchBarDetails();
        }
    }, [barId, calculateRatingStats]);

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
            {/* Thêm popup đăng nhập */}
            {showLoginPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <Login 
                        onClose={() => setShowLoginPopup(false)}
                        onLoginSuccess={handleLoginSuccess}
                        onSwitchToRegister={() => {
                            setShowLoginPopup(false);
                        }}
                    />
                </div>
            )}

            {/* Container chính */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <button
                    className="text-gray-200 mb-4 flex items-center text-base hover:text-amber-400 transition-colors duration-300"
                    onClick={handleBack}
                >
                    <ChevronLeftIcon /> Quay Lại
                </button>
                <ImageGallery images={barDetails.images} />
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
                    className={`px-6 py-3 rounded-lg font-semibold ${barDetails.isAnyTableAvailable
                        ? 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'
                        : 'bg-gray-500 text-white cursor-not-allowed'
                        }`}
                    onClick={handleBooking}
                    disabled={isLoading || !barDetails.isAnyTableAvailable}
                >
                    {isLoading ? 'Đang xử lý...' : (barDetails.isAnyTableAvailable ? 'Đặt bàn' : 'Hết Bàn')}
                </button>
            </div>

            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-4xl">
                <BarBuddyDrinks barId={barId} barName={barDetails.barName} />
            </div>

            {/* Phần đánh giá */}
            <div className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-4xl">
                <h2 className="text-2xl text-yellow-500 font-bold mb-4">Đánh giá</h2>
                <FeedbackList feedbacks={barDetails.feedBacks} />
            </div>

            {/* Map container - Đặt ở góc phải */}
            <div className="fixed top-32 right-8 bg-neutral-800 p-4 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl text-yellow-500 font-bold mb-2">Vị trí quán</h2>
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