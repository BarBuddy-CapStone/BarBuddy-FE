import React, { useState, useEffect } from "react";
import { createEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { message } from "antd"; // Import message từ antd
import ClipLoader from "react-spinners/ClipLoader";
import useAuthStore from "src/lib/hooks/useUserStore";

function AddEmotionCategory({ onClose, onAddSuccess }) {
  const [emotionType, setEmotionType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  
  // Get barId from userInfo
  const { userInfo } = useAuthStore();
  const barId = userInfo?.identityId;

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const emotionData = {
        barId: barId,
        categoryName: emotionType,
        description: description
      };

      const response = await createEmotionCategory(emotionData);
      console.log("API Response:", response);

      if (response.data.statusCode === 200) {
        message.success(response.data.message); // Sử dụng message.success thay vì toast
        onAddSuccess(true, response.data.message, emotionType);
      } else {
        throw new Error(response.data?.message || "Không thể thêm danh mục.");
      }
    } catch (error) {
      console.error("Error adding emotion category:", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage("Category name must be between 3 and 20 characters");
      } else {
        message.error(error.message || "Có lỗi xảy ra khi thêm danh mục."); // Sử dụng message.error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setTimeout(() => {
      onClose();
    }, 180);
  };

  return (
    <main className={`flex flex-col px-8 py-8 text-black bg-white rounded-xl max-w-[500px] max-md:px-5 
      ${showPopup ? 'popup-enter-active' : 'popup-exit-active'} popup-enter`}>
      <h1 className="self-start text-xl text-blue-900 mb-4">Thêm Danh Mục Cảm Xúc</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="emotionType" className="self-start text-base font-aBeeZee italic mb-2">
            Tên loại cảm xúc
          </label>
          <input
            id="emotionType"
            type="text"
            className="px-4 py-2 text-sm rounded-md border font-aBeeZee border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full"
            placeholder="Nhập cảm xúc vào đây"
            value={emotionType}
            onChange={(e) => setEmotionType(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="self-start text-base font-aBeeZee italic mb-2">
            Mô tả
          </label>
          <textarea
            id="description"
            className="px-4 py-2 text-sm rounded-md border font-aBeeZee border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full min-h-[100px] resize-none"
            placeholder="Nhập mô tả về cảm xúc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {errorMessage && (
          <div className="mt-1 text-red-500 text-xs">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-4 justify-between mt-6 w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2 text-white font-semibold rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Thêm"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddEmotionCategory;
