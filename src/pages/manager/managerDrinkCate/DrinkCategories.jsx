import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDrinkCate } from 'src/lib/service/drinkCateService';
import { CircularProgress } from '@mui/material';
import { Add, Info } from '@mui/icons-material';

const CategoryCard = ({ id, type, description }) => {
    const navigate = useNavigate();

    const handleInfoClick = () => {
        navigate(`/manager/managerDrinkCategory/managerDrink/${id}`);
    };

    const handleAddDrinkClick = () => {
        navigate(`/manager/managerDrink/addDrink?cateId=${id}`);
    };

    return (
        <div className="flex flex-col p-4 w-full rounded-xl bg-neutral-200 bg-opacity-50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="flex items-center gap-1 flex-grow">
                    <span className='text-lg font-bold whitespace-nowrap'>Loại:</span>
                    <span className="text-lg break-words">{type}</span>
                </div>

                <div className="flex gap-2 flex-shrink-0 items-center">
                    <button 
                        onClick={handleInfoClick} 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center"
                        title="Xem chi tiết"
                    >
                        <Info className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={handleAddDrinkClick} 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center"
                        title="Thêm đồ uống"
                    >
                        <Add className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="flex gap-3 w-full text-base text-black">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66" className="object-contain shrink-0 self-start mt-1 w-6 aspect-square" alt="" />
                <p className="flex-1 min-h-[60px] break-words">{description}</p>
            </div>
        </div>
    );
};

const DrinkCategories = () => {
    const [drinkCateList, setDrinkCateList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(false);

    const fetchdataDrCate = async () => {
        setLoading(true);
        setNoData(false);
        try {
            const response = await getAllDrinkCate();
            if (response?.data?.data?.length > 0) {
                setDrinkCateList(response.data.data);
            } else {
                setNoData(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNoData(true);
            } else {
                console.log(error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchdataDrCate();
    }, []);

    return (
        <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
            <div className="flex flex-col gap-0 max-md:flex-col">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mx-4 my-6">
                    <h1 className="text-3xl font-bold">Danh mục thức uống</h1>
                </div>
                <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <CircularProgress />
                        </div>
                    ) : noData ? (
                        <div className="flex justify-center items-center h-32">
                            <p className="text-red-500 text-lg font-semibold">Không có Loại thức uống nào cả</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {drinkCateList.map((category) => (
                                <CategoryCard
                                    key={category.drinksCategoryId}
                                    id={category.drinksCategoryId}
                                    type={category.drinksCategoryName}
                                    description={category.description}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DrinkCategories;
