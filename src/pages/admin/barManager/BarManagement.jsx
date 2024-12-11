import React, { useEffect, useState } from 'react';
import { ChevronRight, Search, Add } from '@mui/icons-material';
import { Button, Box, CircularProgress, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllBar } from 'src/lib/service/barManagerService';
import { message } from 'antd';

function BarManagement() {
  const navigate = useNavigate();
  const [barData, setBarData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);

  useEffect(() => {
    fetchBarData('');
  }, [currentPage, pageSize]);

  const fetchBarData = async (searchTerm = '') => {
    try {
      setLoading(true);
      const response = await getAllBar(currentPage, pageSize, searchTerm);
      
      if (response?.data?.data?.barResponses) {
        setBarData(response.data.data.barResponses);
        setTotalPages(response.data.data.totalPages);
      } else {
        setBarData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching bar data:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "Có lỗi xảy ra khi tải dữ liệu";
        message.error(errorMessage);
      } else if (error.request) {
        message.error("Không thể kết nối đến server");
      } else {
        message.error("Có lỗi xảy ra trong quá trình xử lý");
      }

      setBarData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleChevronClick = (barId) => {
    navigate(`/admin/barProfile/${barId}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchBarData(search);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const AddBarHandle = () => {
    navigate("/admin/addbar");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredBars = barData;

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between ml-4 mr-4 mt-6 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán"
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
            />
            <button 
              onClick={handleSearchClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search />
            </button>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              className="px-3 py-2 bg-white rounded-md border border-sky-900 shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
              onChange={handleFilterChange}
              value={filterStatus}
            >
              <option value="ALL">Tất Cả</option>
              <option value="Active">Hoạt Động</option>
              <option value="Inactive">Không Hoạt Động</option>
            </select>
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
                border: '1px solid rgb(12 74 110)',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: 'rgb(243 244 246)',
                },
              }}
            >
              THÊM QUÁN BAR
            </Button>
          </div>
        </div>

        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
          <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">Danh Sách Chi Nhánh</h2>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-black">
                <thead>
                  <tr className="grid grid-cols-10 gap-3 items-center py-4 px-5 font-bold bg-neutral-200">
                    <th className="col-span-2 text-left">Tên Quán</th>
                    <th className="col-span-3 text-left">Địa chỉ</th>
                    <th className="col-span-2 text-center">Số điện thoại</th>
                    <th className="col-span-2 text-center">Trạng thái</th>
                    <th className="col-span-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBars.length > 0 ? (
                    filteredBars.map((bar, index) => (
                      <tr key={bar.barId} className={`grid grid-cols-10 gap-3 py-3 px-5 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
                        <td className="col-span-2 truncate">{bar.barName}</td>
                        <td className="col-span-3 truncate">{bar.address}</td>
                        <td className="col-span-2 text-center">{bar.phoneNumber}</td>
                        <td className="col-span-2 flex justify-center">
                          <span className={`inline-flex justify-center items-center px-2 py-1 rounded-full text-white text-xs ${bar.status ? "bg-green-500" : "bg-red-500"}`}>
                            {bar.status ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="col-span-1 flex justify-center">
                          <button onClick={() => handleChevronClick(bar.barId)} className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                            <ChevronRight />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4 text-red-500">Không tìm thấy quán bar nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredBars.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default BarManagement;
