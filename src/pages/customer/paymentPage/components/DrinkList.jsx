import React from 'react';

const drinks = [
  { name: "Champagne Alfred Gratie...", price: "1.803.000 VND", quantity: 1 },
  { name: "Rượu Sâm Panh Champag...", price: "5.808.000 VND", quantity: 1 },
  { name: "Rượu Whisky Tamdhu 12 Y...", price: "1.760.000 VND", quantity: 1 }
];

function DrinksList() {
  return (
    <aside className="flex flex-col px-5 py-2 mx-auto w-full rounded-md bg-neutral-800 shadow-[0px_0px_14px_rgba(0,0,0,0.07)] max-md:px-2 max-md:mt-8">
      <h2 className="text-lg font-bold text-center text-amber-400 text-opacity-90 max-md:mr-1">
        Danh sách thức uống
      </h2>
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      {drinks.map((drink, index) => (
        <DrinkItem key={index} {...drink} />
      ))}
      <hr className="shrink-0 mt-2 h-px border border-amber-400 border-solid" />
      <div className="flex gap-4 justify-between mt-2 text-sm">
        <div className="font-medium text-white text-opacity-90">
          Tổng số tiền
        </div>
        <div className="font-bold text-right text-amber-400 text-opacity-90">
          9.371.000 VND
        </div>
      </div>
    </aside>
  );
}

function DrinkItem({ name, price, quantity }) {
  return (
    <div className="flex gap-4 justify-between mt-5 leading-none text-right text-white">
      <div className="flex flex-col text-sm">
        <div>{name}</div>
        <div className="self-end text-amber-400">{price}</div>
      </div>
      <div className="my-auto text-lg font-bold">{quantity}x</div>
    </div>
  );
}

export default DrinksList;