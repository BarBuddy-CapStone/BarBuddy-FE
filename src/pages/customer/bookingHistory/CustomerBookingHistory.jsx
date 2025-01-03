import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BookingService from "../../../lib/service/bookingService";
import { getAllFeedbackByBookingID, createFeedBack } from "../../../lib/service/FeedbackService";
import { addHours, addDays, isBefore } from "date-fns";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Pagination from "@mui/material/Pagination"; // Import MUI Pagination
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from '@mui/material/CircularProgress';

// Create a theme for MUI Pagination customization
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#FFBF00", // Amber color for active pagination
    },
    text: {
      primary: "#FFBF00", // Text color for page numbers
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#FFFFFF", // Default color for page numbers
          "&.Mui-selected": {
            backgroundColor: "#FFBF00", // Amber background for selected page
            color: "#000000", // Black text for the selected page
          },
          "&:hover": {
            backgroundColor: "#FFBF00", // Amber background on hover
            color: "#000000", // Black text on hover
          },
        },
      },
    },
  },
});

// Hàm định dạng thời gian
const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

// Hàm định dạng thời gian cho createdTime
const formatCreatedTime = (timeString) => {
    const createdDate = new Date(timeString);
    const hours = String(createdDate.getHours()).padStart(2, '0');
    const minutes = String(createdDate.getMinutes()).padStart(2, '0');
    const day = String(createdDate.getDate()).padStart(2, '0');
    const month = String(createdDate.getMonth() + 1).padStart(2, '0'); // Tháng 0-indexed
    const year = createdDate.getFullYear();
    
    return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Hàm kiểm tra xem booking có thể được đánh giá hay không (trong vòng 14 ngày)
function canReviewBooking(bookingDate) {
  const now = new Date();
  const bookingDateTime = new Date(bookingDate);
  const reviewDeadline = addDays(bookingDateTime, 14); // 14 ngày sau ngày đặt
  return isBefore(now, reviewDeadline);
}

function CustomerBookingHistory() {
  const { accountId } = useParams(); // Extract accountId from URL
  const navigate = useNavigate();

  // State to manage bookings, loading, error, pagination
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Total pages from API response
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const [cancellingBookingId, setCancellingBookingId] = useState(null); // To track the cancel action
  const [showConfirm, setShowConfirm] = useState(false); // To control the popup visibility
  const [selectedBookingId, setSelectedBookingId] = useState(null); // To know which booking is being canceled

  const [showRatingPopup, setShowRatingPopup] = useState(false); // Trạng thái cho popup đánh giá
  const [rating, setRating] = useState(0); // Trạng thái cho số sao
  const [comment, setComment] = useState(""); // Trạng thái cho bình luận
  const [feedback, setFeedback] = useState(null); // Trạng thái cho phản hồi
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // Trạng thái cho popup xem đánh giá

  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // Fetch bookings using pagination
  useEffect(() => {
    const fetchBookings = async (pageIndex = 1) => {
      try {
        const response = await BookingService.getAllBookings(
          accountId,
          null,
          pageIndex,
          5
        ); // Fetch bookings with pagination
        setBookings(response.data.data.response); // Set bookings from API response
        setTotalPages(response.data.data.totalPage); // Set total pages
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (accountId) {
      fetchBookings(currentPage);
    }
  }, [accountId, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page when pagination is changed
  };

  const handleCancelBooking = async (bookingId) => {
    setLoadingCancel(true);
    try {
      await BookingService.cancelBooking(bookingId);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: 1 } : booking
        )
      );
      toast.success("Đặt bàn đã được hủy thành công");
      setShowConfirm(false);
    } catch (error) {
      toast.error("Hủy đặt bàn thất bại");
      console.error("Error while canceling:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  const confirmCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId); // Save the bookingId to be canceled
    setShowConfirm(true); // Show the confirmation popup
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false); // Close confirmation popup without action
    setSelectedBookingId(null);
  };

  const handleRating = (bookingId) => {
    setShowRatingPopup(true);
    setSelectedBookingId(bookingId); // Lưu ID của booking để gửi đánh giá
  };

  const handleViewFeedback = async (bookingId) => {
    setLoadingFeedback(true);
    try {
      const response = await getAllFeedbackByBookingID(bookingId);
      setFeedback(response.data.data);
      setShowFeedbackPopup(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Không thể tải đánh giá. Vui lòng thử lại sau.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleCloseFeedbackPopup = () => {
    setShowFeedbackPopup(false);
    setFeedback(null);
  };

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5.");
      return;
    }
    if (comment.length < 10 || comment.length > 500) {
      toast.error("Bình luận phải có độ dài từ 10 đến 500 ký tự.");
      return;
    }

    setLoadingRating(true);
    try {
      const feedbackData = {
        bookingId: selectedBookingId,
        rating: rating,
        comment: comment,
      };
      await createFeedBack(feedbackData);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === selectedBookingId ? { ...booking, isRated: true } : booking
        )
      );
      toast.success("Đánh giá đã được gửi thành công!");
      setShowRatingPopup(false);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
      console.error("Error submitting rating:", error);
    } finally {
      setLoadingRating(false);
    }
  };

  const goBackToProfile = () => {
    navigate(`/profile/${accountId}`); // Navigating back to the profile page
  };

  // Cập nhật phần render để hiển thị loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress style={{ color: '#FFBF00' }} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  }

  return (
    <section
      className={`flex flex-col px-10 py-8 mx-auto w-full max-w-6xl rounded-md bg-neutral-800 shadow-md max-md:px-5 max-md:mt-10 ${
        bookings.length > 1 ? "min-h-[500px]" : "min-h-[300px]"
      }`}
    >
      <div className="flex justify-between items-center mb-8 relative">
        <button
          className="text-amber-400 flex items-center space-x-2 absolute left-0"
          onClick={goBackToProfile}
        >
          <ArrowBackIcon />
          <span>Quay lại</span>
        </button>

        <h2 className="text-3xl text-amber-400 text-center w-full">
          Lịch sử đặt bàn
        </h2>
      </div>
      <div className="border-t border-amber-500 mb-6" />

      <div className="space-y-4 flex-1">
        {bookings.length === 0 ? (
          <p className="text-red-500 text-center">Không có lịch đặt bàn</p>
        ) : (
          bookings.map((booking, index) => (
            <React.Fragment key={booking.bookingId}>
              {/* Navigate to booking detail page on click */}
              <div
                className="flex items-start justify-between cursor-pointer hover:bg-neutral-700 hover:shadow-lg transition duration-200 p-2 rounded-md"
                onClick={() => navigate(`/booking-detail/${booking.bookingId}`)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={
                      booking.image === "default"
                        ? "https://mia.vn/media/uploads/blog-du-lich/quan-bar-quan-1-Corner-1693730506.jpg"
                        : booking.image
                    }
                    alt={booking.barName}
                    className="w-32 h-24 rounded-md"
                  />

                  <div className="flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-white">
                        <span>Chi nhánh:</span>{" "}
                        <span className="text-gray-200 font-bold">
                          {booking.barName}
                        </span>
                      </p>
                      <p className="text-white">
                        <span>Trạng thái:</span>{" "}
                        <span
                          className={`${getStatusClass(
                            booking.status
                          )} font-bold`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </p>

                      <div className="flex items-center mt-3 text-gray-400">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a179329f01a0d94fa981d9a97b80efe684d3517b5221f1877e43248f64dc64ae"
                          alt="Date icon"
                          className="w-5 h-5 mr-2"
                        />
                        <p className="text-sm">
                          {formatBookingDate(
                            booking.bookingDate,
                            booking.bookingTime
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <p className="text-gray-400 text-sm mb-2">
                    {getTimeAgo(booking.createAt)}
                  </p>

                  {booking.status === 0 &&
                    canCancelBooking(
                      booking.bookingDate,
                      booking.bookingTime
                    ) && (
                      <button
                        className={`px-4 py-2 w-[120px] bg-amber-400 text-black rounded-full text-sm hover:bg-amber-500 transition duration-200`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to parent
                          confirmCancelBooking(booking.bookingId);
                        }}
                      >
                        Hủy đặt bàn
                      </button>
                    )}

                  {booking.status === 3 && (
                    booking.isRated ? (
                      <button
                        className="px-4 py-2 w-[120px] bg-amber-400 text-black rounded-full text-sm hover:bg-amber-500 transition duration-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to parent
                          handleViewFeedback(booking.bookingId);
                        }}
                        disabled={loadingFeedback}
                      >
                        {loadingFeedback ? (
                          <CircularProgress size={20} style={{ color: 'black' }} />
                        ) : (
                          "Xem đánh giá"
                        )}
                      </button>
                    ) : (
                      canReviewBooking(booking.bookingDate) && ( // Kiểm tra xem có thể đánh giá không
                        <button
                          className="px-4 py-2 w-[120px] bg-amber-400 text-black rounded-full text-sm hover:bg-amber-500 transition duration-200"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from propagating to parent
                            handleRating(booking.bookingId);
                          }}
                        >
                          Đánh giá
                        </button>
                      )
                    )
                  )}
                </div>
              </div>

              {index < bookings.length - 1 && (
                <div className="border-t border-amber-500 my-6" />
              )}
            </React.Fragment>
          ))
        )}
      </div>
      <div className="border-t border-amber-500 mt-6" />

      {/* Custom Pagination with MUI */}
      <div className="flex justify-center mt-6">
        <ThemeProvider theme={customTheme}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary" // Using custom theme color
          />
        </ThemeProvider>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-8 w-96 rounded-md shadow-2xl border border-neutral-800">
            <h2 className="text-xl mb-6 text-amber-400 text-center">
              Xác nhận hủy đặt bàn?
            </h2>
            <div className="flex justify-between space-x-4">
              {" "}
              {/* Added space-x-4 for spacing between buttons */}
              <button
                className="px-6 py-3 w-full bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                onClick={handleCloseConfirm} // Hủy button on the left
              >
                Hủy
              </button>
              <button
                className="px-6 py-3 w-full bg-amber-400 text-neutral-800 rounded-full hover:bg-amber-300 transition duration-200"
                onClick={() => handleCancelBooking(selectedBookingId)}
                disabled={loadingCancel}
              >
                {loadingCancel ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  "Xác nhận hủy"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup đánh giá */}
      {showRatingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-8 w-1/2 rounded-md shadow-2xl border border-neutral-800">
            <h2 className="text-xl font-semibold mb-6 text-amber-400 text-center">Đánh giá</h2>
            <div className="border-t border-amber-500 my-6" />
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-${index < rating ? 'amber-400' : 'gray-400'} text-2xl cursor-pointer`}
                  onClick={() => setRating(index + 1)} // Cập nhật số sao khi nhấn
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full p-2 bg-neutral-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Nhập bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)} // Cập nhật bình luận
            />
            <div className="flex justify-end mt-8">
              <button
                className="px-6 py-2 bg-gray-300 w-[140px] text-black rounded-full hover:bg-gray-400"
                onClick={() => setShowRatingPopup(false)} // Đóng popup
              >
                Đóng
              </button>
              <button
                className="px-6 py-2 bg-amber-400 w-[140px] text-black rounded-full hover:bg-amber-500 ml-6"
                onClick={handleSubmitRating}
                disabled={loadingRating}
              >
                {loadingRating ? (
                  <CircularProgress size={20} style={{ color: 'black' }} />
                ) : (
                  "Gửi đánh giá"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup xem đánh giá */}
      {showFeedbackPopup && feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-8 w-1/2 rounded-md shadow-2xl border border-neutral-800">
            <div className="flex">
              {/* Div chứa hình ảnh quán bar với tỉ lệ 16:9 */}
              <div className="flex-shrink-0 mb-2">
                <img
                  src={feedback.barImage || "default-image-url"}
                  alt={feedback.barName || "Bar Image"}
                  className="w-32 h-24 object-cover rounded-md"
                />
              </div>
              {/* Div chứa tên quán bar và địa chỉ */}
              <div className="ml-4 flex flex-col justify-center mb-2">
                <h2 className="text-lg text-amber-400">{feedback.barName || "N/A"}</h2>
                <p className="text-gray-400">{feedback.barAddress || "N/A"}</p>
                {/* Hiển thị giờ mở cửa và đóng cửa */}
                <p className="text-gray-400">
                  Giờ mở cửa: {formatTime(feedback.startTime)} - Giờ đóng cửa: {formatTime(feedback.endTime)}
                </p>
              </div>
            </div>
            <div className="border-t border-amber-500 my-4" />
            <div>
              <h2 className="text-lg text-amber-400">Đánh giá</h2>
              <div className="flex items-center mt-4">
                <img
                  src={feedback.customerAvatar || "default-avatar-url"}
                  alt={feedback.customerName || "Customer Avatar"}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-white">{feedback.customerName || "N/A"}</p>
                  <p className="text-gray-400">{formatCreatedTime(feedback.createdTime) || "N/A"}</p>
                </div>
              </div>
              <div className="flex mt-4">
                <span className="text-amber-400 mt-0.5 mr-2">Xếp hạng: </span>
                {/* Hiển thị sao vàng tương ứng với rating */}
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`text-${index < feedback.rating ? 'amber-400' : 'gray-400'} text-xl`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white mt-2"><span className="text-amber-400">Nội dung đánh giá:</span> {feedback.comment || "N/A"}</p>
            </div>
            {/* Căn chỉnh nút "Đóng" sang bên phải */}
            <div className="border-t border-amber-500 my-6" />
            <div className="flex justify-end mt-8">
            <button
                className="px-6 py-2 bg-amber-400 w-[150px] text-black rounded-full hover:bg-amber-500"
                onClick={handleCloseFeedbackPopup}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Helper function to format status text
function getStatusText(status) {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Đã hủy";
    case 2:
      return "Đang phục vụ";
    case 3:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
}

// Helper function to get status class for styling
function getStatusClass(status) {
  switch (status) {
    case 0:
      return "text-amber-400";
    case 1:
      return "text-rose-500";
    case 2:
      return "text-orange-500";
    case 3:
      return "text-emerald-600";
    default:
      return "text-gray-400";
  }
}

// Helper function to format booking date and time
function formatBookingDate(date, time) {
  const bookingDate = new Date(date);

  // Format date as dd/mm/yyyy
  const day = String(bookingDate.getDate()).padStart(2, "0");
  const month = String(bookingDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = bookingDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Format time as HH:MM (24-hour format)
  const [hours, minutes] = time.split(":");
  const formattedTime = `${hours}:${minutes}`; // Only taking hours and minutes from booking time

  return `${formattedDate} | ${formattedTime}`;
}

// Helper function to calculate time ago
function getTimeAgo(createAt) {
  const now = new Date();
  const createdDate = new Date(createAt);
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

  if (diffDays === 1) {
    return "1 ngày trước";
  } else if (diffDays < 30) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths === 1 ? "1 tháng trước" : `${diffMonths} tháng trước`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? "1 năm trước" : `${diffYears} năm trước`;
  }
}

// Check if the booking can be canceled (before 2 hours)
function canCancelBooking(bookingDate, bookingTime) {
  const now = new Date(); // Current time in local time zone

  // Extract the date part of bookingDate (ignoring the time and timezone)
  const datePart = bookingDate.split("T")[0]; // YYYY-MM-DD

  // Combine the date part with bookingTime in a valid format
  const bookingDateTimeStr = `${datePart}T${bookingTime}`; // Combine date and time

  // Parse the combined string into a valid Date object
  const bookingDateTime = new Date(bookingDateTimeStr);

  if (isNaN(bookingDateTime.getTime())) {
    console.error("Invalid booking date and time:", bookingDateTimeStr);
    return false; // Fail gracefully if the date is invalid
  }

  // Calculate the deadline to cancel (2 hours before booking time)
  const cancelDeadline = addHours(bookingDateTime, -2); // 2 hours before booking

  return isBefore(now, cancelDeadline);
}

export default CustomerBookingHistory;