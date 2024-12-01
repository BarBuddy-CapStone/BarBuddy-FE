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
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material"; // Modal for image preview
import CloseIcon from "@mui/icons-material/Close";
import TableBarIcon from "@mui/icons-material/TableBar";
import LiquorIcon from "@mui/icons-material/Liquor";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BookingService } from "src/lib";
import CircularProgress from "@mui/material/CircularProgress";
import QrCodeIcon from '@mui/icons-material/QrCode';

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
  const [loading, setLoading] = useState(true);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  // Fetch booking details from API
  useEffect(() => {
    const fetchBookingData = async () => {
      setLoading(true);
      try {
        const response = await BookingService.getBookingById(bookingId);
        setBookingData(response.data.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Hiển thị loading spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress style={{ color: "#FFBF00" }} />
      </div>
    );
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

  const handleOpenNoteDialog = () => {
    setIsNoteDialogOpen(true);
  };

  const handleCloseNoteDialog = () => {
    setIsNoteDialogOpen(false);
  };

  const handleOpenQRDialog = () => {
    setIsQRDialogOpen(true);
  };

  const handleCloseQRDialog = () => {
    setIsQRDialogOpen(false);
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
              className="text-gray-200 flex items-center space-x-2 hover:text-amber-400 transition-all duration-300 ease-in-out transform hover:translate-x-1"
            >
              <ArrowBackIcon />
              <span>Quay lại</span>
            </button>
            <span className="text-neutral-400">
              {getTimeAgo(bookingData.createAt)}
            </span>
          </div>
        </div>

        <div className="border-t border-amber-500 mb-6"></div>

        {/* Image Carousel with AutoPlay - Adjusted height */}
        <div className="mb-6 h-64">
          {" "}
          {/* Điều chỉnh chiều cao ở đây */}
          <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            autoPlay={true}
            interval={5000}
            onClickItem={(index) => handleImageClick(images[index])}
          >
            {images.map((image, index) => (
              <div key={index} className="cursor-pointer h-64">
                {" "}
                {/* Điều chỉnh chiều cao ở đây */}
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover"
                />
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
        <div className="grid grid-cols-2 gap-6 text-gray-300">
          <div className="flex items-start">
            <LiquorIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Chi Nhánh:</span>
              <p>{barName}</p>
            </div>
          </div>
          <div className="flex items-start">
            <CalendarTodayIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Thời gian:</span>
              <p>{formattedDateTime}</p>
            </div>
          </div>
          <div className="flex items-start">
            <LocationOnIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Địa chỉ:</span>
              <p>{barAddress}</p>
            </div>
          </div>
          <div className="flex items-start">
            <KeyIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Mã đặt bàn:</span>
              <p>{bookingCode}</p>
            </div>
          </div>
          <div className="flex items-start">
            <TableBarIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Bàn đã đặt:</span>
              <p>{formattedTables}</p>
            </div>
          </div>
          <div className="flex items-start">
            <EditNoteIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Ghi chú:</span>
              <button
                onClick={handleOpenNoteDialog}
                className="text-amber-400 hover:underline ml-2"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
          <div className="flex items-start">
            <QrCodeIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Mã QR Check-in:</span>
              <button
                onClick={handleOpenQRDialog}
                className="text-amber-400 hover:underline ml-2"
              >
                Xem QR Code
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-500 mt-6 mb-4"></div>

        {/* Customer Info */}
        <h2 className="text-2xl text-amber-400 mb-4">Khách Hàng</h2>
        <div className="grid grid-cols-2 gap-6 text-gray-300">
          <div className="flex items-start">
            <PersonIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Tên khách hàng:</span>
              <p>{customerName}</p>
            </div>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Số điện thoại:</span>
              <p>{customerPhone}</p>
            </div>
          </div>
          <div className="flex items-start col-span-2">
            <EmailIcon className="text-amber-400 mr-3 flex-shrink-0" />
            <div>
              <span className="font-semibold">Email:</span>
              <p>{customerEmail}</p>
            </div>
          </div>
        </div>

        {/* Notice Section */}
        <div className="border-t border-amber-500 mt-6 mb-4"></div>
        <div className="text-gray-400 text-sm">
          <h3 className="text-amber-400 mb-2">Lưu ý</h3>
          <ul className="list-disc list-inside">
            <li>Vui lòng tới trước 15 phút để có trải nghiệm tốt nhất.</li>
            <li>Vui lòng mang theo CCCD hoặc giấy tờ tùy thân hợp lệ.</li>
            <li>Đặt bàn sẽ được hoàn thành sau khi khách hàng check-in.</li>
            <li>
              Nếu quý khách không thể tới, vui lòng hủy đặt bàn trước 2 tiếng.
            </li>
          </ul>
          <p className="mt-4">
            Giới hạn độ tuổi: <strong className="text-amber-400">18+</strong>
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

      {/* Note Dialog */}
      <Dialog
        open={isNoteDialogOpen}
        onClose={handleCloseNoteDialog}
        aria-labelledby="note-dialog-title"
        PaperProps={{
          style: {
            backgroundColor: "#27272a",
            color: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          id="note-dialog-title"
          style={{
            color: "#FFBF00",
            borderBottom: "1px solid #FFBF00",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Ghi chú</span>
          <IconButton
            aria-label="close"
            onClick={handleCloseNoteDialog}
            style={{
              color: "#FFFFFF",
              padding: "4px",
            }}
          >
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "24px" }}>
          <p
            style={{
              color: "#E5E7EB",
              fontSize: "16px",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            {note || "Không có ghi chú"}
          </p>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog
        open={isQRDialogOpen}
        onClose={handleCloseQRDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#27272a',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle
          style={{
            color: '#FFBF00',
            borderBottom: '1px solid #FFBF00',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Mã QR Check-in</span>
          <IconButton
            aria-label="close"
            onClick={handleCloseQRDialog}
            style={{ color: '#FFFFFF' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: '24px', textAlign: 'center' }}>
          <img
            src={bookingData.qrTicket}
            alt="QR Ticket"
            style={{
              maxWidth: '80%',
              height: 'auto',
              margin: '0 auto',
              borderRadius: '8px',
            }}
          />
          <p style={{ color: '#E5E7EB', marginTop: '16px', fontSize: '14px' }}>
            Vui lòng xuất trình mã QR này khi check-in tại quầy
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BookingDetailPage;
