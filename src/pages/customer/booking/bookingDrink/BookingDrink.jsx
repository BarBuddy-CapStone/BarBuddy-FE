import React, { useState, useEffect } from "react";
import { BookingDrinkInfo, DrinkSelection, DrinkSidebar, Filter } from "src/pages";
import { getAllDrink } from 'src/lib/service/managerDrinksService';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from 'src/lib/hooks/useUserStore';
import { Button, Dialog, CircularProgress, DialogContent, Typography } from '@mui/material';

const BookingDrink = () => {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [dataDrinkCate, setDataDrinkCate] = useState([]);
  const [dataDrinkEmo, setDataDrinkEmo] = useState([]);
  const [dataDrinkPrice, setDataDrinkPrice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const { barInfo, selectedTables, customerInfo } = location.state || {};
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await getAllDrink();
        const drinksData = response.data.data || [];
        setDrinks(drinksData.map(drink => ({ ...drink, quantity: 0 })));
        setFilteredDrinks(drinksData.map(drink => ({ ...drink, quantity: 0 })));

        // Extract categories, emotions, and prices
        const categories = [...new Set(drinksData.map(drink => drink.drinkCategoryResponse).filter(Boolean))];
        const emotions = [...new Set(drinksData.flatMap(drink => drink.emotionsDrink || []))];
        const prices = drinksData.map(drink => parseFloat(drink.price)).filter(price => !isNaN(price));

        setDataDrinkCate(categories);
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
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
            sx={{ mt: 2 }}
          >
            Hủy đặt bàn
          </Button>
        </div>
        <DrinkSelection
          drinks={filteredDrinks}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
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

      {/* Loading Popup */}
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
