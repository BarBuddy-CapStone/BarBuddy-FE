import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material"; // Import MUI TextField and Button
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { LoadingSpinner } from "src/components";
import { useAuthStore } from "src/lib"; // Import the Auth Store
import { boookingtableNow } from "src/lib/service/BookingTableService"; // Import the API function

const CustomerForm = ({
  selectedTables,
  barId,
  selectedTime,
  selectedDate,
  barInfo,
  note,
  setNote,
  numOfPeople,
}) => {
  const { userInfo, token } = useAuthStore(); // Lấy token từ Auth Store
  const [name, setName] = useState(userInfo.fullname || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || ""); // Adjust the field name if needed
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // New state for dialogs
  const [openBookNowDialog, setOpenBookNowDialog] = useState(false);
  const [openBookDrinkDialog, setOpenBookDrinkDialog] = useState(false);

  useEffect(() => {
    // If userInfo updates in the Auth Store, update form fields
    setName(userInfo.fullname || "");
    setEmail(userInfo.email || "");
    setPhone(userInfo.phone || ""); // Adjust the field name if needed
  }, [userInfo]);

  // Function to disable copy, cut, and paste
  const disableCopyPaste = (event) => {
    event.preventDefault();
  };

  const handleBookingDrinkClick = () => {
    if (selectedTables.length === 0) {
      toast.error(
        "Vui lòng chọn ít nhất một bàn trước khi đặt trước thức uống!"
      );
      return;
    }
    setOpenBookDrinkDialog(true);
  };

  const confirmBookDrink = () => {
    setOpenBookDrinkDialog(false);
    navigate("/bookingdrink", {
      state: {
        barInfo: {
          ...barInfo,
          barId: barId,
          selectedDate: selectedDate,
          selectedTime: selectedTime,
        },
        selectedTables: selectedTables,
        customerInfo: {
          name: name,
          email: email,
          phone: phone,
          note: note,
          numOfPeople: numOfPeople
        },
      },
    });
  };

  const handleBookNow = () => {
    if (selectedTables.length === 0) {
      toast.error("Vui lòng chọn ít nhất một bàn trước khi đặt bàn!");
      return;
    }

    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày đặt bàn!");
      return;
    }

    setOpenBookNowDialog(true);
  };

  const confirmBookNow = async () => {
    setOpenBookNowDialog(false);
    setIsLoading(true);
    try {
      const formattedTime = selectedTime + ":00";
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      const bookingData = {
        barId: barId,
        bookingDate: formattedDate,
        bookingTime: formattedTime,
        note: note || "Không Có Ghi Chú",
        tableIds: selectedTables.map((table) => table.tableId),
        numOfPeople: numOfPeople
      };

      const response = await boookingtableNow(token, bookingData);
      if (response.status === 200) {
        toast.success("Đặt bàn thành công!");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast.error("Đặt bàn thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error booking table:", error);
      toast.error("Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <section className="flex flex-col px-4 mt-6 w-full max-md:px-3 max-md:mt-4 max-md:max-w-full">
        <h2 className="self-start text-lg text-amber-400 max-md:ml-1">
          Thông tin khách hàng
        </h2>
        <hr className="shrink-0 mt-3 w-full h-px border border-amber-400 border-solid" />

        {/* Name Field */}
        <TextField
          label="Họ và tên"
          value={name}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            style: { color: "white" }, // Ensure text is white
            onCopy: disableCopyPaste, // Disable copy
            onCut: disableCopyPaste, // Disable cut
            onPaste: disableCopyPaste, // Disable paste
          }}
          InputLabelProps={{
            style: { color: "white" }, // Ensure label is white
          }}
          sx={{ backgroundColor: "#333333", mt: 2 }} // Set background to match dark theme
        />

        {/* Email Field */}
        <TextField
          label="Địa chỉ Email"
          value={email}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            style: { color: "white" }, // Ensure text is white
            onCopy: disableCopyPaste, // Disable copy
            onCut: disableCopyPaste, // Disable cut
            onPaste: disableCopyPaste, // Disable paste
          }}
          InputLabelProps={{
            style: { color: "white" }, // Ensure label is white
          }}
          sx={{ backgroundColor: "#333333", mt: 2 }} // Set background to match dark theme
        />

        {/* Phone Field */}
        <TextField
          label="Số điện thoại"
          value={phone}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            style: { color: "white" }, // Ensure text is white
            onCopy: disableCopyPaste, // Disable copy
            onCut: disableCopyPaste, // Disable cut
            onPaste: disableCopyPaste, // Disable paste
          }}
          InputLabelProps={{
            style: { color: "white" }, // Ensure label is white
          }}
          sx={{ backgroundColor: "#333333", mt: 2 }} // Set background to match dark theme
        />

        {/* Note Field */}
        <TextField
          label="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          placeholder="Tôi muốn bàn view sài gòn"
          InputProps={{
            style: { color: note ? "white" : "#888" },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          sx={{ backgroundColor: "#333333", mt: 2 }}
        />

        <hr className="shrink-0 mt-6 w-full h-px border border-amber-400 border-solid" />
        <div className="flex gap-3 justify-between mt-4 text-black">
          <Button
            variant="contained"
            color="warning"
            sx={{ backgroundColor: "#FFA500" }}
            onClick={handleBookingDrinkClick}
          >
            Đặt trước thức uống với giảm giá {barInfo.discount}%
          </Button>
          <div className="my-auto text-gray-400">Hoặc</div>
          <Button
            variant="contained"
            onClick={handleBookNow}
            disabled={isLoading}
            sx={{
              backgroundColor: isLoading ? "#FFA500" : "#FFA500", // Luôn giữ màu cam
              color: "black",
              "&:hover": {
                backgroundColor: "#FF8C00",
              },
              "&:disabled": {
                backgroundColor: "#FFA500", // Giữ màu cam khi disabled
                opacity: 0.7, // Giảm độ đậm khi đang xử lý
                color: "black",
              },
            }}
          >
            {isLoading ? "Đang xử lý..." : "Đặt bàn ngay"}
          </Button>
        </div>

        {/* Dialog for Book Now confirmation */}
        <Dialog
          open={openBookNowDialog}
          onClose={() => setOpenBookNowDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Xác nhận đặt bàn"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn đặt bàn ngay bây giờ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBookNowDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={confirmBookNow} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Book Drink confirmation */}
        <Dialog
          open={openBookDrinkDialog}
          onClose={() => setOpenBookDrinkDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Xác nhận đặt trước thức uống"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn đặt trước thức uống với giảm giá{" "}
              {barInfo.discount}%?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenBookDrinkDialog(false)}
              color="primary"
            >
              Hủy
            </Button>
            <Button onClick={confirmBookDrink} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        <LoadingSpinner open={isLoading} />
      </section>
    </div>
  );
};

export default CustomerForm;
