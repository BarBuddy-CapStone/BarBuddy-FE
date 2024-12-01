import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDrinkOfBar, getAllDrinkCate } from 'src/lib/service/drinkCateService';
import { message, Input, Button, Spin, Select, Drawer } from 'antd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import BookingService from 'src/lib/service/bookingService';

const { Search } = Input;
const { Option } = Select;

const ExtraDrinkStaff = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchDrinks(searchTerm, selectedCategory);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllDrinkCate();
      if (response.data && response.data.data) {
        setCategories(response.data.data.drinkCategoryResponses);
      }
    } catch (error) {
      message.error('Không thể tải danh sách loại đồ uống');
    }
  };

  const fetchDrinks = async (search = '', cateId = 'all') => {
    try {
      setLoading(true);
      const response = await getDrinkOfBar(
        search,
        cateId === 'all' ? '' : cateId
      );
      if (response.data && response.data.data) {
        setDrinks(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Không thể tải danh sách đồ uống');
      } else {
        message.error('Không thể tải danh sách đồ uống');
      }
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchDrinks(value, selectedCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    fetchDrinks(searchTerm, value);
  };

  const handleQuantityChange = (drinkId, quantity) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.drinkId === drinkId);
      if (existing) {
        if (quantity <= 0) {
          return prev.filter(d => d.drinkId !== drinkId);
        }
        return prev.map(d => d.drinkId === drinkId ? { ...d, quantity } : d);
      }
      if (quantity > 0) {
        return [...prev, { drinkId, quantity }];
      }
      return prev;
    });
  };

  const getQuantity = (drinkId) => {
    const drink = selectedDrinks.find(d => d.drinkId === drinkId);
    return drink ? drink.quantity : 0;
  };

  const handleConfirm = async () => {
    if (selectedDrinks.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đồ uống');
      return;
    }

    try {
      // Format data theo yêu cầu của API
      const drinkData = selectedDrinks.map(drink => ({
        drinkId: drink.drinkId,
        quantity: drink.quantity
      }));

      const response = await BookingService.addExtraDrink(bookingId, drinkData);
      
      if (response.data && response.data.statusCode === 200) {
        message.success(response.data.message || 'Thêm đồ uống thành công');
        navigate(`/staff/table-registration-detail/${bookingId}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Không thể thêm đồ uống');
      } else {
        message.error('Có lỗi xảy ra khi thêm đồ uống');
      }
    }
  };

  const calculateTotal = () => {
    return selectedDrinks.reduce((total, selected) => {
      const drink = drinks.find(d => d.drinkId === selected.drinkId);
      return total + (drink ? drink.price * selected.quantity : 0);
    }, 0);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <IconButton onClick={() => navigate(`/staff/table-registration-detail/${bookingId}`)} aria-label="quay lại">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-2xl font-bold">Thêm Đồ Uống</h1>
        {selectedDrinks.length > 0 && (
          <Button
            onClick={() => setDrawerVisible(true)}
            className="flex items-center gap-2"
          >
            <span>Đã chọn {selectedDrinks.reduce((sum, drink) => sum + drink.quantity, 0)} đồ uống</span>
          </Button>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <Search
          placeholder="Tìm kiếm đồ uống..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleCategoryChange}
          className="min-w-[200px]"
        >
          <Option value="all">Tất cả loại đồ uống</Option>
          {categories.map(category => (
            <Option key={category.drinksCategoryId} value={category.drinksCategoryId}>
              {category.drinksCategoryName}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : drinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <div key={drink.drinkId} className="bg-white rounded-lg shadow-md p-4">
              <img 
                src={drink.images} 
                alt={drink.drinkName} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{drink.drinkName}</h3>
              <p className="text-gray-600 mb-2">Loại đồ uống: {drink.drinkCategoryResponse.drinksCategoryName}</p>
              <p className="text-gray-500 text-sm mb-4">Thông tin: {drink.description}</p>
              <p className="text-lg font-bold text-blue-600 mb-4">
                {drink.price.toLocaleString('vi-VN')} VND
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => handleQuantityChange(drink.drinkId, getQuantity(drink.drinkId) - 1)}
                    disabled={getQuantity(drink.drinkId) === 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{getQuantity(drink.drinkId)}</span>
                  <Button 
                    onClick={() => handleQuantityChange(drink.drinkId, getQuantity(drink.drinkId) + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🍷</div>
          <p className="text-lg text-gray-500">Không tìm thấy đồ uống nào</p>
          <p className="text-sm text-gray-400">Vui lòng thử tìm kiếm hoặc chọn loại đồ uống khác</p>
        </div>
      )}

      <Drawer
        title={
          <div className="text-xl font-bold">
            Danh sách đồ uống đã chọn
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
        footer={
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg border-t pt-4">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold text-blue-600">
                {calculateTotal().toLocaleString('vi-VN')} VND
              </span>
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={handleConfirm}
              className="bg-blue-600 text-white"
            >
              Xác nhận ({selectedDrinks.reduce((sum, drink) => sum + drink.quantity, 0)} đồ uống)
            </Button>
          </div>
        }
      >
        <div className="flex-1 overflow-auto">
          {selectedDrinks.map((selected) => {
            const drink = drinks.find(d => d.drinkId === selected.drinkId);
            if (!drink) return null;
            return (
              <div key={drink.drinkId} className="border-b py-4">
                <div className="flex gap-4">
                  <img 
                    src={drink.images} 
                    alt={drink.drinkName} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{drink.drinkName}</div>
                        <div className="text-sm text-gray-500">
                          {drink.drinkCategoryResponse.drinksCategoryName}
                        </div>
                        <div className="text-blue-600 font-medium mt-1">
                          {drink.price.toLocaleString('vi-VN')} VND
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => handleQuantityChange(drink.drinkId, selected.quantity - 1)}
                          size="small"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{selected.quantity}</span>
                        <Button 
                          onClick={() => handleQuantityChange(drink.drinkId, selected.quantity + 1)}
                          size="small"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right text-sm font-medium mt-2">
                      Thành tiền: {(drink.price * selected.quantity).toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default ExtraDrinkStaff;
