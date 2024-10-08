import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { useAuthStore } from "src/lib"; // Import the Auth Store
import { TextField, Button } from "@mui/material"; // Import MUI TextField and Button

const CustomerForm = ({ selectedTables }) => {
  const { userInfo } = useAuthStore(); // Fetch userInfo from Auth Store

  // Initialize state with user information from Auth Store
  const [name, setName] = useState(userInfo.fullname || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || ""); // Adjust the field name if needed
  const [note, setNote] = useState(""); // Initially empty for user to type

  const navigate = useNavigate();

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
    navigate("/bookingdrink"); // Redirect if tables are selected
  };

  return (
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
        onChange={(e) => setNote(e.target.value)} // Update note as user types
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="Tôi muốn bàn view sài gòn" // Placeholder text
        InputProps={{
          style: { color: note ? "white" : "#888" }, // Show white text if user types, else placeholder color
        }}
        InputLabelProps={{
          style: { color: "white" }, // Ensure label is white
        }}
        sx={{ backgroundColor: "#333333", mt: 2 }} // Set background to match dark theme
      />

      <hr className="shrink-0 mt-6 w-full h-px border border-amber-400 border-solid" />
      <div className="flex gap-3 justify-between mt-4 text-black">
        <Button
          variant="contained"
          color="warning"
          sx={{ backgroundColor: "#FFA500" }} // Make button stand out
          onClick={handleBookingDrinkClick} // Add onClick handler
        >
          Đặt trước thức uống với chiết khấu 10%
        </Button>
        <div className="my-auto text-gray-400">Hoặc</div>
        <Button
          variant="contained"
          color="warning"
          sx={{ backgroundColor: "#FFA500" }} // Make button stand out
        >
          Đặt bàn ngay
        </Button>
      </div>
    </section>
  );
};

export default CustomerForm;
