import React, { useState } from "react";
import Pagination from '@mui/material/Pagination'; // Import MUI Pagination

function DrinkSelection({ drinks, onIncrease, onDecrease }) {
  const [currentPage, setCurrentPage] = useState(1);
  const drinksPerPage = 6;

  // Pagination calculations
  const indexOfLastDrink = currentPage * drinksPerPage;
  const indexOfFirstDrink = indexOfLastDrink - drinksPerPage;
  const currentDrinks = drinks.slice(indexOfFirstDrink, indexOfLastDrink);
  const totalPages = Math.ceil(drinks.length / drinksPerPage);

  // Handler for changing the page
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <section className="flex flex-col grow items-center px-8 pt-5 pb-10 w-full text-center bg-neutral-800 max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full">
      <h2 className="ml-6 text-3xl leading-snug text-amber-400">
        Chọn đồ uống (tùy chọn)
      </h2>
      <div className="flex flex-col mt-8 max-w-full w-[100]">
        {/* Render Drink Cards */}
        <div className="flex flex-wrap gap-10 items-center w-full max-md:max-w-full">
          {currentDrinks.map((drink) => (
            <article
              key={drink.id}
              className="flex flex-col grow shrink self-stretch my-auto rounded-xl min-w-[240px] w-[206px] h-[400px]" // Fixed height for uniformity
            >
              <div className="flex flex-col items-center px-5 py-3.5 w-full h-full rounded-md bg-neutral-700 max-md:px-5">
                {/* Updated image container */}
                <div className="w-full h-48 rounded-md overflow-hidden">
                  <img
                    loading="lazy"
                    src={drink.image}
                    alt={drink.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="mt-4 text-xl leading-7 text-zinc-100 text-center">{drink.name}</h3>
                <p className="mt-4 text-base leading-snug text-amber-400 text-center">
                  {parseInt(drink.price).toLocaleString()} VND
                </p>
                <div className="flex gap-2 mt-5 w-24 text-lg text-black justify-center">
                  <button
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    onClick={() => onDecrease(drink.id)}
                  >
                    -
                  </button>
                  <span className="text-white">{drink.quantity}</span>
                  <button
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    onClick={() => onIncrease(drink.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* Pagination Controls using MUI Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%", // Rounded pagination items
                color: "white", // Default color for text
                backgroundColor: "rgb(251, 191, 36)", // Orange background color
              },
              "& .Mui-selected": {
                backgroundColor: "rgb(245, 158, 11)", // Slightly darker orange for selected page
              },
              "& .MuiPaginationItem-icon": {
                color: "white", // White color for arrow icons
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default DrinkSelection;
