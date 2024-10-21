import React, { useEffect, useState } from 'react';
import AddDrinkCategoryForm from './PopUpCreate';
import UpdDrinkCategoryForm from './PopUpUpdate';
import PopupConfirmDelete from 'src/components/popupConfirm/popupCfDelete';
import { useNavigate } from 'react-router-dom';
import { getAllDrinkCate, getOneDrinkCate } from 'src/lib/service/drinkCateService';
import { CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Info, Edit, Delete } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CategoryCard = ({ id, type, description, setLoading, refreshList }) => {
    const redirect = useNavigate();
    const [isPopupUpdate, setIsPopupUpdate] = useState(false);
    const [isPopupDelete, setIsPopupDelete] = useState(false);

    const handleEditClick = () => {
        setIsPopupUpdate(true);
    };

    const handleCloseUpdatePopup = () => {
        setIsPopupUpdate(false);
        refreshList();
    };

    const handleCloseDeletePopup = () => {
        setIsPopupDelete(false);
        refreshList();
    };

    return (
        <div className="flex flex-col p-4 w-full rounded-xl bg-neutral-200 bg-opacity-50 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="flex items-center gap-1 flex-grow">
                    <span className='text-lg font-bold whitespace-nowrap'>Loại:</span>
                    <span className="text-lg break-words">{type}</span>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => redirect(`/admin/managerDrinkCategory/managerDrink?cateId=${id}`)} className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                        <Info className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={handleEditClick} className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                        <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={() => setIsPopupDelete(true)} className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                        <Delete className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="flex gap-3 w-full text-base text-black">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 self-start mt-1 w-6 aspect-square" alt="" />
                <p className="flex-1 min-h-[60px] break-words">{description}</p>
            </div>
            {isPopupUpdate && (
                <UpdDrinkCategoryForm 
                    setLoading={setLoading} 
                    data={{ drinksCategoryId: id, drinksCategoryName: type, description: description }}
                    onClose={handleCloseUpdatePopup}
                />
            )}
            {isPopupDelete && (
                <PopupConfirmDelete 
                    refreshList={refreshList} 
                    setLoading={setLoading} 
                    onClose={handleCloseDeletePopup} 
                    id={id} 
                    confirmDelete={true} 
                />
            )}
        </div>
    );
};

const DrinkCategories = () => {
    const [drinkCateList, setDrinkCateList] = useState([]);
    const [isPopupCreate, setIsPopupCreate] = useState(false);
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

    const handleAddCategory = async () => {
        setIsPopupCreate(true);
    };

    const handleCloseAddPopup = () => {
        setIsPopupCreate(false);
        fetchdataDrCate(); // Fetch lại data sau khi thêm
    };

    return (
        <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
            <div className="flex flex-col gap-0 max-md:flex-col">
                <BelowHeader onAddDrinkCategory={handleAddCategory} />
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
                            {drinkCateList.map((category, index) => (
                                <CategoryCard
                                    key={category.drinksCategoryId}
                                    id={category.drinksCategoryId}
                                    type={category.drinksCategoryName}
                                    description={category.description}
                                    refreshList={fetchdataDrCate}
                                    setLoading={setLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isPopupCreate && (
                <AddDrinkCategoryForm onClose={handleCloseAddPopup} setLoading={setLoading} refreshList={fetchdataDrCate} />
            )}
        </main>
    );
};

const BelowHeader = ({ onAddDrinkCategory }) => (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mx-4 my-6">
        <h1 className="text-3xl font-bold">Danh mục thức uống</h1>
        <button
            onClick={onAddDrinkCategory}
            className="flex items-center justify-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
        >
            <Add className="w-5 h-5" />
            <span>Thêm danh mục</span>
        </button>
    </div>
);

BelowHeader.propTypes = {
    onAddDrinkCategory: PropTypes.func.isRequired,
};

export default DrinkCategories;
