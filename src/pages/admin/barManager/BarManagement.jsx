import React, { Fragment, useState } from 'react';
import { getBarData } from '../../../lib/service/barManagerService';
import { ChevronRight, Search } from '@mui/icons-material';
import { TextField, Button, Box } from '@mui/material'; // Import MUI components
import { useNavigate } from 'react-router-dom';

function BarManagement() {
  const barData = getBarData();
  const redirect = useNavigate();

  const handleChevronClick = (index) => {
    redirect("/admin/barProfile");
  };

  const [search, setSearch] = useState('');
  const [listSearchBar, setListSearchBar] = useState(barData);

  const SearchBarHandler = () => {
    const result = barData?.filter((bar) =>
      bar?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setListSearchBar(result);
  };

  const AddBarHandle = () => {
    redirect("/admin/addbar");
  };

  return (
    <Fragment>
      <Box className="w-full p-3 border-b border-gray-300 mb-4"> {/* Separator line above search */}
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
              borderRadius: 2, // Rounded square corners
              padding: '10px 10px', // Adjust padding for square shape
              minWidth: '48px', // Minimum width to ensure square look
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
        {listSearchBar.map((bar, index) => (
          <div
            key={index}
            className="grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm font-aBeeZee"
          >
            <div>{bar.name}</div>
            <div className="col-span-2">{bar.address}</div>
            <div>{bar.phone}</div>
            <div>{bar.openTime}</div>
            <div>{bar.closeTime}</div>
            <div>
              <span
                className={`flex justify-center items-center w-20 px-2 py-1 rounded-full text-white ${bar.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
              >
                {bar.status}
              </span>
            </div>
            <div
              className="justify-self-end cursor-pointer"
              onClick={() => handleChevronClick(index)}
            >
              <ChevronRight />
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

export default BarManagement;
