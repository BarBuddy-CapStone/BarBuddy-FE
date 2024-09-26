import React, { useState } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Switch from '@mui/material/Switch'; // Import the Switch component from MUI
import { useNavigate } from "react-router-dom";
import { Notification } from 'src/components'; // Import Notification properly

const inputFields = [
  { label: "Điểm", value: "5", readOnly: false },
  { label: "Nội dung", value: "Content", readOnly: false },
  { label: "Bởi", value: "User 1", readOnly: false },
  { label: "Chi nhánh", value: "Bar Buddy 1", readOnly: false },
  { label: "Ngày tạo", value: "August 18 2021 - 15:20:56", readOnly: true },
  { label: "Ngày chỉnh sửa", value: "August 18 2021 - 15:20:56", readOnly: true }
];

function FeedbackDetail() {
  const [isActive, setIsActive] = useState(true); // Manage active/inactive state
  const [showNotification, setShowNotification] = useState(false); // State to show/hide the notification
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  const handleStatusChange = (event) => {
    setIsActive(event.target.checked); // Toggle status
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowNotification(true); // Show the notification when Save is clicked
  };

  const handleConfirm = () => {
    setShowNotification(false); // Close notification on confirm
    // Implement actual save logic here, e.g., submitting the data
    console.log("Data saved");
    // Optionally navigate back after saving
    navigate(-1); // Navigate back after confirmation
  };

  const handleCancel = () => {
    setShowNotification(false); // Close notification on cancel
  };

  return (
    <main className="flex flex-col items-center justify-center mt-9 w-full px-5">
      <header className="flex items-center gap-4 mb-8 text-2xl font-semibold text-black w-full max-w-lg">
        {/* Back button to navigate to the feedback list */}
        <div className="cursor-pointer" onClick={handleBack}>
          <ChevronLeftIcon fontSize="large" />
        </div>
        <h1 className="flex-grow text-center font-notoSansSC">Nội Dung Đánh Giá</h1>
      </header>

      <form className="space-y-6 w-full max-w-lg" onSubmit={handleSave}>
        {inputFields.map((field, index) => (
          <div key={index} className="flex justify-between items-center">
            <label className="w-1/3 text-base font-medium font-notoSansSC text-black">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              readOnly={field.readOnly} // Apply readOnly if the field is meant to be view-only
              className={`w-2/3 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm ${
                field.readOnly ? "cursor-not-allowed bg-gray-100" : ""
              }`} // Add some visual feedback for read-only fields
            />
          </div>
        ))}

        {/* Status section with color-changing text and switch */}
        <div className="flex justify-between items-center mt-5">
          <label className="w-1/3 text-base font-medium font-notoSansSC">Trạng thái</label>
          <div className="flex items-center gap-4 w-2/3">
            <Switch
              checked={isActive}
              onChange={handleStatusChange}
              color={isActive ? "success" : "error"} // Dynamic switch color
            />
            <span className={isActive ? "text-green-500" : "text-red-500"}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-8 py-2 font-aBeeZee italic bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all"
          >
            Lưu
          </button>
        </div>
      </form>

      {/* Conditionally render the Notification component */}
      {showNotification && (
        <Notification onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </main>
  );
}

export default FeedbackDetail;
