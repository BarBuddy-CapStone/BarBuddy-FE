import React from 'react';

function DrinksList({ totalAmount, selectedDrinks }) {
  return (
    <aside className="flex flex-col px-5 py-2 mx-auto w-full rounded-md bg-neutral-800 shadow-[0px_0px_14px_rgba(0,0,0,0.07)] max-md:px-2 max-md:mt-8">
      <h2 className="text-lg font-bold text-center text-amber-400 text-opacity-90 max-md:mr-1">
        Danh sách thức uống
      </h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      {selectedDrinks.map((drink, index) => (
        <DrinkItem key={index} {...drink} />
      ))}
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      <div className="flex gap-4 justify-between mt-2 text-sm">
        <div className="font-medium text-white text-opacity-90">
          Tổng số tiền
        </div>
        <div className="font-bold text-right text-amber-400 text-opacity-90">
          {`${totalAmount.toLocaleString()} VND`}
        </div>
      </div>
    </aside>
  );
}

function DrinkItem({ drinkName, price, quantity, image }) {
  return (
    <div className="flex gap-4 justify-between mt-5 leading-none text-white">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <img 
          src={image} 
          alt={drinkName} 
          className="w-12 h-12 shrink-0 object-cover rounded-full"
        />
        <div className="flex flex-col text-sm min-w-0">
          <div className="truncate max-w-[150px]">{drinkName}</div>
          <div className="text-amber-400">{price.toLocaleString()} VND</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-amber-400">{(price * quantity).toLocaleString()} VND</div>
        <div className="text-lg font-bold">{quantity}x</div>
      </div>
    </div>
  );
}

export default DrinksList;
