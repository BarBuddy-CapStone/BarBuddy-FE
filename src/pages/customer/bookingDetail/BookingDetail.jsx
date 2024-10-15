import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for back navigation
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyIcon from "@mui/icons-material/VpnKey";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Dialog } from "@mui/material"; // Modal for image preview
import CloseIcon from "@mui/icons-material/Close";
import TableBarIcon from "@mui/icons-material/TableBar";
import LiquorIcon from "@mui/icons-material/Liquor";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BookingService } from "src/lib";
import CircularProgress from '@mui/material/CircularProgress';

// Function to format date and time
const formatDateTime = (bookingDate, bookingTime) => {
  const date = new Date(bookingDate);
  const formattedDate = date.toLocaleDateString("en-GB"); // Format as dd/MM/yyyy
  const time = bookingTime.slice(0, 5); // Slice the time string to get HH:mm
  return `${time} - ${formattedDate}`;
};

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

function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  const [bookingData, setBookingData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch booking details from API
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await BookingService.getBookingById(bookingId);
        setBookingData(response.data.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  // Destructure the booking data
  const {
    barName,
    barAddress,
    bookingCode,
    customerName,
    customerPhone,
    customerEmail,
    note,
    bookingDate,
    bookingTime,
    images,
    tableNameList,
    bookingDrinksList,
  } = bookingData;

  // Format the table names (e.g., "Table 1, Table 2")
  const formattedTables = tableNameList ? tableNameList.join(", ") : "";

  // Format the booking date and time
  const formattedDateTime = formatDateTime(bookingDate, bookingTime);

  // Handle image click to open preview modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  // Handle "Go Back" button
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div
      className={`flex flex-col px-8 mx-16 ${
        bookingDrinksList && bookingDrinksList.length > 0
          ? "lg:flex-row gap-8"
          : "justify-center items-center"
      }`}
    >
      {/* Main Content */}
      <div
        className={`bg-neutral-800 p-6 rounded-md shadow-md ${
          bookingDrinksList && bookingDrinksList.length > 0
            ? "lg:w-2/3"
            : "lg:w-2/3"
        }`}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleGoBack}
              className="text-amber-400 flex items-center space-x-2"
            >
              <ArrowBackIcon className="text-amber-400 mr-3" />
              <span>Quay lại</span>
            </button>
            {/* Display time ago, aligned to the right */}
            <span className="text-amber-400 text-neutral-400">
              {getTimeAgo(bookingData.createAt)}
            </span>
          </div>
        </div>

        <div className="border-t border-amber-500 mb-6"></div>

        {/* Image Carousel with AutoPlay */}
        <div className="mb-6">
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            autoPlay={true}
            interval={5000}
            onClickItem={(index) => handleImageClick(images[index])}
          >
            {images.map((image, index) => (
              <div key={index} className="cursor-pointer">
                <div
                  className="w-full h-0"
                  style={{
                    paddingBottom: "56.25%", // 16:9 aspect ratio
                  }}
                >
                  <img
                    src={image}
                    alt={`Slide ${index}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Modal for Image Preview */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              boxShadow: "none",
            },
          }}
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </button>

            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto"
              style={{ maxHeight: "90vh", objectFit: "contain" }}
            />
          </div>
        </Dialog>

        {/* Booking Information Section */}
        <div className="border-t border-amber-500 mb-4"></div>
        <h2 className="text-2xl text-amber-400 mb-4">Thông tin đặt chỗ</h2>

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
          {/* Row 1 */}
          <div className="flex items-start">
            <LiquorIcon className="text-amber-400 mr-3" />
            <span>{barName}</span>
          </div>
          <div className="flex items-start">
            <CalendarTodayIcon className="text-amber-400 mr-3" />
            <span>{formattedDateTime}</span>
          </div>

          {/* Row 2 */}
          <div className="flex items-start">
            <LocationOnIcon className="text-amber-400 mr-3" />
            <span>{barAddress}</span>
          </div>
          <div className="flex items-start">
            <KeyIcon className="text-amber-400 mr-3" />
            <span>{bookingCode}</span>
          </div>

          {/* Row 3 */}
          <div className="flex items-start">
            <TableBarIcon className="text-amber-400 mr-3" />
            <span>{formattedTables}</span>
          </div>
          <div className="flex items-start">
            <EditNoteIcon className="text-amber-400 mr-3" />
            <span>{note}</span>
          </div>
        </div>

        <div className="border-t border-amber-500 mt-4 mb-4"></div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
          <div className="flex items-start">
            <PersonIcon className="text-amber-400 mr-3" />
            <span>{customerName}</span>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="text-amber-400 mr-3" />
            <span>{customerPhone}</span>
          </div>
          <div className="flex items-start">
            <EmailIcon className="text-amber-400 mr-3" />
            <span>{customerEmail}</span>
          </div>
        </div>

        {/* Notice Section */}
        <div className="border-t border-amber-500 mt-4 mb-4"></div>
        <div className="text-gray-400 text-sm">
          <h3 className="text-amber-400 mb-2">Lưu ý</h3>
          <ul className="list-disc list-inside">
            <li>Vui lòng tới trư��c 15 phút để có trải nghiệm tốt nhất.</li>
            <li>Vui lòng mang theo CCCD hoặc giấy tờ tùy thân hợp lệ.</li>
            <li>Đặt bàn sẽ được hoàn thành sau khi khách hàng check-in.</li>
            <li>
              Nếu quý khách không thể tới, vui lòng hủy đặt bàn trước 2 tiếng.
            </li>
          </ul>
          <p className="mt-4">
            Giới hạn độ tuổi: <strong>18+</strong>
          </p>
        </div>
      </div>

      {/* Sidebar */}
      {bookingDrinksList && bookingDrinksList.length > 0 && (
        <div className="lg:w-1/3 space-y-8">
          {/* Map Section */}
          {/* <div className="bg-neutral-800 p-6 rounded-md shadow-md">
                    <h3 className="text-xl text-amber-400 mb-4 text-center font-bold">Bản đồ</h3>
                    <img
                        src="https://via.placeholder.com/300x200"
                        alt="Map"
                        className="w-full h-40 object-cover rounded-md"
                    />
                </div> */}
          <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl text-amber-400 mb-4 text-center">
              Thức uống đã đặt trước
            </h3>
            <div className="border-t border-amber-500 mb-4"></div>
            <div className="space-y-3">
              {bookingDrinksList.map((drink) => (
                <div
                  key={drink.drinkId}
                  className="flex justify-between items-center bg-neutral-700 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center space-x-3 w-2/3">
                    <img
                      src={drink.image}
                      alt={drink.drinkName}
                      className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                    />
                    <div
                      className="flex-1 sm:max-w-full md:max-w-3/4 lg:max-w-2/3"
                      style={{ wordBreak: "break-word" }}
                    >
                      <span className="block text-white font-semibold truncate">
                        {drink.drinkName}
                      </span>
                      <span className="block text-amber-400 text-sm">
                        {drink.actualPrice.toLocaleString()} VND
                      </span>
                    </div>
                  </div>

                  <div className="text-right w-1/3">
                    <span className="text-lg font-bold text-white">
                      x{drink.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-amber-500 mt-4 pt-4 text-gray-300">
              <div className="flex justify-between">
                <span className="text-amber-400 text-lg">Tổng số tiền</span>
                <span className="text-amber-400 font-semibold text-lg">
                  {bookingDrinksList
                    .reduce(
                      (total, drink) =>
                        total + drink.actualPrice * drink.quantity,
                      0
                    )
                    .toLocaleString()}{" "}
                  VND
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDetailPage;