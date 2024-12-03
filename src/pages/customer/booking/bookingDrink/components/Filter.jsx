import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Filter = ({
    dataDrinkCate = [],
    dataDrinkEmo = [],
    dataDrinkPrice = [],
    onApplyFilters
}) => {
    const [selectedDrinks, setSelectedDrinks] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [isDrinksModalOpen, setIsDrinksModalOpen] = useState(false);
    const [isEmotionsModalOpen, setIsEmotionsModalOpen] = useState(false);
    const [isCategoryDetailOpen, setIsCategoryDetailOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (Array.isArray(dataDrinkPrice) && dataDrinkPrice.length > 0) {
            const minPrice = Math.min(...dataDrinkPrice);
            const maxPrice = Math.max(...dataDrinkPrice);
            setPriceRange([minPrice, maxPrice]);
        } else {
            console.warn("dataDrinkPrice is not an array or is empty:", dataDrinkPrice);
            setPriceRange([0, 100000000]); // Default range if data is invalid
        }
    }, [dataDrinkPrice]);

    const handleDrinkChange = (drinkId) => {
        setSelectedDrinks(prev => 
            prev.includes(drinkId) ? prev.filter(id => id !== drinkId) : [...prev, drinkId]
        );
    };

    const handleEmotionChange = (emotionId) => {
        setSelectedEmotions(prev => 
            prev.includes(emotionId) ? prev.filter(id => id !== emotionId) : [...prev, emotionId]
        );
    };

    const handleOpenCategoryDetail = (category) => {
        setSelectedCategory(category);
        setIsCategoryDetailOpen(true);
    };

    const handleCloseCategoryDetail = () => {
        setIsCategoryDetailOpen(false);
    };

    const handleApplyFilters = () => {
        onApplyFilters({
            selectedDrinks,
            selectedEmotions,
            priceRange
        });
    };

    // Kiểm tra xem dataDrinkCate có phải là một mảng không
    const safeDrinkCate = Array.isArray(dataDrinkCate) ? dataDrinkCate : [];
    const safeDataDrinkEmo = Array.isArray(dataDrinkEmo) ? dataDrinkEmo : [];
    const safeDrinkPrice = Array.isArray(dataDrinkPrice) ? dataDrinkPrice : [0, 100000000];

    // Đảm bảo không có category trùng lặp
    const uniqueCategories = Array.from(
        new Map(
            dataDrinkCate.map(category => [category.drinksCategoryId, category])
        ).values()
    );

    return (
        <aside className="flex flex-col w-full bg-neutral-800 rounded-lg p-4">
            <h3 className="font-bold text-lg leading-none text-amber-400 mb-3">Bộ lọc</h3>
            <div className="shrink-0 h-px border border-amber-400 border-solid mb-3" />
            
            <div className="bg-neutral-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm leading-none text-amber-400">Thể Loại thức uống</h4>
                    <button onClick={() => setIsDrinksModalOpen(true)} className="text-amber-400 text-xs hover:text-amber-500">
                        Xem tất cả
                    </button>
                </div>
                {uniqueCategories.slice(0, 5).map((cate) => (
                    <div key={cate.drinksCategoryId} className="flex items-center justify-between py-1">
                        <label className="flex items-center gap-2 text-sm text-white">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-amber-400"
                                checked={selectedDrinks.includes(cate.drinksCategoryId)}
                                onChange={() => handleDrinkChange(cate.drinksCategoryId)}
                            />
                            <span className="truncate">{cate.drinksCategoryName}</span>
                        </label>
                        <button 
                            onClick={() => handleOpenCategoryDetail(cate)} 
                            className="text-amber-400 text-xs hover:text-amber-500"
                        >
                            Chi tiết
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="bg-neutral-700 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm leading-none text-amber-400">Cảm xúc</h4>
                    <button onClick={() => setIsEmotionsModalOpen(true)} className="text-amber-400 text-xs hover:text-amber-500">
                        Xem tất cả
                    </button>
                </div>
                {safeDataDrinkEmo.slice(0, 5).map((emotion) => (
                    <div key={emotion.emotionalDrinksCategoryId} className="flex items-center py-1">
                        <label className="flex items-center gap-2 text-sm text-white">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-amber-400"
                                checked={selectedEmotions.includes(emotion.emotionalDrinksCategoryId)}
                                onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId)}
                            />
                            <span className="truncate">{emotion.categoryName}</span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-700 rounded-lg p-3 mb-3">
                <h4 className="text-sm leading-none text-amber-400 mb-2">Mức giá</h4>
                <input
                    type="range"
                    min={Math.min(...safeDrinkPrice)}
                    max={Math.max(...safeDrinkPrice)}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                />
                <div className="flex justify-between mt-2 text-white text-xs">
                    <span>{priceRange[0].toLocaleString()} VND</span>
                    <span>{priceRange[1].toLocaleString()} VND</span>
                </div>
            </div>

            <Button 
                onClick={handleApplyFilters} 
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: 'rgb(245, 158, 11)',
                    color: 'black',
                    fontWeight: 'medium',
                    '&:hover': {
                        backgroundColor: 'rgb(251, 191, 36)',
                    },
                    '&:active': {
                        backgroundColor: 'rgb(217, 119, 6)',
                    },
                    textTransform: 'none',
                }}
            >
                Áp dụng bộ lọc
            </Button>

            {/* Modals */}
            <Dialog open={isDrinksModalOpen} onClose={() => setIsDrinksModalOpen(false)} PaperProps={{
                style: { backgroundColor: '#333', color: 'white' },
            }}>
                <DialogTitle style={{ color: '#FFA500' }}>Thể Loại thức uống</DialogTitle>
                <DialogContent>
                    {uniqueCategories.map((cate) => (
                        <div key={cate.drinksCategoryId} className="flex items-center justify-between mb-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-amber-400"
                                    checked={selectedDrinks.includes(cate.drinksCategoryId)}
                                    onChange={() => handleDrinkChange(cate.drinksCategoryId)}
                                />
                                <span className="ml-2 text-white">{cate.drinksCategoryName}</span>
                            </label>
                            <button 
                                onClick={() => handleOpenCategoryDetail(cate)}
                                className="text-amber-400 text-xs hover:text-amber-500"
                            >
                                Chi tiết
                            </button>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDrinksModalOpen(false)} style={{ color: '#FFA500' }}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isEmotionsModalOpen} onClose={() => setIsEmotionsModalOpen(false)} PaperProps={{
                style: { backgroundColor: '#333', color: 'white' },
            }}>
                <DialogTitle style={{ color: '#FFA500' }}>Cảm xúc</DialogTitle>
                <DialogContent>
                    {safeDataDrinkEmo.map((emotion) => (
                        <label key={emotion.emotionalDrinksCategoryId} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-amber-400"
                                checked={selectedEmotions.includes(emotion.emotionalDrinksCategoryId)}
                                onChange={() => handleEmotionChange(emotion.emotionalDrinksCategoryId)}
                            />
                            <span className="ml-2 text-white">{emotion.categoryName}</span>
                        </label>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEmotionsModalOpen(false)} style={{ color: '#FFA500' }}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCategoryDetailOpen} onClose={handleCloseCategoryDetail} PaperProps={{
                style: { backgroundColor: '#333', color: 'white' },
            }}>
                <DialogTitle style={{ color: '#FFA500' }}>{selectedCategory?.drinksCategoryName}</DialogTitle>
                <DialogContent>
                    <p>{selectedCategory?.description}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCategoryDetail} style={{ color: '#FFA500' }}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </aside>
    );
};

export default Filter;
