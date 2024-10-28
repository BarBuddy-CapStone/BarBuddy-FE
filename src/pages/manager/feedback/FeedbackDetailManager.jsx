import React, { useState, useEffect } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useParams } from "react-router-dom";
import { getAllFeedbackByID } from "src/lib/service/FeedbackService";
import { CircularProgress } from "@mui/material";
import Star from "@mui/icons-material/Star";
import StarOutline from "@mui/icons-material/StarOutline";

function FeedbackDetailManager() {
  const navigate = useNavigate();
  const { feedbackId } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbackDetail = async () => {
      try {
        const response = await getAllFeedbackByID(feedbackId);
        // Kiểm tra cấu trúc response đúng
        if (response?.data?.data) {
          setFeedback(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackDetail();
  }, [feedbackId]);

  const handleBack = () => {
    navigate(-1);
  };

  // Function to render star rating - giống như trong FeedbackManager
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

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const inputFields = [
    { 
      label: "Điểm", 
      value: feedback?.rating || 0,
      render: true
    },
    { label: "Nội dung", value: feedback?.comment || "" },
    { label: "Bởi", value: feedback?.accountName || "" },
    { label: "Chi nhánh", value: feedback?.barName || "" },
    { 
      label: "Ngày tạo", 
      value: feedback?.createdTime ? formatDate(feedback.createdTime) : ""
    },
    { 
      label: "Ngày chỉnh sửa", 
      value: feedback?.lastUpdatedTime ? formatDate(feedback.lastUpdatedTime) : ""
    }
  ];

  return (
    <main className="flex flex-col items-center justify-center mt-9 w-full px-5">
      <header className="flex items-center gap-4 mb-8 text-2xl font-semibold text-black w-full max-w-lg">
        <div className="cursor-pointer" onClick={handleBack}>
          <ChevronLeftIcon fontSize="large" />
        </div>
        <h1 className="flex-grow text-center font-notoSansSC">Nội Dung Đánh Giá</h1>
      </header>

      <div className="space-y-6 w-full max-w-lg">
        {inputFields.map((field, index) => (
          <div key={index} className="flex justify-between items-center">
            <label className="w-1/3 text-base font-medium font-notoSansSC text-black">
              {field.label}
            </label>
            {field.render ? (
              <div className="w-2/3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 flex">
                {renderStars(field.value)}
              </div>
            ) : (
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-2/3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default FeedbackDetailManager;
