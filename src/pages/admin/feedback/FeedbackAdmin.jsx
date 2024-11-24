import React, { useEffect, useState } from "react";
import { Pagination, Stack, Button, CircularProgress, Switch } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import Star from "@mui/icons-material/Star";
import StarOutline from "@mui/icons-material/StarOutline";
import { getAllFeedbackByAdmin, UpdateStatusFeedBack } from "../../../lib/service/FeedbackService";
import { getAllBar } from "../../../lib/service/barManagerService";
import { toast } from 'react-toastify';

const FeedbackAdmin = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for filter
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch branches
  useEffect(() => {
    const fetchBarBranches = async () => {
      try {
        const response = await getAllBar();
        if (Array.isArray(response?.data?.data)) {
          setBranches(response.data.data);
        } else {
          console.error('Data received is not an array:', response.data);
          setBranches([]);
        }
      } catch (error) {
        console.error('Error fetching bar branches:', error);
        setBranches([]);
      }
    };

    fetchBarBranches();
  }, []);

  const handleChevronClick = (feedback) => {
    setSelectedFeedback(feedback);
    setShowPopup(true);
  };

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

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await getAllFeedbackByAdmin(selectedBranch, selectedStatus, currentPage, itemsPerPage);
      setFeedbackData(response.data.response);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchFeedback khi component được mount lần đầu hoặc khi currentPage thay đổi
  useEffect(() => {
    fetchFeedback();
  }, [currentPage]);

  // Hàm để cập nhật trạng thái feedback
  const handleUpdateStatus = async () => {
    if (selectedFeedback) {
      setUpdating(true);
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
        setUpdating(false);
      }
    }
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        {/* Filter Section */}
        <div className="flex justify-end gap-4 mb-6 text-base text-black">
          <div className="relative mt-1">
            <select
              value={selectedBranch === null ? "all" : selectedBranch}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBranch(value === "all" ? null : value);
              }}
              className="px-3 py-1 bg-white rounded-md border border-black shadow-sm text-sm transition-all duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 focus:outline-none"
            >
              <option value="all">Tất cả chi nhánh</option>
              {Array.isArray(branches) && branches.map((branch) => (
                <option key={branch.barId} value={branch.barId}>
                  {branch.barName}
                </option>
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

        <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">Danh Sách Đánh Giá</h2>

        {/* Table Headers */}
        <div className="grid grid-cols-8 gap-3 items-center py-4 px-5 text-sm font-bold text-black bg-gray-100 rounded-t-lg">
          <div className="text-center">Điểm</div>
          <div className="text-center">Nội dung</div>
          <div className="text-center">Ngày tạo</div>
          <div className="text-center">Ngày chỉnh sửa</div>
          <div className="text-center">Bởi</div>
          <div className="text-center">Chi nhánh</div>
          <div className="text-center">Trạng thái</div>
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
              className={`grid grid-cols-8 gap-3 py-3 px-5 items-center text-sm text-black ${index % 2 === 1 ? "bg-white" : "bg-orange-50"}`}
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
              <div className="flex justify-center">
                <span
                  className={`flex justify-center items-center w-32 px-2 py-1 rounded-full text-white text-sm font-notoSansSC ${
                    row.isDeleted ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {row.isDeleted ? "Đang ẩn" : "Đang hiển thị"}
                </span>
              </div>
              <div
                className="justify-self-end cursor-pointer"
                onClick={() => handleChevronClick(row)}
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
            onChange={(event, value) => setCurrentPage(value)}
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
              <div className="flex mt-1">{renderStars(selectedFeedback.rating)}</div>
            </div>
            <div className="mb-2">
              <strong>Nội dung:</strong>
              <textarea
                value={selectedFeedback.comment}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md resize-none mt-1"
                rows={4}
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
            <div className="mb-2 flex items-center space-x-2">
              <strong>Trạng thái:</strong>
              <Switch
                checked={!selectedFeedback.isDeleted}
                onChange={() => {
                  setSelectedFeedback((prev) => ({
                    ...prev,
                    isDeleted: !prev.isDeleted,
                  }));
                }}
                color="primary"
              />
              <span className="text-center">{selectedFeedback.isDeleted ? "Đang ẩn" : "Đang hiển thị"}</span>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-400 text-white py-3 w-48 rounded-full"
                onClick={() => setShowPopup(false)}
              >
                Đóng
              </button>
              <button
                className="bg-blue-600 text-white py-3 w-48 rounded-full flex items-center justify-center"
                onClick={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? <CircularProgress size={24} color="inherit" /> : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default FeedbackAdmin;
