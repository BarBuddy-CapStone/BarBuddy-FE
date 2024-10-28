import React, { useState, useEffect } from "react";
import { message } from 'antd'; // Import message từ antd
import { deleteEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import ClipLoader from "react-spinners/ClipLoader";
import useAuthStore from "src/lib/hooks/useUserStore";

const DeleteEmotionCategory = ({
  emotionId,
  emotionName,
  emotionDescription,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  // Get barId from userInfo
  const { userInfo } = useAuthStore();
  const barId = userInfo?.identityId;

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleCancel = () => {
    setShowPopup(false);
    setTimeout(() => {
      onCancel();
    }, 180);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteEmotionCategory(emotionId);
      if (response.data.statusCode === 200) {
        message.success(response.data.message); // Sử dụng message.success
        setShowPopup(false);
        setTimeout(() => {
          onConfirm();
          onCancel();
        }, 180);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa danh mục."); // Sử dụng message.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5 
      ${showPopup ? "popup-enter-active" : "popup-exit-active"} popup-enter`}
    >
      <h2 className="self-center text-2xl font-aBeeZee text-blue-900 mb-6">
        Thông báo
      </h2>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="self-start italic font-aBeeZee mb-2">
            Tên loại cảm xúc
          </label>
          <input
            type="text"
            value={emotionName}
            readOnly
            className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 bg-gray-100 focus:outline-none transition-all w-full"
          />
        </div>

        <div>
          <label className="self-start italic font-aBeeZee mb-2">
            Mô tả
          </label>
          <textarea
            value={emotionDescription}
            readOnly
            className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 bg-gray-100 focus:outline-none transition-all w-full min-h-[100px] resize-none"
          />
        </div>
      </div>

      <p className="self-start mt-4 font-aBeeZee italic">
        Bạn có chắc muốn xóa cảm xúc này?
      </p>

      <div className="flex gap-5 justify-between mt-10 w-full text-xl leading-none text-white">
        <button
          onClick={handleCancel}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          onClick={handleDelete}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Xác nhận"}
        </button>
      </div>
    </section>
  );
};

export default DeleteEmotionCategory;
