import React from 'react';

function DrinksList({ totalAmount, randomDrinks }) {

  return (
    <aside className="flex flex-col px-5 py-2 mx-auto w-full rounded-md bg-neutral-800 shadow-[0px_0px_14px_rgba(0,0,0,0.07)] max-md:px-2 max-md:mt-8">
      <h2 className="text-lg font-bold text-center text-amber-400 text-opacity-90 max-md:mr-1">
        Danh sách thức uống
      </h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      {randomDrinks.map((drink, index) => (
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

function DrinkItem({ name, price, quantity }) {
  return (
    <div className="flex gap-4 justify-between mt-5 leading-none text-right text-white">
      <div className="flex flex-col text-sm" style={{ width: '200px' }}>
        <div className="truncate">{name}</div>
        <div className="self-end text-amber-400">{(price*quantity).toLocaleString() + " VND"}</div>
      </div>
      <div className="my-auto text-lg font-bold">{quantity}x</div>
    </div>
  );
}

export default DrinksList;