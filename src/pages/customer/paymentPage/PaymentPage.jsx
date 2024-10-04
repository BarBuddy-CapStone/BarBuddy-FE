import React from 'react';
import PaymentMethod from './components/PaymentMethod';
import PaymentDetails from './components/PaymentDetail';
import DrinksList from './components/DrinkList';
import BookingDetail from './components/BookingDetail';

function PaymentPage() {
  return (
    <main className="w-full max-w-[1620px] max-md:max-w-full">
      <div className="flex flex-col gap-5 max-md:flex-col">
        <div className="flex flex-col w-[90%] max-md:mt-5 ml-20 max-md:ml-0 max-md:w-full">
          <BookingDetail />
        </div>
        <div className="flex flex-row gap-5 max-md:flex-col">
          <div className="flex flex-col w-[60%] max-md:mt-5 ml-20 max-md:ml-0 max-md:w-full">
            <PaymentMethod />
            <PaymentDetails />
          </div>
          <div className="flex flex-col ml-auto w-[20%] mr-[70px] max-md:ml-0 max-md:w-full">
            <DrinksList />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;