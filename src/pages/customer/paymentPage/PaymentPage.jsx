import React, { useState, useMemo, useCallback } from 'react';
import BookingDetail from './components/BookingDetail';
import DrinksList from './components/DrinkList';
import { getDrinkData } from 'src/lib/service/customerService';
import { payment } from 'src/lib/service/paymentService';

const paymentOptions = [
  {
    id: 'ZALOPAY',
    name: 'Zalo Pay',
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b6de230e30188c5d04875d57ffe11a6e138f664832b7f795d5bdce10f18f60f9?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
    selected: false
  },
  {
    id: 'VNPAY',
    name: 'VN Pay',
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c3b795cf29370135614c954e43489801f8101bcc1075bab4929eafd629486f12?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b',
    selected: true
  },
  {
    id: 'NAPAS247',
    name: 'Napas 247',
    image: 'https://www.cukcuk.vn/25472/ma-vietqr-la-gi/napas247-b58ff17b/',
    selected: true
  }
];

function PaymentProcessing({ totalAmount, onPaymentSuccess }) {
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[1].name);
  const discount = useMemo(() => totalAmount * 0.1, [totalAmount]);
  const requiredAmount = useMemo(() => totalAmount - discount, [totalAmount, discount]);

  const paymentData = {
    paymentContent: "THANH TOAN DON HANG 0001",
    paymentCurrency: "VND",
    paymentRefId: "PAY5678",
    requiredAmount: requiredAmount,
    paymentLanguage: "vn",
    merchantId: "MER1111",
    paymentDestinationId: paymentOptions.find(option => option.name === selectedPayment)?.id,
    signature: "12345ABCD"
  };

  const handlePayment = useCallback(async () => {
    try {
      const response = await payment(paymentData);
      if (response.data.statusCode === 200) {
        onPaymentSuccess(response.data.data.paymentUrl);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
    }
  }, [paymentData, onPaymentSuccess]);

  return (
    <section className="flex flex-col rounded-md items-start px-4 pt-2 pb-4 w-full bg-neutral-800 max-md:px-2 max-md:max-w-full">
      <h2 className="ml-2 text-xl leading-snug text-center text-amber-400 max-md:ml-1">
        Phương thức thanh toán
      </h2>
      <hr className="shrink-0 self-stretch mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
      <div className="flex gap-2 items-start mt-4 text-sm leading-none text-zinc-100">
        {paymentOptions.map((option) => (
          <div key={option.id} className={`flex flex-col w-[140px] ${option.name === selectedPayment ? 'font-bold' : ''}`} onClick={() => setSelectedPayment(option.name)}>
            <div className={`flex justify-between items-center p-2 w-full rounded-xl ${option.name === selectedPayment ? 'border border-amber-400 border-solid bg-stone-900' : 'bg-zinc-900'}`}>
              <div className="flex gap-2 items-center self-stretch my-auto">
                <img loading="lazy" src={option.image} alt={`${option.name} logo`} className="object-contain shrink-0 self-stretch my-auto rounded-lg aspect-[1.79] w-[50px]" />
                <div className="self-stretch my-auto">{option.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <section className="flex flex-col px-4 py-2 mt-5 w-full rounded-md text-lg bg-neutral-800 max-md:px-2 max-md:mt-6 max-md:max-w-full">
        <h2 className="self-start text-xl leading-snug text-amber-400">Chi tiết thanh toán</h2>
        <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid max-md:max-w-full" />
        <div className="flex flex-col mt-2 w-full bg-neutral-800 text-white text-sm text-opacity-90 max-md:max-w-full">
          <PaymentRow label="Phí đặt chỗ" value="Miễn phí" />
          <PaymentRow label="Tổng giá tiền thức uống" value={totalAmount.toLocaleString() + " VND"} />
          <PaymentRow label="Chiết khấu 10%" value={`- ${discount.toLocaleString()} VND`} />
        </div>
        <hr className="shrink-0 mt-5 h-px border border-amber-400 border-solid max-md:mt-4 max-md:max-w-full" />
        <PaymentRow label="Thành tiền" value={`${requiredAmount.toLocaleString()} VND`} isTotal={true} />
        <button className="self-end px-px py-2 my-4 text-lg font-semibold leading-none text-center text-black bg-amber-400 rounded-md min-h-[40px] w-[180px] max-md:mt-4" onClick={handlePayment}>
          Thanh toán
        </button>
      </section>
    </section>
  );
}

function PaymentRow({ label, value, isTotal = false }) {
  const rowClasses = isTotal
    ? "flex flex-wrap items-center mt-2 min-h-[40px] text-amber-400 text-opacity-90"
    : "flex relative items-start w-full min-h-[36px] max-md:max-w-full";
  const labelClasses = isTotal
    ? "grow shrink self-stretch my-auto font-medium w-[150px]"
    : "z-0 my-auto font-medium w-[200px]";
  const valueClasses = isTotal
    ? "grow shrink self-stretch my-auto font-bold text-right w-[500px] max-md:max-w-full"
    : "absolute right-0 z-0 self-start h-6 font-bold text-right bottom-[4px] w-[500px] max-md:max-w-full";

  return (
    <div className={rowClasses}>
      <div className={labelClasses}>{label}</div>
      <div className={valueClasses}>{value}</div>
    </div>
  );
}

function PaymentPage() {
  const drinks = getDrinkData();
  const randomDrinks = useMemo(() => drinks.sort(() => 0.5 - Math.random()).slice(0, 2), [drinks]);
  const totalAmount = useMemo(() => randomDrinks.reduce((total, drink) => total + drink.price * drink.quantity, 0), [randomDrinks]);

  const handlePaymentSuccess = (paymentUrl) => {
    window.location.href = paymentUrl;
  };

  return (
    <main className="w-full max-w-[1620px] max-md:max-w-full">
      <div className="flex flex-col gap-5 max-md:flex-col">
        <div className="flex flex-col w-[90%] max-md:mt-5 ml-20 max-md:ml-0 max-md:w-full">
          <BookingDetail />
        </div>
        <div className="flex flex-row gap-5 max-md:flex-col">
          <div className="flex flex-col w-[60%] max-md:mt-5 ml-20 max-md:ml-0 max-md:w-full">
            <PaymentProcessing totalAmount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
          </div>
          <div className="flex flex-col ml-auto w-[20%] mr-[70px] max-md:ml-0 max-md:w-full">
            <DrinksList totalAmount={totalAmount} randomDrinks={randomDrinks} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;