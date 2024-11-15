import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBar, getAllBarAvailable } from "src/lib/service/customerService";
import { Add, ArrowForward, Search } from "@mui/icons-material";
import { getAllDrinkCustomer } from "src/lib/service/managerDrinksService";
import { Button, Pagination, PaginationItem, TextField } from "@mui/material";
import { LoadingSpinner } from 'src/components';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GoongMap } from 'src/lib';

const BranchCard = React.memo(({ branch, onClick, selectedDate }) => {
  const rating = useMemo(
    () =>
      branch.feedBacks.length > 0
        ? (
          branch.feedBacks.reduce(
            (acc, feedback) => acc + feedback.rating,
            0
          ) / branch.feedBacks.length
        ).toFixed(1)
        : 0,
    [branch.feedBacks]
  );

  const reviews = branch.feedBacks.length;

  const getOpeningHours = () => {
    const daySchedule = branch.barTimeResponses.find(
      (time) => time.dayOfWeek === new Date(selectedDate).getDay()
    );
    return daySchedule
      ? `${daySchedule.startTime.slice(0, 5)} - ${daySchedule.endTime.slice(0, 5)}`
      : "Không có thông tin";
  };

  return (
    <div
      onClick={onClick}
      className="bg-neutral-700 text-white rounded-lg shadow-md overflow-hidden w-full max-w-[300px] transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img
        src={
          branch.images === "default"
            ? "https://giayphepkinhdoanh.vn/wp-content/uploads/2023/10/mo-quan-bar-pub-can-xin-nhung-loai-giay-phep-nao.jpg"
            : branch.images
        }
        alt={branch.barName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg text-yellow-500 font-bold mb-2">
          {branch.barName}
        </h3>

        <div className="text-orange-400">
          <span className="text-gray-400"><img
            src={
              branch.isAnyTableAvailable
                ? "https://img.icons8.com/?size=100&id=60362&format=png&color=40C057"
                : "https://img.icons8.com/?size=100&id=60362&format=png&color=FA5252"
            }
            alt={branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}
            className="inline-block w-4 h-4 mr-2"
          /></span>
          <span className="text-sm text-white">{branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}</span>
        </div>

        <div className="text-orange-400 mb-2">
          <span className="text-sm">Đánh giá: {rating}</span>
          <span className="ml-2 text-gray-400">({reviews} reviews)</span>
        </div>
        <p className="text-sm mb-2 inline-block">
          <span className="text-orange-400">Địa chỉ:</span> {branch.address}
        </p>
        <p className="text-sm break-words inline-block">
          <span className="text-orange-400">Thời gian mở cửa - đóng cửa:</span>{" "}
          {getOpeningHours()}
        </p>
      </div>
    </div>
  );
});

const LocationsList = React.memo(({ locations }) => (
  <div className="bg-neutral-700 shadow-lg text-white p-4 rounded-lg w-full max-w-[300px] mx-auto"> {/* Limit width */}
    <h2 className="text-center text-lg font-semibold mb-4 border-b border-yellow-500 pb-2">
      Tất cả chi nhánh
    </h2>
    <ul className="space-y-2">
      {locations.map((location, index) => (
        <li key={index} className="flex items-start">
          <span className="mr-2 text-sm">📍</span>
          <span className="break-words text-sm">
            {location.barName}, {location.address}
          </span>
        </li>
      ))}
    </ul>
  </div>
));

const BarBuddyBranches = ({ onBranchesLoaded, onBarClick }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchBranches = useCallback(async (searchTerm = search, page = pageIndex, size = pageSize) => {
    setLoading(true);
    try {
      const response = await getAllBar(searchTerm, page, size);
      if (response.data.statusCode === 200) {
        setBranches(response.data.data);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.totalCount / size));
        setTotalItems(response.data.totalCount || response.data.data.length);
        onBranchesLoaded(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, [onBranchesLoaded, pageSize]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCardClick = useCallback((barId) => {
    onBarClick(barId);
  }, [onBarClick]);

  const handlePageChange = (event, value) => {
    setPageIndex(value);
    fetchBranches(search, value, pageSize);
  };

  const handleSearch = () => {
    setPageIndex(1);
    fetchBranches(search, 1, pageSize);
  };

  const isFirstPage = pageIndex === 1;
  const isLastPage = pageIndex === totalPages;
  const isLastPageWithLessThanSixItems = isLastPage && totalItems <= (pageIndex - 1) * pageSize + branches.length;

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-10 mt-10 px-10 py-8">
      <div className="flex justify-between">
        <h2 className="text-2xl text-start mb-8 text-yellow-400">
          Tất cả chi nhánh Bar Buddy
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between ml-4 mr-4 mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto ">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                borderRadius: 2,
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'black',
                border: '1px solid rgb(12 74 110)',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: '#d97706',
                },
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch, index) => (
          <BranchCard
            key={index}
            branch={branch}
            onClick={() => handleCardClick(branch.barId)}
            selectedDate={new Date().toISOString().split('T')[0]}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          count={totalPages}
          page={pageIndex}
          onChange={handlePageChange}
          color="primary"
          size="large"
          variant="outlined"
          shape="rounded"
          disabled={branches.length === 0}
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={
                (item.type === 'previous' && isFirstPage) ||
                (item.type === 'next' && isLastPageWithLessThanSixItems) ||
                item.disabled
              }
            />
          )}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#fff',
              borderColor: '#f59e0b',
              '&:hover': {
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
              },
              '&.Mui-selected': {
                backgroundColor: '#f59e0b',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#d97706',
                },
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                pointerEvents: 'none',
              },
            },
          }}
        />
      </div>
    </section>
  );
};

const BarBuddyBranchesAvailable = ({ onBranchesLoaded, onBarClick }) => {
  const [branchesAvailable, setBranchesAvailable] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const fetchBranchesAvailable = useCallback(async (searchTerm = searchAvailable, date = selectedDate) => {
    setLoadingAvailable(true);
    try {
      const response = await getAllBarAvailable(date.toISOString().split('T')[0]);
      if (response.data.statusCode === 200) {
        setBranchesAvailable(response.data.data);
        onBranchesLoaded(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingAvailable(false);
    }
  }, [onBranchesLoaded, selectedDate]);

  useEffect(() => {
    fetchBranchesAvailable();
  }, [selectedDate]);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    fetchBranchesAvailable(searchAvailable, newValue);
  };

  const handleCardClickAvailable = useCallback((barId) => {
    onBarClick(barId);
  }, [onBarClick]);

  const handleSearchAvailable = () => {
    fetchBranchesAvailable(searchAvailable);
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    return daysOfWeek[date.getDay()];
  };

  const today = new Date();
  const dayOfWeek = selectedDate.toDateString() === today.toDateString() ? "ngày hôm nay" : getDayOfWeek(selectedDate);

  if (loadingAvailable) return <div>Loading...</div>;

  return (
    <section className="w-full rounded-lg flex flex-col bg-neutral-800 ml-10 mb-10 mt-10 px-10 py-8">
      <div className="flex flex-col md:flex-row items-center justify-end ml-4 mr-4 mb-8 gap-4">
        <div className="flex"><label className="text-yellow-400 text-xs md:w-[124px]">Lọc chi nhánh quán bar theo ngày hoạt động:</label></div>
        <div className="flex items-center gap-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className="bg-white rounded"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>
        </div>
        <div className="border-l border-amber-400 border-solid h-8 mx-4"></div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm tên quán bar"
            value={searchAvailable}
            onChange={(e) => setSearchAvailable(e.target.value)}
            className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto ">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchAvailable}
            sx={{
              borderRadius: 2,
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'black',
              border: '1px solid rgb(12 74 110)',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              '&:hover': {
                backgroundColor: '#d97706',
              },
            }}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <h2 className="text-2xl text-start mb-8 text-yellow-400">
        {`Chi nhánh Bar Buddy hoạt động vào ${dayOfWeek}`}
      </h2>
      <div className="shrink-0 mb-4 h-px border border-amber-400 border-solid" />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branchesAvailable.map((branch, index) => (
          <BranchCard
            branch={branch}
            onClick={() => handleCardClickAvailable(branch.barId)}
            selectedDate={selectedDate.toISOString().split('T')[0]}
          />
        ))}
      </div>
    </section>
  );
};

function HomePage() {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await getAllBar();
        if (response.status === 200) {
          console.log("Fetched bars:", response.data.data);
          setBranches(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching bars:", error);
      }
    };
    fetchBars();
  }, []);

  const handleBarClick = useCallback((barId) => {
    setIsLoading(true);
    // Sử dụng Promise để đảm bảo loading spinner hiển thị trước khi chuyển trang
    new Promise(resolve => setTimeout(resolve, 1000))
      .then(() => {
        setIsLoading(false);
        navigate(`/bar-detail/${barId}`);
      });
  }, [navigate]);

  return (
    <main className="self-center bg-inherit w-full mx-auto overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-10 items-start gap-x-10 gap-y-6">
        <div className="col-span-7 w-full">
          <BarBuddyBranchesAvailable onBranchesLoaded={setBranches} onBarClick={handleBarClick} />
          <BarBuddyBranches onBranchesLoaded={setBranches} onBarClick={handleBarClick} />
        </div>
        <aside className="col-span-3 w-full lg:ml-8 mt-10 sticky top-4">
          <div className="bg-neutral-800 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl text-yellow-500 font-bold mb-2">Bản đồ chi nhánh</h2>
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-sm text-white">Vị trí của bạn</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span className="text-sm text-white">Chi nhánh</span>
              </div>
            </div>
            <div className="w-full rounded-lg overflow-hidden border border-gray-700">
              <GoongMap branches={branches} />
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              Nhấn vào marker để xem thông tin chi tiết
            </div>
          </div>

          <div className="bg-neutral-700 shadow-lg text-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-yellow-500 border-b border-yellow-500 pb-2">
              Tất cả chi nhánh
            </h2>
            <ul className="space-y-2">
              {branches.map((location, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-yellow-500">📍</span>
                  <span className="text-sm">
                    {location.barName}, {location.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <LoadingSpinner open={isLoading} />
    </main>
  );
}

export default HomePage;
