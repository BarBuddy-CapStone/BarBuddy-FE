import React, { useEffect, useState } from 'react';
import { getAllDrinkCate } from 'src/lib/service/drinkCateService';
import { CircularProgress, Pagination } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import {PopUpCreate, PopUpUpdate, PopupConfirmDelete} from 'src/pages';

const CategoryCard = ({ category, setLoading }) => {
    const [isPopupUpdate, setIsPopupUpdate] = useState(false);
    const [isPopupDelete, setIsPopupDelete] = useState(false);

    const handleEditClick = () => {
        setIsPopupUpdate(true);
    };

    const handleCloseUpdatePopup = () => {
        setIsPopupUpdate(false);
    };

    const handleCloseDeletePopup = () => {
        setIsPopupDelete(false);
    };

    return (
        <div className="flex flex-col p-4 w-full rounded-xl bg-neutral-200 bg-opacity-50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="flex items-center gap-1 flex-grow">
                    <span className='text-lg font-bold whitespace-nowrap'>Loại:</span>
                    <span className="text-lg break-words">{category.drinksCategoryName}</span>
                </div>

                <div className="flex gap-2 flex-shrink-0 items-center">
                    <button onClick={handleEditClick} className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center">
                        <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={() => setIsPopupDelete(true)} className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center">
                        <Delete className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="flex gap-3 w-full text-base text-black">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66" className="object-contain shrink-0 self-start mt-1 w-6 aspect-square" alt="" />
                <p className="flex-1 min-h-[60px] break-words">{category.description}</p>
            </div>
            {isPopupUpdate && (
                <PopUpUpdate 
                    setLoading={setLoading} 
                    data={category}
                    onClose={handleCloseUpdatePopup}
                />
            )}
            {isPopupDelete && (
                <PopupConfirmDelete 
                    onClose={handleCloseDeletePopup}
                    data={category}
                    setLoading={setLoading} 
                />
            )}
        </div>
    );
};

const DrinkCategoriesAdmin = () => {
    const [drinkCateList, setDrinkCateList] = useState([]);
    const [isPopupCreate, setIsPopupCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [noData, setNoData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 6;
    const [searchTerm, setSearchTerm] = useState('');

    const fetchdataDrCate = async (search = '', page = currentPage) => {
        setLoading(true);
        setNoData(false);
        try {
            const response = await getAllDrinkCate(page, pageSize, search);

            if (response?.data?.data?.drinkCategoryResponses?.length > 0) {
                setDrinkCateList(response.data.data.drinkCategoryResponses);
                setTotalItems(response.data.data.totalItems);
                setNoData(false);
            } else {
                const totalPages = Math.ceil(response.data.data.totalItems / pageSize);
                if (page > 1 && page > totalPages) {
                    setCurrentPage(page - 1);
                } else {
                    setNoData(true);
                    setDrinkCateList([]);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setNoData(true);
            setDrinkCateList([]);
        }
        setLoading(false);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAddCategory = async () => {
        setIsPopupCreate(true);
    };

    const handleCloseAddPopup = () => {
        setIsPopupCreate(false);
        setCurrentPage(1);
    };

    const handleSearchClick = () => {
        fetchdataDrCate(searchTerm, currentPage);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchdataDrCate('', currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
            <div className="flex flex-col gap-0 max-md:flex-col">
                <div className="flex justify-between gap-4 mx-4 my-6">
                    <div className="relative w-[300px]">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={handleSearchClick}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <Search />
                        </button>
                    </div>
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center justify-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200"
                    >
                        <Add className="w-5 h-5" />
                        <span>Thêm danh mục</span>
                    </button>
                </div>

                <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">
                    Danh Sách Thể Loại Thức Uống
                </h2>

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
                        <>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {drinkCateList.map((category) => (
                                    <CategoryCard
                                        key={category.drinksCategoryId}
                                        category={category}
                                        setLoading={setLoading}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isPopupCreate && (
                <PopUpCreate 
                    onClose={handleCloseAddPopup} 
                    setLoading={setLoading}
                />
            )}
        </main>
    );
};

export default DrinkCategoriesAdmin; 