import React, { useState } from "react";

const drinkData = [
  {
    id: 1,
    name: "AUCHENTOSHAN 0,7ML",
    price: "3.380.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bd5af23e81c55c7bed78816cce004eb0f92a76d0702c4975935175f80c1860a1?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 2,
    name: "Champagne Alfred Gratien Brut",
    price: "1.803.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/eb59838a3f37d6a2e5cb9231eea3f4e6d7a658ee4704ada83b3f97518efa846c?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 1,
  },
  {
    id: 3,
    name: "Champagne Billecart Salmon Brut Rosé",
    price: "2.965.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/569783fb76bc9e32d46cb8d02e1d68ece7cf83e03e620e032257c1245effb6c2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 4,
    name: "Champagne Fleur de Miraval Exclusivement Rose 3",
    price: "14.278.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8af940877dde28cb1388a0989d2c31f6d444b888716b51b4abbb3dc9802eefb9?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 5,
    name: "Champagne Ruinart Blanc De Blancs",
    price: "7.865.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bb18521de9de58c06f79e51f5b701f96ff1e284573edab5ded3afcd84349e7d2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 6,
    name: "Rượu Sâm Panh Champagne Ruinart Brut",
    price: "5.808.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8209bf4467eba534e52a2d455075f235541718234278ec026a40de7fbfd88004?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 1,
  },
  {
    id: 7,
    name: "Rượu Whisky Glengoyne 10 Year Old",
    price: "1.430.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e6d5294aee156de7e3871955171932dfee356da70a8d27f58f7d9fe933bd7f93?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 8,
    name: "Rượu Whisky Glengoyne 25 Year Old",
    price: "19.470.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/659687eca4f798da773baab64fe0376d2fa0f9b5f66eda212758c012657a8e0d?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 9,
    name: "Rượu Whisky Tamdhu 12 Year Old",
    price: "1.760.000 VND",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/56c3d8ce10bd31eb2ccd9865795a02efc8f1dd5ef4c2e8f149e412a863ce571b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 1,
  },
];

function DrinkCard({
  id,
  name,
  price,
  image,
  quantity,
  onIncrease,
  onDecrease,
}) {
  return (
    <article className="flex flex-col grow shrink self-stretch my-auto rounded-xl min-w-[240px] w-[206px]">
      <div className="flex flex-col items-center px-5 py-3.5 w-full rounded-md bg-neutral-700 max-md:px-5">
        <img
          loading="lazy"
          src={image}
          alt={name}
          className="object-contain self-stretch w-full rounded-md aspect-[0.84]"
        />
        <h3 className="mt-8 text-xl leading-7 text-zinc-100">{name}</h3>
        <p className="mt-7 text-base leading-snug text-amber-400">{price}</p>
        <div className="flex gap-3.5 mt-5 w-24 text-lg text-black whitespace-nowrap">
          <button
            className="px-2.5 pt-0.5 pb-5 bg-white rounded-xl"
            aria-label={`Decrease quantity of ${name}`}
            onClick={() => onDecrease(id)}
          >
            -
          </button>
          <span className="text-white">{quantity}</span>
          <button
            className="px-2.5 pt-0.5 pb-3.5 bg-white rounded-xl"
            aria-label={`Increase quantity of ${name}`}
            onClick={() => onIncrease(id)}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function DrinkSelection() {
  const [drinks, setDrinks] = useState(drinkData);

  const handleIncrease = (id) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.id === id ? { ...drink, quantity: drink.quantity + 1 } : drink
      )
    );
  };

  const handleDecrease = (id) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.id === id && drink.quantity > 0
          ? { ...drink, quantity: drink.quantity - 1 }
          : drink
      )
    );
  };

  return (
    <section className="flex flex-col grow items-center px-8 pt-5 pb-44 w-full text-center bg-neutral-800 max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full">
      <h2 className="ml-6 text-3xl leading-snug text-amber-400">
        Chọn đồ uống (tùy chọn)
      </h2>
      <div className="flex flex-col mt-8 max-w-full w-[100]">
        <div className="flex flex-wrap gap-10 items-center w-full max-md:max-w-full">
          {drinks.slice(0, 3).map((drink) => (
            <DrinkCard
              key={drink.id}
              {...drink}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-10 items-center mt-16 w-full max-md:mt-10 max-md:max-w-full">
          {drinks.slice(3, 6).map((drink) => (
            <DrinkCard
              key={drink.id}
              {...drink}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-10 items-center mt-16 w-full max-md:mt-10 max-md:max-w-full">
          {drinks.slice(6).map((drink) => (
            <DrinkCard
              key={drink.id}
              {...drink}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DrinkSelection;
