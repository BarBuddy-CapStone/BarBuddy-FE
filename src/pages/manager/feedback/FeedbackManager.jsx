import React, { useEffect, useState } from "react";
import { 
  Pagination, 
  Stack, 
  CircularProgress,
} from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Star from "@mui/icons-material/Star";
import StarOutline from "@mui/icons-material/StarOutline";
import Search from "@mui/icons-material/Search";
import { getAllFeedBackForManager } from "../../../lib/service/FeedbackService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../lib/hooks/useUserStore";
import { message } from "antd";

const FeedbackManager = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  // Get identityId from userInfo
  const { userInfo } = useAuthStore();
  const barId = userInfo?.identityId;

  // Function to render star rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="text-yellow-500" />);
      } else {
        stars.push(<StarOutline key={i} className="text-yellow-500" />);
      }
    }

    return stars;
  };

  // Function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });
  };

  const fetchFeedback = async (search = '') => {
    setLoading(true);
    try {
      const response = await getAllFeedBackForManager(
        barId,
        currentPage,
        itemsPerPage,
        search
      );
      
      console.log("API Response:", response);
      
      if (response?.data?.data?.managerFeedbackResponses) {
        setFeedbackData(response.data.data.managerFeedbackResponses);
        setTotalPages(response.data.data.totalPages);
      } else {
        setFeedbackData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      message.error(error.response?.data?.message || "Không thể tải danh sách đánh giá");
      setFeedbackData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset về trang 1 khi search
    fetchFeedback(searchTerm);
  };

  // Sửa lại useEffect
  useEffect(() => {
    fetchFeedback(searchTerm);
  }, [currentPage]); // Chỉ phụ thuộc vào currentPage

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewDetail = (feedbackId) => {
    navigate(`/manager/feedback/detail/${feedbackId}`);
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        {/* Thêm phần search */}
        <div className="flex justify-end gap-4 mb-6 text-base text-black">
          <div className="relative w-[300px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearchClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">
          Danh Sách Đánh Giá
        </h2>

        {/* Table Headers */}
        <div className="grid grid-cols-7 gap-3 items-center py-4 px-5 text-sm font-bold text-black bg-gray-100 rounded-t-lg">
          <div className="text-center">Điểm</div>
          <div className="text-center">Nội dung</div>
          <div className="text-center">Ngày tạo</div>
          <div className="text-center">Ngày chỉnh sửa</div>
          <div className="text-center">Bởi</div>
          <div className="text-center">Chi nhánh</div>
          <div></div>
        </div>

        {/* Table Data */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <CircularProgress />
          </div>
        ) : feedbackData.length === 0 ? (
          <div className="text-red-500 text-center py-4">Không có đánh giá</div>
        ) : (
          feedbackData.map((row, index) => (
            <div
              key={row.feedbackId}
              className={`grid grid-cols-7 gap-3 py-3 px-5 items-center text-sm text-black ${
                index % 2 === 1 ? "bg-white" : "bg-orange-50"
              }`}
            >
              <div className="flex items-center justify-center">
                {renderStars(row.rating)}
              </div>
              <div className="text-center truncate max-w-xs">{row.comment}</div>
              <div className="text-center">
                <span>{formatDate(row.createdTime)}</span>
              </div>
              <div className="text-center">
                <span>{formatDate(row.lastUpdatedTime)}</span>
              </div>
              <div className="text-center truncate max-w-xs">{row.customerName}</div>
              <div className="text-center truncate max-w-xs">{row.barName}</div>
              <div 
                className="justify-self-end cursor-pointer"
                onClick={() => handleViewDetail(row.feedbackId)} // Sử dụng feedbackId
              >
                <ChevronRight />
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </main>
  );
};

export default FeedbackManager;
