import React, { useState, useEffect } from "react";
import { BookingDrinkInfo, DrinkSelection, DrinkSidebar, Filter } from "src/pages";
import { getAllDrinkByBarId, getDrinkRecommendation } from 'src/lib/service/managerDrinksService';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { Button, Dialog, CircularProgress, DialogContent, Typography, IconButton } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { EmotionRecommendationDialog } from 'src/pages';

const BookingDrink = () => {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [dataDrinkCate, setDataDrinkCate] = useState([]);
  const [dataDrinkEmo, setDataDrinkEmo] = useState([]);
  const [dataDrinkPrice, setDataDrinkPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [recommendedDrinks, setRecommendedDrinks] = useState([]);
  const [emotionText, setEmotionText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('');

  const location = useLocation();
  const { barInfo, selectedTables, customerInfo } = location.state || {};
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await getAllDrinkByBarId(barInfo.id);
        const drinksData = response.data.data || [];
        setDrinks(drinksData.map(drink => ({ ...drink, quantity: 0 })));
        setFilteredDrinks(drinksData.map(drink => ({ ...drink, quantity: 0 })));

        // Sử dụng Set và map để loại bỏ các category trùng lặp
        const uniqueCategories = Array.from(
          new Map(
            drinksData
              .map(drink => drink.drinkCategoryResponse)
              .filter(Boolean)
              .map(category => [category.drinksCategoryId, category])
          ).values()
        );

        const emotions = [...new Set(drinksData.flatMap(drink => drink.emotionsDrink || []))];
        const prices = drinksData.map(drink => parseFloat(drink.price)).filter(price => !isNaN(price));

        setDataDrinkCate(uniqueCategories);
        setDataDrinkEmo(emotions);
        setDataDrinkPrice(prices);
      } catch (error) {
        console.error("Error fetching drinks:", error);
      }
    };
    fetchDrinks();
  }, []);

  const handleIncrease = (drink) => {
    setDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drink.drinkId ? { ...d, quantity: (d.quantity || 0) + 1 } : d
      )
    );
    setFilteredDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drink.drinkId ? { ...d, quantity: (d.quantity || 0) + 1 } : d
      )
    );
  };

  const handleDecrease = (drink) => {
    setDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drink.drinkId && d.quantity > 0 ? { ...d, quantity: d.quantity - 1 } : d
      )
    );
    setFilteredDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drink.drinkId && d.quantity > 0 ? { ...d, quantity: d.quantity - 1 } : d
      )
    );
  };

  const handleRemove = (drinkId) => {
    setDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drinkId ? { ...d, quantity: 0 } : d
      )
    );
    setFilteredDrinks(prevDrinks =>
      prevDrinks.map(d =>
        d.drinkId === drinkId ? { ...d, quantity: 0 } : d
      )
    );
  };

  const handleFilterChange = (filters) => {
    let filtered = drinks;
    if (filters.selectedDrinks.length > 0) {
      filtered = filtered.filter(drink => 
        drink.drinkCategoryResponse && 
        filters.selectedDrinks.includes(drink.drinkCategoryResponse.drinksCategoryId)
      );
    }
    if (filters.selectedEmotions.length > 0) {
      filtered = filtered.filter(drink =>
        drink.emotionsDrink &&
        filters.selectedEmotions.some(emotionKey =>
          drink.emotionsDrink.some(emotion => emotion.emotionalDrinksCategoryId === emotionKey)
        )
      );
    }
    filtered = filtered.filter(drink => {
      const price = parseFloat(drink.price);
      return !isNaN(price) && price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    setFilteredDrinks(filtered);
    setCurrentEmotion('');
  };

  const handleBackClick = () => {
    navigate("/bookingtable", { state: { fromBookingDrink: true } });
  };

  const handleProceedToPayment = (selectedDrinks) => {
    const totalAmount = selectedDrinks.reduce((total, drink) => total + drink.price * drink.quantity, 0);
    
    navigate("/payment", {
      state: {
        barInfo,
        selectedTables,
        customerInfo,
        selectedDrinks: selectedDrinks.map(drink => ({
          ...drink,
          image: drink.images
        })),
        totalAmount,
        discount: barInfo.discount
      }
    });
  };

  const handleCancelBooking = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };

  const handleGetRecommendation = async () => {
    if (!emotionText.trim()) {
      setErrorMessage('Vui lòng nhập cảm xúc của bạn');
      return;
    }

    setIsLoadingRecommendation(true);
    setErrorMessage('');
    try {
      const response = (await getDrinkRecommendation(emotionText, barInfo.id)).data;
      if (response.data) {
        setFilteredDrinks(response.data.drinkList.map(drink => ({ ...drink, quantity: 0 })));
        setCurrentEmotion(response.data.emotion);
        setShowEmotionDialog(false);
        setEmotionText('');
      }
    } catch (error) {
      console.error("Error getting drink recommendations:", error);
      setErrorMessage('Không tìm thấy đồ uống phù hợp với cảm xúc này');
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const handleEmotionTextChange = (text) => {
    setEmotionText(text);
  };

  const handleCloseDialog = () => {
    setShowEmotionDialog(false);
    setEmotionText('');
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full lg:w-3/4 pr-0 lg:pr-4">
        <div className="mb-6">
          <BookingDrinkInfo 
            barInfo={barInfo} 
            selectedTables={selectedTables} 
            customerInfo={customerInfo}
            userInfo={userInfo}
            onBackClick={handleBackClick}
          />
          <div className="flex gap-4 mt-4">
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelBooking}
            >
              Hủy đặt bàn
            </Button>
            <Button
              variant="contained"
              startIcon={<EmojiEmotionsIcon />}
              onClick={() => setShowEmotionDialog(true)}
              sx={{
                backgroundColor: 'rgb(245, 158, 11)',
                '&:hover': { backgroundColor: 'rgb(251, 191, 36)' },
              }}
            >
              Gợi ý đồ uống theo cảm xúc
            </Button>
          </div>
        </div>

        <DrinkSelection
          drinks={filteredDrinks}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          emotion={currentEmotion}
        />
      </div>
      
      <div className="w-full lg:w-1/4 mt-4 lg:mt-8">
        <Filter 
          dataDrinkCate={dataDrinkCate}
          dataDrinkEmo={dataDrinkEmo}
          dataDrinkPrice={dataDrinkPrice}
          onApplyFilters={handleFilterChange}
        />
        <DrinkSidebar 
          drinks={drinks.filter(drink => drink.quantity > 0)} 
          onRemove={handleRemove}
          discount={barInfo.discount}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>

      <EmotionRecommendationDialog 
        showDialog={showEmotionDialog}
        onClose={handleCloseDialog}
        emotionText={emotionText}
        onEmotionTextChange={handleEmotionTextChange}
        errorMessage={errorMessage}
        isLoading={isLoadingRecommendation}
        onSubmit={handleGetRecommendation}
      />
      
      <Dialog 
        open={isLoading} 
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress style={{ color: '#FFA500' }} />
            <Typography variant="h6" style={{ color: 'white', marginTop: '20px' }}>
              Đang hủy đặt bàn...
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDrink;
