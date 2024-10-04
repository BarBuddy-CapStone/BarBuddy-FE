import React, { useState } from "react";
import { BookingDrinkInfo, DrinkSelection, DrinkSidebar } from "src/pages";

const drinkData = [
  {
    id: 1,
    name: "AUCHENTOSHAN Small 0,7ML",
    price: "3380000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bd5af23e81c55c7bed78816cce004eb0f92a76d0702c4975935175f80c1860a1?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 2,
    name: "Champagne Alfred Gratien Brut",
    price: "1803000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/eb59838a3f37d6a2e5cb9231eea3f4e6d7a658ee4704ada83b3f97518efa846c?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 3,
    name: "Champagne Billecart Salmon Brut Rosé",
    price: "2965000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/569783fb76bc9e32d46cb8d02e1d68ece7cf83e03e620e032257c1245effb6c2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 4,
    name: "Champagne Fleur de Miraval Exclusivement Rose 3",
    price: "14278000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8af940877dde28cb1388a0989d2c31f6d444b888716b51b4abbb3dc9802eefb9?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 5,
    name: "Champagne Ruinart Blanc De Blancs",
    price: "7865000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bb18521de9de58c06f79e51f5b701f96ff1e284573edab5ded3afcd84349e7d2?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
  {
    id: 6,
    name: "Rượu Sâm Panh Champagne Ruinart Brut",
    price: "5808000",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/8209bf4467eba534e52a2d455075f235541718234278ec026a40de7fbfd88004?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    quantity: 0,
  },
];

const BookingDrink = () => {
  const [drinks, setDrinks] = useState(drinkData);

  // Utility function to convert price strings to numbers
  const parsePrice = (priceString) => {
    return Number(priceString.replace(/[^0-9]/g, ''));
  };

  // Handlers for quantity changes
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
        drink.id === id && drink.quantity > 0 ? { ...drink, quantity: drink.quantity - 1 } : drink
      )
    );
  };

  // Handler to remove an item
  const handleRemove = (id) => {
    setDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.id === id ? { ...drink, quantity: 0 } : drink
      )
    );
  };

  return (
    <div className="flex flex-wrap w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full lg:w-3/4 pr-0 lg:pr-4">
        <div className="mb-6"> {/* Add some margin to prevent overlap */}
          <BookingDrinkInfo />
        </div>
        <DrinkSelection
          drinks={drinks}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </div>
      <div className="w-full lg:w-1/4 mt-4 lg:mt-0 flex justify-end">
        <DrinkSidebar drinks={drinks} parsePrice={parsePrice} onRemove={handleRemove} />
      </div>
    </div>
  );
};

export default BookingDrink;
