import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingSpinner } from "src/components";
import { toast } from "react-toastify";

const SelectedItems = ({ drinks, onRemove, discount, onProceedToPayment, numOfPeople }) => {
  const [openScaleDialog, setOpenScaleDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedItems = drinks.filter((drink) => drink.quantity > 0);
  const [scaledDrinks, setScaledDrinks] = useState([]);

  if (selectedItems.length === 0) return null;

  const totalAmount = selectedItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const discountAmount = totalAmount * (discount / 100);
  const finalAmount = totalAmount - discountAmount;

  const handleProceedToPayment = () => {
    if (numOfPeople > 1) {
      const needsScaling = selectedItems.some(item => item.quantity < numOfPeople);
      
      if (needsScaling) {
        const scaled = selectedItems.map(item => ({
          ...item,
          originalQuantity: item.quantity,
          quantity: Math.max(item.quantity, numOfPeople),
          scaledUp: item.quantity < numOfPeople
        }));
        
        setScaledDrinks(scaled);
        setOpenScaleDialog(true);
        return;
      }
    }
    
    proceedWithPayment(selectedItems, finalAmount);
  };

  const handleConfirmScale = () => {
    const newTotalAmount = scaledDrinks.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity, 
      0
    );
    const newDiscountAmount = newTotalAmount * (discount / 100);
    const newFinalAmount = newTotalAmount - newDiscountAmount;

    setOpenScaleDialog(false);
    proceedWithPayment(scaledDrinks, newFinalAmount);
  };

  const handleKeepOriginal = () => {
    setOpenScaleDialog(false);
    proceedWithPayment(selectedItems, finalAmount);
  };

  const proceedWithPayment = async (items, amount) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Thêm delay nhỏ để loading hiển thị rõ ràng hơn
      onProceedToPayment(items, amount);
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col px-6 py-4 mt-8 w-full rounded-md bg-neutral-800 shadow-[0px_0px_16px_rgba(0,0,0,0.07)] max-md:px-4 max-md:mt-6">
        <div className="self-center text-2xl font-bold text-center text-amber-400 text-opacity-90">
          Danh sách đã chọn
        </div>
        <div className="flex flex-col gap-3 mt-3 text-white">
          {selectedItems.map((item) => (
            <div key={item.drinkId} className="flex items-center gap-4">
              <img
                src={item.images} // Sử dụng trường images cho hình ảnh
                alt={item.drinkName}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="flex-1 text-xs">
                <div>{item.drinkName}</div>
                <div className="text-amber-400">{(parseFloat(item.price) * item.quantity).toLocaleString()} VND</div>
              </div>
              <div className="text-xl font-bold">{item.quantity}x</div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f128c4e54418e50e9a3a6c59973a868b3e90328a218d232da7e212dd8732b6d9?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
                className="object-contain aspect-[0.92] w-[20px] cursor-pointer"
                alt="Remove item"
                onClick={() => onRemove(item.drinkId)}
              />
            </div>
          ))}
        </div>
        <div className="shrink-0 mt-6 h-px border border-amber-400 border-solid max-md:mt-6" />

        {/* Adjusted layout for totals */}
        <div className="mt-3 text-sm font-aBeeZee text-white text-opacity-90">
          <div className="flex justify-between">
            <span>Tổng số tiền</span>
            <span>{totalAmount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Chiết khấu {discount}%</span>
            <span>- {discountAmount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between text-amber-400 text-opacity-90 font-bold">
            <span>Thành tiền</span>
            <span>{finalAmount.toLocaleString()} VND</span>
          </div>
        </div>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: 'rgb(251, 191, 36)',
            color: 'black',
            '&:hover': { backgroundColor: 'rgb(245, 158, 11)' },
            width: '150px',
            alignSelf: 'center',
          }}
          onClick={handleProceedToPayment}
        >
          Thanh toán
        </Button>
      </div>

      {/* Scale Confirmation Dialog */}
      <Dialog
        open={openScaleDialog}
        onClose={() => setOpenScaleDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: '#333',
            color: 'white',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle style={{ color: '#FFA500' }}>
          Điều chỉnh số lượng đồ uống
        </DialogTitle>
        <DialogContent>
          <div className="text-white mb-4">
            Vì có {numOfPeople} người, chúng tôi đề xuất điều chỉnh số lượng đồ uống như sau:
          </div>
          <div className="space-y-3">
            {scaledDrinks.map((drink) => (
              drink.scaledUp && (
                <div key={drink.drinkId} className="flex justify-between items-center text-white">
                  <span>{drink.drinkName}:</span>
                  <span className="text-amber-400">
                    {drink.originalQuantity} → {drink.quantity}
                  </span>
                </div>
              )
            ))}
          </div>
          <div className="mt-4 text-amber-400">
            Bạn có đồng ý với điều chỉnh này?
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleKeepOriginal}
            sx={{ color: '#FFA500' }}
          >
            Không, giữ nguyên
          </Button>
          <Button
            onClick={handleConfirmScale}
            sx={{ color: '#FFA500' }}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Spinner */}
      <LoadingSpinner open={isLoading} />
    </>
  );
};

export default SelectedItems;
