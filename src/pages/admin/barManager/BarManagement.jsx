import React, { Fragment, useEffect, useState } from 'react';
import { ChevronRight, Search } from '@mui/icons-material';
import { TextField, Button, Box, CircularProgress } from '@mui/material'; // Import MUI components
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
    <Fragment>
      {/* Search bar and buttons */}
      <Box className="w-full p-3 border-b border-gray-300 mb-4">
        <div className="flex items-center gap-2 max-w-full my-4">
          <TextField
            variant="outlined"
            label="Search Bar Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={SearchBarHandler}
            sx={{
              borderRadius: 2,
              padding: '10px 10px',
              minWidth: '48px',
            }}
          >
            <Search className='border-rad' />
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="text-lg italic"
            onClick={AddBarHandle}
          >
            THÊM QUÁN BAR
          </Button>
        </div>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="flex flex-col overflow-hidden mt-4 w-full text-small bg-white rounded-lg shadow-lg">
          <div className="grid grid-cols-8 gap-3 items-center py-4 px-5 font-bold font-notoSansSC bg-gray-200">
            <div>Tên Quán</div>
            <div className="col-span-2">Địa chỉ</div>
            <div>Số điện thoại</div>
            <div>Giờ mở cửa</div>
            <div>Giờ đóng cửa</div>
            <div>Trạng thái</div>
            <div></div> {/* Empty space for chevron icon */}
          </div>
          {Array.isArray(listSearchBar) && listSearchBar.length > 0 ? (
            listSearchBar.map((bar) => (
              <div
                key={bar.barId}
                className="grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm font-aBeeZee"
              >
                <div>{bar.barName}</div>
                <div className="col-span-2">{bar.address}</div>
                <div>{bar.phoneNumber}</div>
                <div>{bar.startTime}</div>
                <div>{bar.endTime}</div>
                <div>
                  <span
                    className={`flex justify-center items-center w-20 px-2 py-1 rounded-full text-white ${bar.status === true ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {bar.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <div
                  className="justify-self-end cursor-pointer"
                  onClick={() => handleChevronClick(bar.barId)}
                >
                  <ChevronRight />
                </div>
              </div>
            ))
          ) : (
            <Box className="p-4">No bars found.</Box>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default BarManagement;
