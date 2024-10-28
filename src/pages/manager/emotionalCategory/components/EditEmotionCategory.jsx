import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateEmotionCategory } from 'src/lib/service/EmotionDrinkCategoryService';
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner

function EditEmotionCategory({ emotionId, emotionName, onClose, onEditSuccess }) {
  const [emotion, setEmotion] = useState(emotionName);
  const [loading, setLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleEmotionNameChange = (event) => {
    setEmotion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true); // Start loading

    try {
      const response = await updateEmotionCategory(emotionId, { categoryName: emotion });
      if (response.data.statusCode === 200) {
        toast.success(response.data.message);
        setShowPopup(false);
        setTimeout(() => {
          onEditSuccess();
          onClose();
        }, 180);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Category name must be between 3 and 20 characters");
      } else {
        toast.error("Có lỗi xảy ra khi chỉnh sửa danh mục.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5 
      ${showPopup ? 'popup-enter-active' : 'popup-exit-active'} popup-enter`}
    >
      <h2 className="self-start text-2xl font-aBeeZee text-blue-900 mb-6">Chỉnh Sửa Cảm Xúc</h2>

      <div className="flex flex-col">
        <label htmlFor="emotionName" className="self-start text-base font-aBeeZee italic mb-2">
          Tên loại cảm xúc
        </label>
        <input
          type="text"
          id="emotionName"
          value={emotion}
          onChange={handleEmotionNameChange}
          className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full"
          placeholder="Nhập cảm xúc"
        />
        {errorMessage && (
          <div className="mt-1 text-red-500 text-xs">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="flex gap-5 justify-between mt-8 w-full text-xl leading-none text-white">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
          disabled={loading} // Disable button when loading
        >
          Hủy
        </button>
        <button
          type="submit"
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none flex justify-center items-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Lưu"}
        </button>
      </div>
    </form>
  );
}

export default EditEmotionCategory;
