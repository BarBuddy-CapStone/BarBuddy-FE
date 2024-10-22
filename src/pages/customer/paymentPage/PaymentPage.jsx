import React, { useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingDetail from './components/BookingDetail';
import DrinksList from './components/DrinkList';
import { paymentWithDrink } from 'src/lib/service/paymentService';
import { Button, Typography, Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import useAuthStore from 'src/lib/hooks/useUserStore';
import Momologo from 'src/assets/image/Primarylogo3x.png';
import dayjs from 'dayjs';

const paymentOptions = [
  {
    id: 'VNPAY',
    name: 'VN Pay',
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c3b795cf29370135614c954e43489801f8101bcc1075bab4929eafd629486f12?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
  },
  {
    id: 'MOMO',
    name: 'Ví MOMO',
    image: Momologo,
  },
  // {
  //   id: 'ZALOPAY',
  //   name: 'Zalo Pay',
  //   image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b6de230e30188c5d04875d57ffe11a6e138f664832b7f795d5bdce10f18f60f9?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
  // },
  // {
  //   id: 'NAPAS247',
  //   name: 'Napas 247',
  //   image: 'https://www.cukcuk.vn/25472/ma-vietqr-la-gi/napas247-b58ff17b/',
  // },
];

function PaymentProcessing({ totalAmount, discountAmount, finalAmount, discount, onPaymentSuccess, paymentData }) {
  const [selectedPayment, setSelectedPayment] = useState('VNPAY');
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const { token } = useAuthStore();

  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await paymentWithDrink({
        ...paymentData,
        paymentDestination: selectedPayment
      }, token);

      if (response.data.statusCode === 200) {
        const paymentUrl = response.data.data.paymentUrl;
        onPaymentSuccess(paymentUrl);
      } else {
        setErrorDialog({ open: true, message: 'Thanh toán thất bại. Vui lòng thử lại.' });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorDialog({ open: true, message: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPayment, paymentData, token, onPaymentSuccess]);

  const handleCloseErrorDialog = () => {
    setErrorDialog({ ...errorDialog, open: false });
  };

  return (
    <Box className="flex flex-col rounded-md items-start px-4 pt-2 pb-4 w-full bg-neutral-800 max-md:px-2 max-md:max-w-full">
      <Typography variant="h6" className="ml-2 text-amber-400 max-md:ml-1">
        Phương thức thanh toán
      </Typography>
      <hr className="shrink-0 self-stretch mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
      <Box className="mt-4 w-full flex justify-start gap-2">
        {paymentOptions.map((option) => (
          <Button
            key={option.id}
            onClick={() => setSelectedPayment(option.id)}
            variant={selectedPayment === option.id ? "contained" : "outlined"}
            sx={{
              backgroundColor: selectedPayment === option.id ? '#1e1e1e' : 'transparent',
              border: `1px solid ${selectedPayment === option.id ? '#ffa500' : '#555'}`,
              borderRadius: '8px',
              height: '40px',
              width: '120px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              marginRight: '8px',
              '&:hover': {
                backgroundColor: selectedPayment === option.id ? '#1e1e1e' : '#333',
              },
            }}
          >
            <img src={option.image} alt={option.name} className="w-5 h-5 object-contain mr-2" />
            <Typography variant="caption" sx={{ color: 'white', fontSize: '12px' }}>
              {option.name}
            </Typography>
          </Button>
        ))}
      </Box>
      <Box className="flex flex-col px-4 py-2 mt-5 w-full rounded-md text-sm bg-neutral-800 max-md:px-2 max-md:mt-6 max-md:max-w-full">
        <Typography variant="subtitle1" className="self-start text-amber-400">Chi tiết thanh toán</Typography>
        <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
        <Box className="flex flex-col mt-2 w-full bg-neutral-800 text-white text-sm text-opacity-90 max-md:max-w-full">
          <PaymentRow label="Phí đặt chỗ" value="Miễn phí" />
          <PaymentRow label="Tổng giá tiền thức uống" value={`${totalAmount.toLocaleString()} VND`} />
          <PaymentRow label={`Chiết khấu ${discount}%`} value={`- ${discountAmount.toLocaleString()} VND`} />
        </Box>
        <hr className="shrink-0 mt-5 h-px border border-amber-400 border-solid max-md:mt-4 max-md:max-w-full" />
        <PaymentRow label="Thành tiền" value={`${finalAmount.toLocaleString()} VND`} isTotal={true} />
        <Button 
          variant="contained" 
          onClick={handlePayment}
          disabled={isLoading}
          sx={{
            alignSelf: 'flex-end',
            mt: 2,
            mb: 1,
            backgroundColor: '#ffa500',
            color: 'white',
            '&:hover': {
              backgroundColor: '#ff8c00',
            },
            width: '120px',
            height: '36px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            '&:disabled': {
              backgroundColor: '#ffa500',
              color: 'white',
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              <span>Đang xử lý</span>
            </Box>
          ) : (
            'Thanh toán'
          )}
        </Button>
      </Box>
      
      <Dialog
        open={errorDialog.open}
        onClose={handleCloseErrorDialog}
        PaperProps={{
          style: {
            backgroundColor: '#333',
            color: 'white',
            minWidth: '300px',
          },
        }}
      >
        <DialogTitle style={{ color: '#FFA500' }}>Lỗi Thanh Toán</DialogTitle>
        <DialogContent>
          <Typography>{errorDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} style={{ color: '#FFA500' }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function PaymentRow({ label, value, isTotal = false }) {
  return (
    <Box className={`flex justify-between items-center ${isTotal ? 'mt-2 text-amber-400' : 'text-white'} min-h-[28px]`}>
      <Typography variant="body2" className={isTotal ? 'font-medium' : ''}>
        {label}
      </Typography>
      <Typography variant="body2" className={isTotal ? 'font-bold' : ''}>
        {value}
      </Typography>
    </Box>
  );
}

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    barInfo, 
    selectedTables, 
    customerInfo, 
    selectedDrinks, 
    totalAmount: receivedTotalAmount, 
    discount: receivedDiscount
  } = location.state || {};

  // Xử lý các trường hợp dữ liệu không tồn tại
  const totalAmount = receivedTotalAmount || 0;
  const discount = receivedDiscount || 0;

  const discountAmount = useMemo(() => Math.round(totalAmount * (discount / 100)), [totalAmount, discount]);
  const finalAmount = useMemo(() => totalAmount - discountAmount, [totalAmount, discountAmount]);

  const paymentData = useMemo(() => {
    if (!selectedTables || selectedTables.length === 0) {
      console.error('No selected tables');
      return null;
    }
    const firstTable = selectedTables[0];
    return {
      barId: barInfo?.barId,
      bookingDate: firstTable.date ? dayjs(firstTable.date).format('YYYY-MM-DD') : '',
      bookingTime: firstTable.time || '',
      note: customerInfo?.note || "",
      tableIds: selectedTables.map(table => table.tableId),
      drinks: selectedDrinks?.map(drink => ({
        drinkId: drink.drinkId,
        quantity: drink.quantity
      })) || []
    };
  }, [barInfo, selectedTables, customerInfo, selectedDrinks]);

  const handlePaymentSuccess = useCallback((paymentUrl) => {
    window.location.href = paymentUrl;
  }, []);

  // Kiểm tra xem có đủ dữ liệu để hiển thị trang không
  if (!paymentData) {
    return <div>Không đủ thông tin để thực hiện thanh toán. Vui lòng thử lại.</div>;
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4">
      <Box className="flex flex-col gap-5 max-md:flex-col">
        <Box className="w-full">
          <BookingDetail 
            barInfo={barInfo}
            selectedTables={selectedTables}
            customerInfo={customerInfo}
          />
        </Box>
        <Box className="flex flex-row gap-5 max-md:flex-col">
          <Box className="flex flex-col w-[70%] max-md:w-full">
            <PaymentProcessing 
              totalAmount={totalAmount} 
              discountAmount={discountAmount}
              finalAmount={finalAmount}
              discount={discount}
              onPaymentSuccess={handlePaymentSuccess}
              paymentData={paymentData}
            />
          </Box>
          <Box className="flex flex-col w-[30%] max-md:w-full">
            <DrinksList totalAmount={totalAmount} selectedDrinks={selectedDrinks || []} />
          </Box>
        </Box>
      </Box>
    </main>
  );
}

export default PaymentPage;
