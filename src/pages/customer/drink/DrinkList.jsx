import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { Range, getTrackBackground } from 'react-range';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllDrinkByBarId } from 'src/lib/service/managerDrinksService';

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
    useEffect(() => {
        if (isDrinksModalOpen) {
            setTempSelectedDrink(selectedDrink);
        }
        if (isEmotionsModalOpen) {
            setTempSelectedEmotions([...selectedEmotions]); // Copy the main screen emotions into the modal
        }
    }, [isDrinksModalOpen, isEmotionsModalOpen, selectedDrink, selectedEmotions]);

    const handleDrinkChange = (key) => {
        setTempSelectedDrink(key);
    };

    const handleEmotionChange = (key, isModal = false) => {
        if (isModal) {
            if (tempSelectedEmotions.includes(key)) {
                setTempSelectedEmotions(tempSelectedEmotions.filter((emotion) => emotion !== key));
            } else {
                setTempSelectedEmotions([...tempSelectedEmotions, key]);
            }
        } else {
            if (selectedEmotions.includes(key)) {
                setSelectedEmotions(selectedEmotions.filter((emotion) => emotion !== key));
            } else {
                setSelectedEmotions([...selectedEmotions, key]);
            }
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

    return (
        <aside className="flex flex-col w-[20%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col px-6 py-4 mx-auto w-full rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] max-md:px-4 max-md:mt-8">
                <div className='flex text-center'><h3 className="self-start font-bold mt-4 text-xl leading-none text-amber-400 center-text">Bộ lọc</h3></div>
                <div className="shrink-0 mt-3 h-px border border-amber-400 border-solid max-md:max-w-full" />
                <h3 className="self-start mt-4 text-base leading-none text-amber-400">Danh mục thức uống</h3>
                <div className="flex flex-col justify-center pl-4 pr-1 py-2 mt-4 pr-4 text-sm leading-none text-white rounded-xl bg-neutral-700 max-md:mr-0.5">
                    {dataDrinkCate.map((cate) => (
                        <Fragment key={cate.drinksCategoryId}>
                            <div className='flex justify-between text-center items-center mt-1 mb-2'>
                                <label className="flex items-center gap-2 mb-1 text-sm text-center">
                                    <input
                                        type="radio"
                                        name="drink-category"
                                        className="form-radio h-5 w-5"
                                        checked={selectedDrink === cate.drinksCategoryName}
                                        onChange={() => setSelectedDrink(cate.drinksCategoryName)}
                                    />
                                    <span>{cate.drinksCategoryName}</span>
                                </label>
                                <button onClick={() => {
                                    setSelectedCateId(cate.drinksCategoryId);
                                    setCateModalOpen(true);
                                }}>
                                    <span className='text-amber-400 hover:text-amber-500'>Xem chi tiết</span>
                                </button>
                            </div>
                        </Fragment>
                    ))}
                </div>

                {isCateModalOpen && selectedCateId && (
                    <Modal
                        title={dataDrinkCate.find(cate => cate.drinksCategoryId === selectedCateId)?.drinksCategoryName || 'Không có tên'}
                        onClose={() => setCateModalOpen(false)} onConfirm={handleConfirmCate}
                    >
                        {dataDrinkCate.find(cate => cate.drinksCategoryId === selectedCateId)?.description || 'Không có mô tả.'}
                    </Modal>
                )}
                <div className='flex justify-evenly'>
                    <button onClick={() => setDrinksModalOpen(true)} className="mt-2 text-amber-400 text-sm hover:text-amber-500">
                        Xem tất cả
                    </button>
                    {selectedDrink &&
                        <button onClick={() => setSelectedDrink(null)} className="mt-2 text-red-400 text-sm hover:text-red-500">
                            Xóa chọn
                        </button>}
                </div>
                {/* Emotions section */}
                <h3 className="self-start mt-4 text-base leading-none text-amber-400">Cảm xúc</h3>
                <div
                    className={`overflow-y-auto flex flex-col justify-center pl-4 pr-1 py-2 mt-4 text-sm leading-none text-white rounded-xl bg-neutral-700 max-md:mr-0.5 ${dataDrinkEmo.length > 5 ? 'max-h-20' : ''
                        }`}
                    style={{ maxHeight: '160px', paddingTop: '2.5rem', paddingBottom: '0.5rem' }}
                >
                    {dataDrinkEmo.map((emotion, index) => (
                        <label
                            key={emotion.emotionalDrinksCategoryId}
                            className={`flex items-center gap-2 mb-2 text-sm ${index === 0 ? 'mt-2' : ''} ${index === dataDrinkEmo.length - 1 ? 'mb-2' : ''}`}
                        >
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={selectedEmotions.includes(emotion.emotionalDrinksCategoryId)}
                                onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId)}
                            />
                            <span>{emotion.categoryName}</span>
                        </label>
                    ))}

                </div>


                <div className='flex justify-evenly'>
                    <button onClick={() => setEmotionsModalOpen(true)} className="mt-2 text-amber-400 text-sm hover:text-amber-500">
                        Xem tất cả
                    </button>
                    {selectedEmotions.length > 0 &&
                    <button onClick={() => setSelectedEmotions([])} className="mt-2 text-red-400 text-sm hover:text-red-500">
                        Xóa chọn
                    </button>
                    }
                </div>
                <PriceFilter dataDrinkPrice={dataDrinkPrice} onPriceChange={setPriceRange} />

                <div className="flex flex-col justify-center pr-1 py-2 mt-5 text-sm leading-none text-white rounded-xl bg-neutral-700 max-md:mr-0.5 group hover:bg-amber-400">
                    <button onClick={onApplyFilters} className="text-amber-400 text-base group-hover:text-white">
                        Xác nhận
                    </button>
                </div>
            </div>

            {/* Drink Modal */}
            {isDrinksModalOpen && (
                <Modal title="Danh mục thức uống" onClose={() => setDrinksModalOpen(false)} onConfirm={handleConfirmDrinks}>
                    {dataDrinkCate.map((drink) => (
                        <label key={drink} className="flex items-center gap-2 mt-2 text-sm">
                            <input
                                type="radio"
                                name="drink-category"
                                className="form-radio h-5 w-5"
                                checked={tempSelectedDrink === drink} // Bind to modal temp state
                                onChange={() => handleDrinkChange(drink)} // Update modal temp state
                            />
                            <span>{drink}</span>
                        </label>
                    ))}
                </Modal>
            )}

            {/* Emotions Modal */}
            {isEmotionsModalOpen && (
                <Modal title="Cảm xúc" onClose={() => setEmotionsModalOpen(false)} onConfirm={handleConfirmEmotions}>
                    {dataDrinkEmo.map((emotion) => (
                        <label key={emotion.emotionalDrinksCategoryId} className="flex items-center gap-2 mt-2 text-sm">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={tempSelectedEmotions.includes(emotion.emotionalDrinksCategoryId)} // Bind to modal temp state
                                onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId, true)} // Update modal temp state
                            />
                            <span>{emotion.categoryName}</span>
                        </label>
                    ))}
                </Modal>
            )}
        </aside>
    );
};

const Modal = ({ title, children, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-neutral-800 text-white w-11/12 max-w-sm p-5 rounded-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-300 hover:text-white"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-2xl mb-4 text-center text-amber-500">{title}</h3>
                <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-700">
                    {children}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-amber-400 hover:bg-amber-500 text-white py-2 px-4 rounded"
                        onClick={onConfirm}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

const DrinkCard = ({ images, drinkName, price, withDivider, drinkId}) => {

    const redirect = useNavigate();
    const drinkDetailHandle = () => {
        redirect(`/drinkDetail?drinkId=${drinkId}`)
    }
    return (
        <div className="flex flex-col w-full">
            <div
                className={`rounded-md flex flex-col grow items-center px-2 py-2 w-full text-center bg-neutral-700 ${withDivider ? 'max-md:mt-5' : ''
                    }`}
            >
                <div className="w-full aspect-[0.84]">
                    <img
                        loading="lazy"
                        src={images}
                        className="object-cover w-full h-full rounded-md"
                    />
                </div>
                <button onClick={drinkDetailHandle}>
                    <h3 className="mt-1 text-base leading-5 text-zinc-100 truncate">{drinkName}</h3>
                </button>
                <p className="mt-1 text-sm leading-tight text-amber-400">Giá: {price} VND</p>
            </div>
            {withDivider && <div className="flex shrink-0 mt-5 h-2.5 rounded-sm bg-neutral-700" />}
        </div>
    );
}
const PriceFilter = ({ dataDrinkPrice, onPriceChange }) => {
    const STEP = 1;
    const MIN = dataDrinkPrice.length > 0 ? Math.min(...dataDrinkPrice) : 0;
    const MAX = dataDrinkPrice.length > 0 ? Math.max(...dataDrinkPrice) : 100000000;
    const [values, setValues] = useState([MIN, MAX]);

    useEffect(() => {
        if (dataDrinkPrice.length > 0) {
            const newMin = Math.min(...dataDrinkPrice);
            const newMax = Math.max(...dataDrinkPrice);
            setValues([newMin, newMax]);
        }
    }, [dataDrinkPrice]);

    // Update the parent with the new price range
    const handleRangeChange = (newValues) => {
        setValues(newValues);
        onPriceChange(newValues); // Pass the new range back to the parent
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
                <h4 className="mt-2 text-amber-400 text-sm text-center">Đơn vị tính theo VND</h4>
            </div>
        </Fragment>
    );
};

const backToBarInfo = (barId) => {
    const redirect = useNavigate();
    redirect(`/barInfo?barId=${barId}`);
}

const BackButton = ({ barId }) => (
    <button onClick={() => backToBarInfo(barId)} className="flex gap-2.5 self-start mt-2.5 text-xl text-gray-200 flex text-center centers-text">
        <img
            loading="lazy"
            src="https://img.icons8.com/?size=100&id=40217&format=png&color=FFFFFF"
            alt=""
            className="object-contain shrink-0 my-auto w-5 aspect-square"
        />
        <span>Quay lại</span>
    </button>
);


const DrinkList = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //const barId = searchParams.get('barId');

    const [dataDrinksOfBar, setDataDrinkOfBar] = useState([]);
    const [dataDrinkCate, setDataDrinkCate] = useState([]);
    const [dataDrinkEmo, setDataDrinkEmo] = useState([]);
    const [dataDrinkPrice, setDataDrinkPrice] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);

    const [selectedDrink, setSelectedDrink] = useState(null);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000000]);

    const barId = 'd44b3052-e903-4eab-bfa6-62662381dbc2';

    useEffect(() => {
        const fetchDataDrinkOfBar = async () => {
            try {
                const response = await getAllDrinkByBarId(barId);
                const dataDrinksOfBar = response.data.data;

                const allEmotionDrink = dataDrinksOfBar.flatMap(drink => drink.emotionsDrink);
                const uniqueEmo = Array.from(new Set(allEmotionDrink.map(emotion => emotion.emotionalDrinksCategoryId)))
                    .map(id => allEmotionDrink.find(emotion => emotion.emotionalDrinksCategoryId === id));

                const allCateDrink = dataDrinksOfBar.flatMap(drink => drink.drinkCategoryResponse);
                const uniqueCate = Array.from(new Set(allCateDrink.map(cate => cate.drinksCategoryId)))
                    .map(id => allCateDrink.find(cate => cate.drinksCategoryId === id));

                const allPriceDrink = dataDrinksOfBar.flatMap(drink => Number(drink.price));
                const uniquePrice = Array.from(new Set(allPriceDrink));

                setDataDrinkOfBar(dataDrinksOfBar);
                setDataDrinkEmo(uniqueEmo);
                setDataDrinkCate(uniqueCate);
                setDataDrinkPrice(uniquePrice);
                setFilteredDrinks(dataDrinksOfBar);
            } catch {
                console.error();
            }
        };
        fetchDataDrinkOfBar();
    }, [barId]);

    const applyFilters = () => {
        let filtered = dataDrinksOfBar;
        console.log("dasd",filtered)
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

    return (
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
                    <main className="flex flex-col w-[60%] max-md:w-full ">
                        <section className="flex flex-col px-6 pt-4 mx-auto w-full bg-neutral-800 max-md:px-4 max-md:mt-8 max-md:max-w-full rounded-md">

                            <div className="flex flex-wrap gap-4 justify-between max-w-full leading-snug w-[646px] text-center items-center">
                                <BackButton barId={barId} />
                                <h2 className="text-xl text-center ceter-text text-amber-400 font-bold">Danh sách đồ uống</h2>
                            </div>
                            <div className="shrink-0 mt-3 h-px border border-amber-400 border-solid max-md:max-w-full" />
                            <div className="mt-5 max-md:max-w-full">
                                <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
                                    {filteredDrinks.length > 0 ? (
                                        filteredDrinks.map((drink, index) => (
                                            <DrinkCard key={index} {...drink} barId={barId} />
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
    );
};

export default DrinkList;