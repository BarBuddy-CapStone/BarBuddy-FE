import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBar, getBranchesData, getDrinkData } from 'src/lib/service/customerService';
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { getAllDrinkCustomer } from 'src/lib/service/managerDrinksService';


const BranchCard = React.memo(({ branch, onClick }) => {
  const rating = useMemo(() => (
    branch.feedBacks.length > 0
      ? (branch.feedBacks.reduce((acc, feedback) => acc + feedback.rating, 0) / branch.feedBacks.length).toFixed(1)
      : 0
  ), [branch.feedBacks]);

  const reviews = branch.feedBacks.length;

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/bar-detail?barId=${branch.barId}`)}
      className="bg-neutral-700 text-white rounded-lg shadow-md overflow-hidden max-w-[300px] transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img src={branch.images === 'default' ? "https://giayphepkinhdoanh.vn/wp-content/uploads/2023/10/mo-quan-bar-pub-can-xin-nhung-loai-giay-phep-nao.jpg" : branch.images} alt={branch.barName} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg text-yellow-500 font-bold mb-2">{branch.barName}</h3>
        <div className="text-orange-400 mb-2">
          <span className="text-sm">Đánh giá: {rating}</span>
          <span className="ml-2 text-gray-400">({reviews} reviews)</span>
        </div>
        <p className="text-sm mb-2 inline-block h-[45px]"><span className='text-orange-400'>Địa chỉ:</span> {branch.address}</p>
        <p className="text-sm break-words inline-block h-[45px]"><span className='text-orange-400'>Thời gian mở cửa - đóng cửa:</span> {branch.startTime.slice(0, 5)} - {branch.endTime.slice(0, 5)}</p>
      </div>
    </div>
  );
});

const LocationsList = React.memo(({ locations }) => (
  <div className="rounded-md bg-neutral-700 shadow-[0px_0px_16px_rgba(0,0,0,0.1)] text-white p-6 rounded-lg w-[65%] mx-auto">
    <h2 className="text-center text-xl font-semibold mb-4 border-b border-yellow-500 pb-2">
      All Locations
    </h2>
    <ul className="space-y-4">
      {locations.map((location, index) => (
        <li key={index} className="flex items-center">
          <span className="mr-2 text-sm">📍</span>
          <span className='break-words text-sm'>{location.barName}, {location.address}</span>
        </li>
      ))}
    </ul>
  </div>
));

const DrinkCard = React.memo(({ images, drinkName, price, drinkId }) => {
  const redirect = useNavigate();
  const drinkDetailHandle = () => {
    redirect(`/drinkDetail?drinkId=${drinkId}`)
  }

  return (
    <div className="flex flex-col px-2.5 py-3 w-1/6 flex-shrink-0 max-md:w-full transition-transform transform hover:scale-105">
      <div className="flex flex-col grow items-center w-full text-center rounded-xl bg-neutral-700 max-md:mt-7">
        <img
          loading="lazy"
          src={images}
          alt={drinkName}
          className="object-contain self-stretch max-h-45 rounded-md aspect-[0.84]"
        />
        <button onClick={drinkDetailHandle}>
          <h3 className="mt-1.5 text-base leading-7 text-zinc-100">{drinkName}</h3>
        </button>
        <p className="mt-1 text-sm leading-snug text-amber-400">{price}</p>
      </div>
    </div>
  )
});

const BarBuddyDrinks = React.memo(() => {
  const [drinkData, setDrinkData] = useState([]);
  const redirect = useNavigate();
  useEffect(() => {
    const dataFetchDrink = async () => {
      const response = await getAllDrinkCustomer();
      const dataFetch = response?.data?.data;
      setDrinkData(dataFetch);
    };
    dataFetchDrink();
  }, []);

  const infiniteData = useMemo(() => {
    return [...drinkData, ...drinkData, ...drinkData];
  }, [drinkData]);

  const viewDrinkHandle = () => {
      redirect(`/drinkList`)
  } 

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-20 px-10 py-5">
      <header className="flex flex-wrap gap-3 justify-between w-full leading-snug">
        <h2 className="text-2xl text-amber-400">Đồ uống toàn chi nhánh</h2>
        <div className="flex gap-5 my-auto text-xl text-gray-200 cursor-pointer hover:text-amber-400">
          <button onClick={viewDrinkHandle}>
            <span className="basis-auto">
              Xem tất cả <ArrowForward className="mb-1" />
            </span>
          </button>
        </div>
      </header>
      <div className="shrink-0 mt-4 h-px border border-amber-400 border-solid max-md:max-w-full" />
      <div className="mt-5 max-md:max-w-full overflow-hidden relative">
        <div className="flex items-center animate-scroll gap-0">
          {infiniteData.map((drink, index) => (
            <DrinkCard key={index} {...drink} />
          ))}
        </div>
      </div>
    </section>
  );
});

const BarBuddyBranches = ({ onBranchesLoaded }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      const data = await getAllBar();
      if (data.data.statusCode === 200) {
        setBranches(data.data.data);
        setLoading(false);
        onBranchesLoaded(data.data.data);
      }
    };
    fetchBranches();
  }, [onBranchesLoaded]);

  const handleCardClick = useCallback((barId) => {
    navigate(`/bar-detail?barId=${barId}`);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-20 mt-10 px-10 py-8">
      <h2 className="text-2xl text-start mb-8 text-yellow-400">Chi nhánh Bar Buddy</h2>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => (
          <BranchCard key={index} branch={branch} onClick={() => handleCardClick(branch.barId)} />
        ))}
      </div>
    </section>
  );
};

function HomePage() {
  const [branches, setBranches] = useState([]);

  return (
    <main className="self-center bg-inherit w-full mx-auto">
      <div className="grid grid-cols-10 items-start grow">
        <div className="col-span-7 w-full">
          <BarBuddyBranches onBranchesLoaded={setBranches} />
          <BarBuddyDrinks />
        </div>
        <aside className="col-span-3 w-full ml-4 mt-10">
          <LocationsList locations={branches} />
        </aside>
      </div>
    </main>
  );
}

export default HomePage;