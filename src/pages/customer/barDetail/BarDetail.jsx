import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBranchById } from '../../../lib/service/customerService';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import StarIcon from '@mui/icons-material/Star';

const BarDetail = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const barId = queryParams.get('barId');
    const bar = getBranchById(parseInt(barId));
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/homepage");
    }

    return (
        <div className="container bg-black p-4 flex flex-col items-center">
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
                <button className="text-yellow-500 mb-4" onClick={handleBack}>&lt; Quay Lại</button>
                <img src={bar.image} alt={bar.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h1 className="text-2xl text-yellow-500 font-bold mb-2">{bar.name}</h1>
                <div className="flex items-center mb-2">
                    <StarIcon className='text-yellow-500 mr-2'/>
                    <span className="text-yellow-500 text-base mr-2">Đánh giá:</span>
                    <span className="text-yellow-500 text-base mr-2">{bar.rating}</span>
                    <span className="text-white text-sm">({bar.reviews} đánh giá)</span>
                </div>
                <div className="mb-4">
                    <p className="text-white my-2">
                        <LocationOnIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Địa chỉ:</span> {bar.address}
                    </p>
                    <p className="text-white my-2">
                        <WatchLaterIcon className='text-yellow-500 mr-2' />
                        <span className="text-yellow-500">Thời gian mở cửa - đóng cửa:</span> {bar.openingHours}
                    </p>
                </div>
                <hr className="border-yellow-500 mb-4" /> {/* Đường kẻ ngang màu vàng */}
                <p className="mb-4">Bar Buddy được thiết kế với lối kiến trúc cổ điển, lấy cảm hứng từ phong cách Tây Ban Nha và vẻ đẹp hoài cổ, độc đáo. Quán được xây dựng với những bức tường gạch đỏ gồ ghề, đậm chất riêng và mang màu sắc vintage đầy huyền ảo. Không giống với những quán bar khác thường thuê DJ chơi nhạc thì Carmen Bar lại thu hút bằng những đêm nhạc sống với những bài cực chill.</p>
                <button className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg">Đặt bàn</button>
            </div>
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg mt-4 w-full max-w-4xl">
                <h2 className="text-2xl text-yellow-500 font-bold mb-4">Đánh giá</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((review, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full mr-2" />
                                <div>
                                    <h3 className="text-lg font-bold">Bob Smith</h3>
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 mr-1">★★★★★</span>
                                        <span className="text-gray-400">15-9-2020, 13:00</span>
                                    </div>
                                </div>
                            </div>
                            <p>Nice Bar, Good Fruit</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BarDetail;