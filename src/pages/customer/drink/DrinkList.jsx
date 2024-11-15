import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Range, getTrackBackground } from 'react-range';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllDrink } from 'src/lib/service/managerDrinksService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Thêm import này

const FilterSection = ({
    dataDrinkCate,
    dataDrinkEmo,
    dataDrinkPrice,
    selectedDrink,
    setSelectedDrink,
    selectedEmotions,
    setSelectedEmotions,
    priceRange,
    setPriceRange,
    onApplyFilters,
}) => {
    const [isDrinksModalOpen, setDrinksModalOpen] = useState(false);
    const [isEmotionsModalOpen, setEmotionsModalOpen] = useState(false);
    const [isCateModalOpen, setCateModalOpen] = useState(false);
    const [tempSelectedDrink, setTempSelectedDrink] = useState(selectedDrink);
    const [tempSelectedEmotions, setTempSelectedEmotions] = useState([...selectedEmotions]);
    const [selectedCateId, setSelectedCateId] = useState(null);
    const [isEmotionDetailModalOpen, setEmotionDetailModalOpen] = useState(false);
    const [selectedEmotionDetail, setSelectedEmotionDetail] = useState(null);

    useEffect(() => {
        if (isDrinksModalOpen) {
            setTempSelectedDrink(selectedDrink);
        }
        if (isEmotionsModalOpen) {
            setTempSelectedEmotions([...selectedEmotions]);
        }
    }, [isDrinksModalOpen, isEmotionsModalOpen, selectedDrink, selectedEmotions]);

    const handleDrinkChange = (key) => {
        setTempSelectedDrink(key);
    };

    const handleEmotionChange = (key, isModal = false) => {
        if (isModal) {
            setTempSelectedEmotions(prev =>
                prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]
            );
        } else {
            setSelectedEmotions(prev =>
                prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]
            );
        }
    };

    const handleConfirmEmotions = () => {
        setSelectedEmotions(tempSelectedEmotions);
        setEmotionsModalOpen(false);
    };

    const handleConfirmDrinks = () => {
        setSelectedDrink(tempSelectedDrink);
        setDrinksModalOpen(false);
    };

    const handleConfirmCate = () => {
        setCateModalOpen(false);
    }

    const handleClearDrinkSelection = () => {
        setSelectedDrink(null);
    };

    const handleClearEmotionsSelection = () => {
        setSelectedEmotions([]);
    };

    return (
        <aside className="flex flex-col w-[20%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col px-6 py-4 mx-auto w-full rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] max-md:px-4 max-md:mt-8 h-[calc(100vh-100px)]">
                <div className='flex text-center sticky top-0 bg-neutral-800 z-10 pb-3'>
                    <h3 className="self-start font-bold mt-4 text-xl leading-none text-amber-400 center-text">Bộ lọc</h3>
                </div>
                <div className="shrink-0 mt-3 h-px border border-amber-400 border-solid max-md:max-w-full sticky top-12 bg-neutral-800 z-10" />
                <div className="overflow-y-auto flex-grow custom-scrollbar" style={{ maxHeight: 'calc(100% - 60px)' }}>
                    <div className="flex justify-between items-center mt-4">
                        <h3 className="text-base leading-none text-amber-400">Danh mục thức uống</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setDrinksModalOpen(true)} className="text-amber-400 text-xs hover:text-amber-500">
                                Xem tất cả
                            </button>
                            {selectedDrink && (
                                <button onClick={handleClearDrinkSelection} className="text-red-400 text-xs hover:text-red-500">
                                    Xóa chọn
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center pl-4 pr-1 py-2 mt-4 text-sm leading-none text-white rounded-xl bg-neutral-700 max-md:mr-0.5">
                        {dataDrinkCate.map((cate) => (
                            <Fragment key={cate.drinksCategoryId}>
                                <div className='flex justify-between text-center items-center mt-1 mb-2'>
                                    <label className="flex items-center gap-2 mb-1 text-sm text-center">
                                        <input
                                            type="radio"
                                            name="drink-category"
                                            className="form-radio h-4 w-4"
                                            checked={selectedDrink === cate.drinksCategoryName}
                                            onChange={() => setSelectedDrink(cate.drinksCategoryName)}
                                        />
                                        <span className="truncate">{cate.drinksCategoryName}</span>
                                    </label>
                                    <button onClick={() => {
                                        setSelectedCateId(cate.drinksCategoryId);
                                        setCateModalOpen(true);
                                    }}>
                                        <span className='text-amber-400 hover:text-amber-500 text-xs'>Chi tiết</span>
                                    </button>
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <h3 className="text-base leading-none text-amber-400">Cảm xúc</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setEmotionsModalOpen(true)} className="text-amber-400 text-xs hover:text-amber-500">
                                Xem tất cả
                            </button>
                            {selectedEmotions.length > 0 && (
                                <button onClick={handleClearEmotionsSelection} className="text-red-400 text-xs hover:text-red-500">
                                    Xóa chọn
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center pl-4 pr-1 py-2 mt-4 text-sm leading-none text-white rounded-xl bg-neutral-700 max-md:mr-0.5 max-h-40 overflow-y-auto custom-scrollbar">
                        {dataDrinkEmo.map((emotion) => (
                            <div key={emotion.emotionalDrinksCategoryId} className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4"
                                        checked={selectedEmotions.includes(emotion.emotionalDrinksCategoryId)}
                                        onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId)}
                                    />
                                    <span className="truncate">{emotion.categoryName}</span>
                                </label>
                                <button
                                    onClick={() => {
                                        setSelectedEmotionDetail(emotion);
                                        setEmotionDetailModalOpen(true);
                                    }}
                                    className="text-amber-400 hover:text-amber-500 text-xs"
                                >
                                    Chi tiết
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <PriceFilter dataDrinkPrice={dataDrinkPrice} onPriceChange={setPriceRange} />

                    <div className="flex justify-center mt-5">
                        <button
                            onClick={onApplyFilters}
                            className="px-4 py-2 bg-amber-400 text-white rounded-xl hover:bg-amber-500 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>

            {isDrinksModalOpen && (
                <Modal title="Danh mục thức uống" onClose={() => setDrinksModalOpen(false)} onConfirm={handleConfirmDrinks}>
                    {dataDrinkCate?.map((drink) => (
                        <label key={drink?.drinksCategoryId} className="flex items-center gap-2 mt-2 text-sm">
                            <input
                                type="radio"
                                name="drink-category"
                                className="form-radio h-5 w-5"
                                checked={tempSelectedDrink === drink?.drinksCategoryName}
                                onChange={() => handleDrinkChange(drink?.drinksCategoryName)}
                            />
                            <span>{drink?.drinksCategoryName}</span>
                        </label>
                    ))}
                </Modal>
            )}

            {isEmotionsModalOpen && (
                <Modal title="Cảm xúc" onClose={() => setEmotionsModalOpen(false)} onConfirm={handleConfirmEmotions}>
                    {dataDrinkEmo.map((emotion) => (
                        <label key={emotion.emotionalDrinksCategoryId} className="flex items-center gap-2 mt-2 text-sm">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={tempSelectedEmotions.includes(emotion.emotionalDrinksCategoryId)}
                                onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId, true)}
                            />
                            <span>{emotion.categoryName}</span>
                        </label>
                    ))}
                </Modal>
            )}

            {isCateModalOpen && selectedCateId && (
                <Modal
                    title={dataDrinkCate.find(cate => cate.drinksCategoryId === selectedCateId)?.drinksCategoryName || 'Không có tên'}
                    onClose={() => setCateModalOpen(false)}
                    onConfirm={handleConfirmCate}
                >
                    {dataDrinkCate.find(cate => cate.drinksCategoryId === selectedCateId)?.description || 'Không có mô tả.'}
                </Modal>
            )}

            {isEmotionDetailModalOpen && selectedEmotionDetail && (
                <Modal
                    title={selectedEmotionDetail.categoryName}
                    onClose={() => setEmotionDetailModalOpen(false)}
                    onConfirm={() => setEmotionDetailModalOpen(false)}
                >
                    {selectedEmotionDetail.description || 'Không có mô tả.'}
                </Modal>
            )}
        </aside>
    );
};

const Modal = ({ title, children, onClose, onConfirm }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300); // Đợi animation kết thúc rồi mới đóng
    };

    const handleConfirm = () => {
        setIsOpen(false);
        setTimeout(onConfirm, 300);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div
                className="fixed inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: isOpen ? 0.5 : 0 }}
                onClick={handleClose}
            />
            <div
                className={`bg-neutral-800 text-white w-11/12 max-w-sm p-5 rounded-lg relative transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                <button
                    className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={handleClose}
                >
                    &times;
                </button>
                <h3 className="text-2xl mb-4 text-center text-amber-500">{title}</h3>
                <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-700">
                    {children}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded transition-colors duration-200"
                        onClick={handleConfirm}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

const DrinkCard = ({ images, drinkName, price, withDivider, drinkId }) => {
    const redirect = useNavigate();
    const drinkDetailHandle = () => {
        redirect(`/drink-detail?drinkId=${drinkId}`)
    }

    // Format price to Vietnamese currency
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);

    return (
        <div className="flex flex-col w-full">
            <div
                className={`rounded-md flex flex-col grow items-center px-2 py-2 w-full text-center bg-neutral-700 hover:bg-neutral-600 transition-colors cursor-pointer ${withDivider ? 'max-md:mt-5' : ''
                    }`}
                onClick={drinkDetailHandle}
            >
                <div className="w-full aspect-[1/1]">
                    <img
                        loading="lazy"
                        src={images}
                        className="object-cover w-full h-full rounded-md"
                        alt={drinkName}
                    />
                </div>
                <div className="w-full px-1 mt-2">
                    <h3 className="text-sm font-medium leading-5 text-zinc-100 truncate hover:text-amber-400">
                        {drinkName}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-tight text-amber-400">
                        {formattedPrice}
                    </p>
                </div>
            </div>
            {withDivider && <div className="flex shrink-0 mt-5 h-2.5 rounded-sm bg-neutral-700" />}
        </div>
    );
}

const PriceFilter = ({ dataDrinkPrice, onPriceChange }) => {
    const STEP = 1;
    const MIN = 0;
    const MAX = dataDrinkPrice.length > 0 ? Math.max(...dataDrinkPrice) : 100000000;
    console.log("min price", MIN)
    console.log("Max price", MAX)
    const [values, setValues] = useState([MIN, MAX]);

    useEffect(() => {
        if (dataDrinkPrice.length > 0) {
            const newMin = MIN;
            const newMax = Math.max(...dataDrinkPrice);
            setValues([newMin, newMax]);
        }
    }, [dataDrinkPrice]);

    const handleRangeChange = (newValues) => {
        setValues(newValues);
        onPriceChange(newValues);
    };

    return (
        <Fragment>
            <h2 className="self-start text-base mt-5 text-amber-400">Giá</h2>
            <div className="w-full p-5 bg-neutral-700 rounded-xl mt-5 shadow-md">
                <div className="flex justify-between items-center mt-4">
                    <input
                        type="text"
                        readOnly
                        className="w-20 text-center text-[11px] font-semibold border border-gray-400 rounded p-2 bg-neutral-800 text-gray-200"
                        value={values[0].toLocaleString()}
                    />
                    <span className="mx-2 text-lg font-semibold text-gray-300">—</span>
                    <input
                        type="text"
                        readOnly
                        className="w-20 text-center text-[11px] font-semibold border border-gray-400 rounded p-2 bg-neutral-800 text-gray-200"
                        value={values[1].toLocaleString()}
                    />
                </div>

                <Range
                    values={values}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={handleRangeChange}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="w-full h-2 rounded mt-4"
                            style={{
                                background: getTrackBackground({
                                    values,
                                    colors: ["#ccc", "#4CAF50", "#ccc"],
                                    min: MIN,
                                    max: MAX
                                })
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            className="h-5 w-5 bg-green-500 rounded-full flex justify-center items-center focus:outline-none"
                        />
                    )}
                />
                <h4 className="mt-2 text-amber-400 text-xs text-center">Đơn vị tính theo VND</h4>
            </div>
        </Fragment>
    );
};

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const barId = location.state?.barId;

    const handleBack = () => {
        if (barId) {
            navigate(`/bar-detail/${barId}`);
        } else {
            navigate('/home');
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 self-start mt-2.5 text-xl text-gray-200 hover:text-amber-400 transition-colors duration-300"
        >
            <ChevronLeftIcon />
            <span>Quay lại</span>
        </button>
    );
};

const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #18191a;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

/* Cho Firefox */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #888 #18191a;
}
`;

const StyleTag = () => (
    <style>{styles}</style>
);

const DrinkList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ state của navigation
    const drinksOfBar = location.state?.drinksOfBar || [];
    const barName = location.state?.barName || ''; // Lấy barName từ state

    const [dataDrinksOfBar, setDataDrinkOfBar] = useState([]);
    const [dataDrinkCate, setDataDrinkCate] = useState([]);
    const [dataDrinkEmo, setDataDrinkEmo] = useState([]);
    const [dataDrinkPrice, setDataDrinkPrice] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);

    const [selectedDrink, setSelectedDrink] = useState(null);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchDataDrinkOfBar = async () => {
            try {
                const allEmotionDrink = drinksOfBar.flatMap(drink => drink.emotionsDrink);
                const uniqueEmo = Array.from(new Set(allEmotionDrink.map(emotion => emotion.emotionalDrinksCategoryId)))
                    .map(id => allEmotionDrink.find(emotion => emotion.emotionalDrinksCategoryId === id));

                const allCateDrink = drinksOfBar.flatMap(drink => drink.drinkCategoryResponse);
                const uniqueCate = Array.from(new Set(allCateDrink.map(cate => cate.drinksCategoryId)))
                    .map(id => allCateDrink.find(cate => cate.drinksCategoryId === id));

                const allPriceDrink = drinksOfBar.flatMap(drink => Number(drink.price));
                const uniquePrice = Array.from(new Set(allPriceDrink));

                setDataDrinkOfBar(drinksOfBar);
                setDataDrinkEmo(uniqueEmo);
                setDataDrinkCate(uniqueCate);
                setDataDrinkPrice(uniquePrice);
                setFilteredDrinks(drinksOfBar);
            } catch (error) {
                console.error('Error processing drink data:', error);
            }
        };

        if (drinksOfBar.length > 0) {
            fetchDataDrinkOfBar();
        }
    }, [drinksOfBar]); // Dependency array cập nhật

    const applyFilters = () => {
        let filtered = dataDrinksOfBar;
        console.log("dasd", filtered)
        if (selectedDrink) {
            filtered = filtered.filter(drink => drink?.drinkCategoryResponse?.drinksCategoryName === selectedDrink);
        }

        if (selectedEmotions.length > 0) {
            filtered = filtered.filter(drink =>
                selectedEmotions.some(emotionKey =>
                    drink.emotionsDrink.some(emotion => emotion.emotionalDrinksCategoryId === emotionKey)
                )
            );
        }

        filtered = filtered.filter(drink => {
            const price = Number(drink.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        setFilteredDrinks(filtered);
    };

    const handleSearch = () => {
        let filtered = dataDrinksOfBar;
        if (searchTerm.trim()) {
            filtered = filtered.filter(drink =>
                drink.drinkName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredDrinks(filtered);
    };

    return (
        <>
            <StyleTag />
            <div className="flex flex-col items-center">
                <div className="overflow-hidden w-full max-md:max-w-full">
                    <div className="flex gap-5 justify-center max-md:flex-col">
                        <FilterSection
                            dataDrinkCate={dataDrinkCate}
                            dataDrinkEmo={dataDrinkEmo}
                            dataDrinkPrice={dataDrinkPrice}
                            selectedDrink={selectedDrink}
                            setSelectedDrink={setSelectedDrink}
                            selectedEmotions={selectedEmotions}
                            setSelectedEmotions={setSelectedEmotions}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            onApplyFilters={applyFilters} // Pass the filter function
                        />
                        <main className="flex flex-col w-[60%] max-md:w-full">
                            <section className="flex flex-col px-6 pt-4 w-full bg-neutral-800 max-md:px-4 max-md:mt-8 max-md:max-w-full rounded-md">
                                <div className="relative flex items-center w-full mb-4">
                                    <div className="absolute left-0">
                                        <BackButton />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <h2 className="text-xl text-amber-400 mt-2.5 font-bold">
                                            {barName ? `Danh sách đồ uống tại ${barName}` : 'Danh sách đồ uống'}
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-2 ">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tên đồ uống..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-amber-400"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                                <div className="shrink-0 mt-3 h-px border border-amber-400 border-solid max-md:max-w-full" />
                                <div className="mt-5 max-md:max-w-full">
                                    <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
                                        {filteredDrinks.length > 0 ? (
                                            filteredDrinks.map((drink, index) => (
                                                <DrinkCard key={index} {...drink} />
                                            ))
                                        ) : (
                                            <div>
                                                <span style={{ color: 'wheat' }}>Không có sản phẩm nào cả</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DrinkList;
