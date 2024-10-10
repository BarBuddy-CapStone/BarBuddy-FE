import React, { useEffect, useState } from "react";
import { Pagination, Stack, Button, CircularProgress, Switch } from "@mui/material"; // Import CircularProgress và Switch từ MUI
import ChevronRight from "@mui/icons-material/ChevronRight"; // Correct import
import { useNavigate } from "react-router-dom"; // For navigation
import Star from "@mui/icons-material/Star"; // Import filled star icon
import StarOutline from "@mui/icons-material/StarOutline"; // Import empty star icon
import { getAllFeedbackByAdmin, UpdateStatusFeedBack } from "../../../lib/service/FeedbackService"; // Import service
import { getAllBar } from "../../../lib/service/barManagerService"; // Import service
import { toast } from 'react-toastify'; // Thêm import cho toast

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]); // State to hold feedback data
  const [totalPages, setTotalPages] = useState(1); // State to hold total pages
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items per page

  // State for filter
  const [selectedBranch, setSelectedBranch] = useState(null); // State for selected branch (null for all)
  const [selectedStatus, setSelectedStatus] = useState(null); // State for selected status (null for all)
  const [branches, setBranches] = useState([]); // State to hold branches
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [selectedFeedback, setSelectedFeedback] = useState(null); // State to hold selected feedback for popup
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [updating, setUpdating] = useState(false); // State để theo dõi trạng thái cập nhật

  // Fetch branches
  useEffect(() => {
    const fetchBarBranches = async () => {
      try {
        const response = await getAllBar();
        setBranches(response.data.data);
      } catch (error) {
        console.error('Error fetching bar branches:', error);
      }
    };

    fetchBarBranches();
  }, []);

  const handleChevronClick = (feedback) => {
    setSelectedFeedback(feedback); // Set selected feedback
    setShowPopup(true); // Show the popup
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="text-yellow-500" />); // Filled star
      } else {
        stars.push(<StarOutline key={i} className="text-yellow-500" />); // Empty star
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
      hour12: false, // 24-hour format
    });
  };

  const fetchFeedback = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await getAllFeedbackByAdmin(selectedBranch, selectedStatus, currentPage, itemsPerPage); // Thêm tham số lọc vào API
      setFeedbackData(response.data.response); // Set feedback data
      setTotalPages(response.data.totalPage); // Set total pages
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Gọi fetchFeedback khi component được mount lần đầu hoặc khi currentPage thay đổi
  useEffect(() => {
    fetchFeedback(); // Gọi hàm fetchFeedback với barId và status mặc định là null
  }, [currentPage]); // Chạy lại khi currentPage thay đổi

  // Hàm để cập nhật trạng thái feedback
  const handleUpdateStatus = async () => {
    if (selectedFeedback) {
      setUpdating(true); // Bắt đầu loading
      try {
        const currentStatus = !selectedFeedback.isDeleted; 
        await UpdateStatusFeedBack(selectedFeedback.feedbackId, !currentStatus); 
        setSelectedFeedback((prev) => ({
          ...prev,
          isDeleted: !currentStatus, 
        }));
        toast.success("Trạng thái đã được cập nhật thành công!"); 

        fetchFeedback(); 
      } catch (error) {
        console.error("Error updating feedback status:", error);
        toast.error("Cập nhật trạng thái thất bại!"); 
      } finally {
        setUpdating(false); // Kết thúc loading
      }
    }
  };

  return (
    <div className="bg-white flex justify-center px-4">
      <div className="w-full max-w-6xl mb-8">
        {/* Filter Section */}
        <div className="flex justify-end gap-4 mt-8 mb-6 text-base text-black">
          <div className="relative mt-1">
            <select
              value={selectedBranch === null ? "all" : selectedBranch} // Hiển thị "Tất cả chi nhánh" nếu selectedBranch là null
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBranch(value === "all" ? null : value); // Cập nhật giá trị cho selectedBranch
                // Không gọi fetchFeedback ở đây
              }}
              className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
            >
              <option value="all">Tất cả chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.barId} value={branch.barId}>{branch.barName}</option>
              ))}
            </select>
          </div>
          <div className="relative mt-1">
            <select
              value={selectedStatus === null ? "all" : selectedStatus.toString()}
              onChange={(e) => {
                const value = e.target.value;
                let newStatus;
                if (value === "all") {
                  newStatus = null;
                } else if (value === "true") {
                  newStatus = true;
                } else if (value === "false") {
                  newStatus = false;
                }
                setSelectedStatus(newStatus);
              }}
              className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="false">Đang hiển thị</option>
              <option value="true">Đang ẩn</option>
            </select>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentPage(1);
              fetchFeedback(selectedBranch, selectedStatus);
            }}
          >
            Xem
          </Button>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-8 gap-3 items-center py-4 px-5 text-sm font-bold text-black bg-white">
          <div className="text-center">Điểm</div>
          <div className="text-center">Nội dung</div>
          <div className="text-center">Ngày tạo</div>
          <div className="text-center">Ngày chỉnh sửa</div>
          <div className="text-center">Bởi</div>
          <div className="text-center">Chi nhánh</div>
          <div className="text-center">Trạng thái</div>
          <div></div> {/* Placeholder for ChevronRight Icon */}
        </div>

        {/* Table Data */}
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress /> {/* Hiển thị spinner */}
          </div>
        ) : feedbackData.length === 0 ? (
          <div className="text-red-500 text-center py-4">Không có đánh giá</div>
        ) : (
          feedbackData.map((row, index) => (
            <div
              key={row.feedbackId} // Use feedbackId as key
              className={`grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm text-black ${index % 2 === 1 ? "bg-white" : "bg-orange-50"}`} // Màu xen kẽ
            >
              <div className="flex items-center justify-center"> {/* Căn giữa nội dung */}
                {renderStars(row.rating)} {/* Render star rating */}
              </div>
              <div className="text-center truncate max-w-xs">{row.comment}</div> {/* Căn giữa nội dung và thêm class truncate */}
              <div className="text-center">
                <span>{formatDate(row.createdTime)}</span> {/* Định dạng thời gian */}
              </div>
              <div className="text-center">
                <span>{formatDate(row.lastUpdatedTime)}</span> {/* Định dạng thời gian */}
              </div>
              <div className="text-center truncate max-w-xs">{row.customerName}</div> {/* Căn giữa nội dung */}
              <div className="text-center truncate max-w-xs">{row.barName}</div> {/* Căn giữa nội dung */}
              <div className="flex justify-center"> {/* Căn giữa hình viên thuốc */}
                <span
                  className={`flex justify-center items-center w-32 px-2 py-1 rounded-full text-white text-sm font-notoSansSC ${
                    row.isDeleted ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {row.isDeleted ? "Đang ẩn" : "Đang hiển thị"}
                </span>
              </div>
              {/* ChevronRight Icon for navigating */}
              <div
                className="justify-self-end cursor-pointer"
                onClick={() => handleChevronClick(row)} // Gọi hàm với đối tượng feedback
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
            onChange={(event, value) => setCurrentPage(value)} // Update current page
            color="primary"
          />
        </Stack>
      </div>

      {/* Popup for feedback details */}
      {showPopup && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Chi tiết Đánh Giá</h2>
            <div className="mb-2">
              <strong>Điểm:</strong>
              <div className="flex mt-1">{renderStars(selectedFeedback.rating)}</div> {/* Hiển thị sao */}
            </div>
            <div className="mb-2">
              <strong>Nội dung:</strong>
              <textarea
                value={selectedFeedback.comment}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md resize-none mt-1" // Thêm class resize-none để không cho phép thay đổi kích thước
                rows={4} // Số hàng mặc định
              />
            </div>
            <div className="mb-2">
              <strong>Ngày tạo:</strong>
              <input
                type="text"
                value={formatDate(selectedFeedback.createdTime)}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div className="mb-2">
              <strong>Ngày chỉnh sửa:</strong>
              <input
                type="text"
                value={formatDate(selectedFeedback.lastUpdatedTime)}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div className="mb-2">
              <strong>Bởi:</strong>
              <input
                type="text"
                value={selectedFeedback.customerName}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div className="mb-2">
              <strong>Chi nhánh:</strong>
              <input
                type="text"
                value={selectedFeedback.barName}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
              />
            </div>
            <div className="mb-2 flex items-center space-x-2"> {/* Sử dụng space-x-2 để tạo khoảng cách đồng đều */}
              <strong>Trạng thái:</strong>
              <Switch
                checked={!selectedFeedback.isDeleted} // Nếu isDeleted là true, switch sẽ không được bật
                onChange={() => {
                  // Cập nhật trạng thái khi toggle
                  setSelectedFeedback((prev) => ({
                    ...prev,
                    isDeleted: !prev.isDeleted,
                  }));
                }}
                color="primary"
              />
              <span className="text-center">{selectedFeedback.isDeleted ? "Đang ẩn" : "Đang hiển thị"}</span> {/* Căn giữa chữ */}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={handleUpdateStatus} // Gọi hàm cập nhật trạng thái
              >
                {updating ? <CircularProgress size={24} color="inherit" className="mr-2" /> : null} {/* Hiển thị spinner khi đang cập nhật */}
                Lưu
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-blue-700 ml-2"
                onClick={() => setShowPopup(false)} // Đóng pop-up
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;