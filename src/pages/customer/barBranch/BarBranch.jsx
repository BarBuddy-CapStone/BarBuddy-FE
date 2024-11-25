import { Button, Pagination } from "@mui/material";
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from 'src/components';
import { getAllBar } from "src/lib/service/customerService";

const BranchCard = React.memo(({ branch, onClick, selectedDate }) => {
  const rating = branch.feedBacks.length > 0
    ? (branch.feedBacks.reduce((acc, feedback) => acc + feedback.rating, 0) / branch.feedBacks.length).toFixed(1)
    : 0;

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
      className="bg-neutral-700 text-white rounded-lg shadow-md overflow-hidden w-full transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img
        src={branch.images === "default"
          ? "https://giayphepkinhdoanh.vn/wp-content/uploads/2023/10/mo-quan-bar-pub-can-xin-nhung-loai-giay-phep-nao.jpg"
          : branch.images}
        alt={branch.barName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg text-yellow-500 font-bold mb-2">
          {branch.barName}
        </h3>

        <div className="text-orange-400">
          <span className="text-gray-400">
            <img
              src={branch.isAnyTableAvailable
                ? "https://img.icons8.com/?size=100&id=60362&format=png&color=40C057"
                : "https://img.icons8.com/?size=100&id=60362&format=png&color=FA5252"
              }
              alt={branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}
              className="inline-block w-4 h-4 mr-2"
            />
          </span>
          <span className="text-sm text-white">{branch.isAnyTableAvailable ? "Còn bàn" : "Hết bàn"}</span>
        </div>

        <div className="text-orange-400 mb-2">
          <span className="text-sm">Đánh giá: {rating}</span>
          <span className="ml-2 text-gray-400">({reviews} reviews)</span>
        </div>
        <p className="text-sm mb-2">
          <span className="text-orange-400">Địa chỉ:</span> {branch.address}
        </p>
        <p className="text-sm">
          <span className="text-orange-400">Thời gian mở cửa - đóng cửa:</span>{" "}
          {getOpeningHours()}
        </p>
      </div>
    </div>
  );
});

const BarBranch = () => {
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
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCardClick = useCallback((barId) => {
    navigate(`/bar-detail/${barId}`);
  }, [navigate]);

  const handlePageChange = (event, value) => {
    setPageIndex(value);
    fetchBranches(search, value, pageSize);
  };

  const handleSearch = () => {
    setPageIndex(1);
    fetchBranches(search, 1, pageSize);
  };

  if (loading) return <LoadingSpinner open={loading} />;

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6 bg-inherit">
      <div className="bg-neutral-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-yellow-500 font-bold">Tất cả chi nhánh Bar Buddy</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm tên quán bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-sky-900 rounded-full"
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f59e0b',
                '&:hover': { backgroundColor: '#d97706' },
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            showFirstButton
            showLastButton
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
              },
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default BarBranch;