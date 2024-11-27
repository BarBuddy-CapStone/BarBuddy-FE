import React from "react";
import Pagination from '@mui/material/Pagination';

const DrinkSelection = ({ drinks, onIncrease, onDecrease, emotion }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const drinksPerPage = 6;

  const indexOfLastDrink = currentPage * drinksPerPage;
  const indexOfFirstDrink = indexOfLastDrink - drinksPerPage;
  const currentDrinks = drinks.slice(indexOfFirstDrink, indexOfLastDrink);
  const totalPages = Math.ceil(drinks.length / drinksPerPage);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const renderTitle = () => {
    if (!emotion) {
      return (
        <h2 className="ml-6 text-3xl leading-snug text-amber-400">
          Chọn đồ uống (tùy chọn)
        </h2>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <h2 className="ml-6 text-3xl leading-snug text-amber-400">
          Đồ uống được gợi ý cho bạn
        </h2>
        <p className="text-gray-400 italic">
          Dựa trên cảm xúc: "{emotion}"
        </p>
      </div>
    );
  };

  return (
    <section className="flex flex-col grow items-center px-8 pt-5 pb-10 w-full text-center bg-neutral-800 max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full">
      {renderTitle()}
      <div className="flex flex-col mt-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full">
          {currentDrinks.map((drink) => (
            <article 
              key={drink.drinkId} 
              className="w-full max-w-[280px] h-auto rounded-xl"
            >
              <div className="flex flex-col items-center px-5 py-3.5 w-full h-full rounded-md bg-neutral-700 max-md:px-5">
                <div className="w-full h-48 rounded-md overflow-hidden">
                  <img 
                    loading="lazy" 
                    src={drink.images} 
                    alt={drink.drinkName} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="mt-4 text-xl leading-7 text-zinc-100 text-center line-clamp-2">
                  {drink.drinkName}
                </h3>
                <p className="mt-4 text-base leading-snug text-amber-400 text-center">
                  {parseInt(drink.price).toLocaleString()} VND
                </p>
                {drink.reason && (
                  <div className="mt-4 p-3 bg-neutral-600 rounded-md w-full">
                    <p className="text-sm text-zinc-100 text-left">
                      <span className="font-semibold text-amber-400">Lý do gợi ý:</span>{' '}
                      {drink.reason}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 mt-5 w-24 text-lg text-black justify-center mb-3">
                  <button
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    onClick={() => onDecrease(drink)}
                  >
                    -
                  </button>
                  <span className="text-white">{drink.quantity || 0}</span>
                  <button
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    onClick={() => onIncrease(drink)}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                color: "white",
                backgroundColor: "rgb(251, 191, 36)",
              },
              "& .Mui-selected": {
                backgroundColor: "rgb(245, 158, 11)",
              },
              "& .MuiPaginationItem-icon": {
                color: "white",
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default DrinkSelection;
