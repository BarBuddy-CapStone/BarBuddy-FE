import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranchesData, getDrinkData } from 'src/lib/service/customerService';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const branchesData = getBranchesData();

const drinkData = getDrinkData();

const BranchCard = ({ branch }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/bar-detail?barId=${branch.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-neutral-700 text-white rounded-lg shadow-md overflow-hidden max-w-[300px] transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img src={branch.image} alt={branch.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg text-yellow-500 font-bold mb-2">{branch.name}</h3>
        <div className="text-orange-400 mb-2">
          <span className="text-sm">Đánh giá: {branch.rating}</span>
          <span className="ml-2 text-gray-400">({branch.reviews} reviews)</span>
        </div>
        <p className="text-white-400 text-sm mb-2">Địa chỉ: {branch.address}</p>
        <p className="text-white-400 text-sm break-words">Thời gian mở cửa - đóng cửa: {branch.openingHours}</p>
      </div>
    </div>
  );
};

function LocationsList({ locations }) {
  return (
    <div className="rounded-md bg-neutral-700 shadow-[0px_0px_16px_rgba(0,0,0,0.1)] text-white p-6 rounded-lg w-[65%] mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4 border-b border-yellow-500 pb-2">
        All Locations
      </h2>
      <ul className="space-y-4">
        {locations.map((location, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2 text-sm">📍</span>
            <span className='break-words text-sm'>{location.name}, {location.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrinkCard({ imageSrc, name, price }) {
  return (
    <div className="flex flex-col px-2.5 py-3 w-1/6 max-md:w-full transition-transform transform hover:scale-105"> {/* Điều chỉnh chiều rộng nhỏ hơn */}
      <div className="flex flex-col grow items-center w-full text-center rounded-xl bg-neutral-700 max-md:mt-7">
        <img loading="lazy" src={imageSrc} alt={name} className="object-contain self-stretch max-h-45 rounded-md aspect-[0.84]" /> {/* Giảm kích thước hình ảnh */}
        <h3 className="mt-1.5 text-base leading-7 text-zinc-100">{name}</h3>
        <p className="mt-1 text-sm leading-snug text-amber-400">{price}</p>
      </div>
    </div>
  );
}

const BarBuddyDrinks = () => {
  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-20 mt-10 px-10 py-5">
      <header className="flex flex-wrap gap-3 justify-between w-full leading-snug">
        <h2 className="text-2xl text-amber-400">Đồ uống toàn chi nhánh</h2>
        <div className="flex gap-5 my-auto text-xl text-gray-200 cursor-pointer hover:text-amber-400">
          <span className="basis-auto">Xem tất cả <ArrowForwardIcon className='mb-1'/></span>
        </div>
      </header>
      <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid max-md:max-w-full" />
      <div className="mt-10 max-md:max-w-full">
        <div className="flex gap-2 max-md:flex-col"> {/* Giảm khoảng cách giữa các sản phẩm */}
          {drinkData.map((drink, index) => (
            <DrinkCard key={index} {...drink} />
          ))}
        </div>
      </div>
    </section>
  );
}

const BarBuddyBranches = () => {
  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-20 mt-10 px-10 py-8">
      <h2 className="text-2xl text-center mb-8 text-yellow-400">Chi nhánh Bar Buddy</h2>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchesData.map((branch, index) => (
          <BranchCard key={index} branch={branch} />
        ))}
      </div>
    </section>
  );
};

function HomePage() {
  return (
    <main className="self-center bg-black w-full mx-auto">
      <div className="flex flex-row items-start grow">
        <div className="flex flex-col w-3/4">
          <BarBuddyBranches />
          <BarBuddyDrinks />
        </div>
        <aside className="flex flex-col w-1/4 ml-4 mt-10"> {/* Thêm mt-10 để căn ngang với BarBuddyBranches */}
          <LocationsList locations={branchesData} />
        </aside>
      </div>
    </main>
  );
}

export default HomePage;