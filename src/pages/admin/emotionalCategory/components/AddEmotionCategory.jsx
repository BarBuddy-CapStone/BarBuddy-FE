import React, { useState, useEffect } from "react";
import { createEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import ClipLoader from "react-spinners/ClipLoader"; // Import the loader

function AddEmotionCategory({ onClose, onAddSuccess }) {
  const [emotionType, setEmotionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await createEmotionCategory({ categoryName: emotionType });
      console.log("API Response:", response);

      if (response.data.statusCode === 200) {
        onAddSuccess(true, response.data.message, emotionType);
      } else {
        throw new Error(response.data?.message || "Không thể thêm danh mục.");
      }
    } catch (error) {
      console.error("Error adding emotion category:", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage("Category name must be between 3 and 20 characters");
      } else {
        onAddSuccess(false, error.message || "Có lỗi xảy ra khi thêm danh mục.");
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
    <main className={`flex flex-col px-8 py-8 text-black bg-white rounded-xl max-w-[400px] max-md:px-5 
      ${showPopup ? 'popup-enter-active' : 'popup-exit-active'} popup-enter`}>
      <h1 className="self-start text-xl text-blue-900 mb-4">Thêm Danh Mục Cảm Xúc</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="emotionType" className="self-start text-base font-aBeeZee italic mb-2">
            Tên loại cảm xúc
          </label>
          <input
            id="emotionType"
            type="text"
            className="px-4 py-2 text-sm rounded-md border font-aBeeZee border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full"
            placeholder="Nhập cảm xúc vào đây"
            aria-label="Tên loại cảm xúc"
            value={emotionType}
            onChange={(e) => setEmotionType(e.target.value)}
          />
          {errorMessage && (
            <div className="mt-1 text-red-500 text-xs">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
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
