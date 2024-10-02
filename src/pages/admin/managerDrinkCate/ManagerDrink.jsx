import React, { useEffect, useState } from 'react';
import AddDrinkCategoryForm from './PopUpCreate';
import UpdDrinkCategoryForm from './PopUpUpdate';
import PopupConfirmDelete from 'src/components/popupConfirm/popupCfDelete';
import { useNavigate } from 'react-router-dom';
import { getAllDrinkCate, getOneDrinkCate } from 'src/lib/service/drinkCateService';
import { CircularProgress } from '@mui/material';

const CategoryCard = ({ id, type, description, setLoading, refreshList }) => {
    const redirect = useNavigate();
    const listDrinkBasedCateHandle = () => {
        redirect(`/admin/managerDrinkCategory/managerDrink?cateId=${id}`)
    }
    const [isPopupUpdate, setIsPopupUpdate] = useState(false)
    const [isPopupDelete, setIsPopupDelete] = useState(false)
    const [categoryData, setCategoryData] = useState(null);

    const handleEditClick = async () => {
        try {
            const data = await getOneDrinkCate(id);
            setCategoryData(data);
            setIsPopupUpdate(true);
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    }
    return (
        <div className="flex flex-col px-4 pt-4 pb-7 mx-auto w-full rounded-xl bg-zinc-300 bg-opacity-50 max-md:mt-10">
            <div className="flex gap-5 justify-between w-full">
                <div className="flex gap-3 self-start text-black items-center">
                    <span className=' text-lg font-bold'>Loại:</span>
                    <span className="text-lg">{type}</span>
                </div>

                <div className="flex gap-2.5">
                    <button onClick={() => handleEditClick()}>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8cbc0617bbf4cea08e0f760c9ed54871eff30c88a2b82e5a58df10ceab29920?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 w-[20px] aspect-square" alt="" />
                    </button>
                    {isPopupUpdate && (
                        <UpdDrinkCategoryForm setLoading={setLoading} data={categoryData.data.data} onClose={() => setIsPopupUpdate(false)} />
                    )}
                    <button onClick={() => setIsPopupDelete(true)}>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d3fb9fd18a0fb1e7d875875fa44b2cbdcbad34296a336f1231fc65df95315a1?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 w-[20px] aspect-square" alt="" />
                    </button>
                    {isPopupDelete && (
                        <PopupConfirmDelete refreshList={refreshList} setLoading={setLoading} onClose={() => setIsPopupDelete(false)} id={id} confirmDelete={true} />
                    )}
                </div>
            </div>
            <div className='mt-2'>
                <button onClick={listDrinkBasedCateHandle}>Xem chi tiết</button>
            </div>
            <div className="flex gap-3 mt-3 w-full text-base text-black">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 self-start mt-1 w-6 aspect-square" alt="" />
                <p className="flex-auto gap-6 self-stretch min-h-[99px] w-[293px]">{description}</p>
            </div>
        </div>
    )
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

    return (
        <main className={`relative flex overflow-hidden flex-col ${loading ? 'opacity-50' : ''}`}>
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
                    <CircularProgress />
                    <p className="text-xl font-semibold ml-4">Đang xử lý...</p>
                </div>
            )}
            <header className="flex z-10 flex-wrap gap-5 justify-between items-start w-full text-black max-md:max-w-full">
                <h1 className="text-3xl font-bold">Danh mục thức uống</h1>
                <button
                    onClick={() => setIsPopupCreate(true)}
                    className="flex gap-2.5 px-2.5 py-2 text-xl bg-white rounded-md border border-black border-solid shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-gray-100 hover:border-gray-500 hover:shadow-lg transition-all duration-200">
                    Thêm danh mục
                </button>
            </header>

            <section className="mt-11 w-full max-md:mt-10 max-md:max-w-full">
                {noData ? (
                    <p className="text-center text-xl font-semibold text-red-400">Không có Loại thức uống nào cả</p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 max-md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {drinkCateList.map((category, index) => (
                            <CategoryCard
                                refreshList={fetchdataDrCate}
                                setLoading={setLoading}
                                key={index}
                                id={category.drinksCategoryId}
                                type={category.drinksCategoryName}
                                description={category.description}
                            />
                        ))}
                    </div>
                )}
            </section>

            {isPopupCreate && (
                <AddDrinkCategoryForm onClose={() => setIsPopupCreate(false)} setLoading={setLoading} refreshList={fetchdataDrCate} />
            )}
        </main>
    );
};

export default DrinkCategories;