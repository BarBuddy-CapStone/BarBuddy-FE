import React from "react";
import { BookingDrinkInfo, DrinkSelection, DrinkSidebar } from "src/pages";

const BookingDrink = () => {
  return (
    <div className="flex flex-wrap w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full lg:w-3/4 pr-0 lg:pr-4">
        <BookingDrinkInfo />
        <DrinkSelection />
      </div>
      <div className="w-full lg:w-1/4 mt-4 lg:mt-0 flex justify-end">
        <DrinkSidebar />
      </div>
    </div>
  );
};

export default BookingDrink;
