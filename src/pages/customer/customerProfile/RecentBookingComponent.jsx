import React, { useState, useEffect } from "react";
import BookingService from "../../../lib/service/bookingService";
import { addHours, addDays, isBefore } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function BookingHistory({ accountId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null); // To track the cancel action
  const [showConfirm, setShowConfirm] = useState(false); // To control the popup visibility
  const [selectedBookingId, setSelectedBookingId] = useState(null); // To know which booking is being canceled

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await BookingService.getRecentBookings(accountId, 4); // Fetch top 4 bookings
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (accountId) {
      fetchBookings();
    }
  }, [accountId]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingBookingId(bookingId); // Set booking as being cancelled
      await BookingService.cancelBooking(bookingId); // Call API to cancel booking

      // Update booking status to "canceled" (assuming status 1 is "canceled")
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: 1 } : booking
        )
      );
      toast.success("Đặt bàn đã được hủy thành công");
      setShowConfirm(false); // Close confirmation popup
    } catch (error) {
      toast.error("Đặt bàn đã được hủy thất bại");
      console.error("Error while canceling:", error);
    } finally {
      setCancellingBookingId(null); // Reset after cancel action is complete
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

  const navigateToBookingDetail = (bookingId) => {
    // Replace with the actual navigation logic, depending on your routing setup.
    window.location.href = `/booking-detail/${bookingId}`;
  };

  const handleNavigateToPaymentHistory = () => {
    navigate(`/payment-history/${accountId}`); // Use navigate to go to payment history page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="flex flex-col px-8 py-8 mx-auto w-full rounded-md bg-neutral-800 shadow-md max-md:px-5 ml-6 max-md:mt-10 max-md:max-w-full min-h-[500px]">
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h2 className="text-xl text-amber-400">Lịch sử đặt bàn gần đây</h2>
        <a
          href={`/booking-history/${accountId}`}
          className="text-base text-amber-400"
        >
          Xem tất cả
        </a>
      </div>
      <div className="border-t border-amber-500 mb-6" />

      <div className="space-y-4 flex-1">
        {bookings.map((booking, index) => (
          <React.Fragment key={booking.bookingId}>
            <div
              className="flex items-start justify-between cursor-pointer hover:bg-neutral-700 hover:shadow-lg transition duration-200 p-2 rounded-md"
              onClick={() => navigateToBookingDetail(booking.bookingId)}
            >
              <div className="flex gap-4">
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

              <div className="flex flex-col items-end">
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
                        e.stopPropagation(); // Prevent the parent click from triggering
                        confirmCancelBooking(booking.bookingId);
                      }}
                    >
                      Hủy đặt bàn
                    </button>
                  )}
                {booking.status === 3 &&
                  canReviewBooking(booking.bookingDate) && (
                    <button
                      className="px-4 py-2 w-[120px] bg-amber-400 text-black rounded-full text-sm hover:bg-amber-500 transition duration-200"
                      onClick={(e) => e.stopPropagation()} // Prevent the parent click from triggering
                    >
                      Đánh giá
                    </button>
                  )}
              </div>
            </div>

            {index < bookings.length - 1 && (
              <div className="border-t border-amber-500 my-6" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="border-t border-amber-500 mb-6" />

      <div className="flex flex-wrap justify-between gap-4 mt-2">
        <div className="flex-1 flex justify-center">
          {/* Handle navigate to payment history */}
          <button
            className="px-6 py-2 bg-amber-400 text-black rounded-full hover:bg-amber-500"
            onClick={handleNavigateToPaymentHistory}
          >
            Lịch sử giao dịch
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <button className="px-6 py-2 bg-amber-400 text-black rounded-full hover:bg-amber-500">
            Lịch sử đánh giá
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-8 w-96 rounded-md shadow-2xl border border-neutral-800">
            <h2 className="text-lg mb-6 text-amber-400 text-center">
              Xác nhận hủy đặt bàn?
            </h2>
            <div className="flex justify-between space-x-4">
              <button
                className="px-6 py-3 w-full bg-gray-300 text-black rounded-full hover:bg-gray-400 transition duration-200"
                onClick={handleCloseConfirm}
              >
                Hủy
              </button>
              <button
                className="px-6 py-3 w-full bg-amber-400 text-neutral-800 rounded-full hover:bg-amber-300 transition duration-200"
                onClick={() => handleCancelBooking(selectedBookingId)}
              >
                Xác nhận
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

// Check if the booking can be reviewed (within 14 days after the booking date)
function canReviewBooking(bookingDate) {
  const now = new Date();
  const bookingDateTime = new Date(bookingDate);
  const reviewDeadline = addDays(bookingDateTime, 14); // 14 days after the booking date
  return isBefore(now, reviewDeadline);
}

export default BookingHistory;
