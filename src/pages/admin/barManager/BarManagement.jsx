import React, { Fragment, useEffect, useState } from 'react';
import { ChevronRight, Search, Add } from '@mui/icons-material';
import { Button, Box, CircularProgress } from '@mui/material'; // Import MUI components
import { useNavigate } from 'react-router-dom';
import { getAllBar } from 'src/lib/service/barManagerService';

function BarManagement() {
  const redirect = useNavigate();

  const handleChevronClick = (barId) => {
    redirect(`/admin/barProfile?barId=${barId}`);
  };

  const [barData, setBarData] = useState([]);  // Initial state for all bar data
  const [search, setSearch] = useState('');  // State for search input
  const [listSearchBar, setListSearchBar] = useState([]);  // State for filtered search results
  const [loading, setLoading] = useState(false);  // Loading state

  // Fetch bar data on component mount
  useEffect(() => {
    const fetchBarData = async () => {
      try {
        setLoading(true);  // Start loading indicator
        const response = await getAllBar();
        
        const bars = response?.data?.data || [];
        setBarData(bars);
        setListSearchBar(bars);
      } catch (error) {
        console.error("Error fetching bar data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarData();
  }, []);

  const SearchBarHandler = () => {
    const result = barData?.filter((bar) =>
      bar?.barName?.toLowerCase().includes(search?.toLowerCase())
    );
    setListSearchBar(result);
  };

  const AddBarHandle = () => {
    redirect("/admin/addbar");
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between ml-4 mr-4 mt-6 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
            />
            <button
              onClick={SearchBarHandler}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sky-900"
            >
              <Search />
            </button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              variant="contained"
              color="primary"
              onClick={AddBarHandle}
              startIcon={<Add />}
              sx={{
                borderRadius: 2,
                padding: '8px 16px',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid rgb(12 74 110)', // sky-900
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: 'rgb(243 244 246)', // gray-100
                },
              }}
            >
              THÊM QUÁN BAR
            </Button>
          </div>
        </div>

        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="flex flex-col overflow-hidden mt-4 w-full text-small bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-8 gap-3 items-center py-4 px-5 font-bold font-notoSansSC bg-gray-200 text-center">
                <div>Tên Quán</div>
                <div className="col-span-2">Địa chỉ</div>
                <div>Số điện thoại</div>
                <div>Giờ mở cửa</div>
                <div>Giờ đóng cửa</div>
                <div>Trạng thái</div>
                <div></div>
              </div>
              {Array.isArray(listSearchBar) && listSearchBar.length > 0 ? (
                listSearchBar.map((bar) => (
                  <div
                    key={bar.barId}
                    className="grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm font-aBeeZee text-center"
                  >
                    <div>{bar.barName}</div>
                    <div className="col-span-2">{bar.address}</div>
                    <div>{bar.phoneNumber}</div>
                    <div>{bar.startTime}</div>
                    <div>{bar.endTime}</div>
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex justify-center items-center w-20 px-2 py-1 rounded-full text-white ${bar.status === true ? "bg-green-500" : "bg-red-500"}`}
                      >
                        {bar.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div
                      className="flex justify-center cursor-pointer"
                      onClick={() => handleChevronClick(bar.barId)}
                    >
                      <ChevronRight />
                    </div>
                  </div>
                ))
              ) : (
                <Box className="p-4 text-center">No bars found.</Box>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BarManagement;
