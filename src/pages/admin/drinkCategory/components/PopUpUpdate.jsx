import React, { useState, useEffect } from 'react';
import { updDrinkCate } from 'src/lib/service/drinkCateService';
import { message } from 'antd';
import ClipLoader from "react-spinners/ClipLoader";

function PopUpUpdate({ onClose, data, setLoading }) {
  const [categoryName] = useState(data.drinksCategoryName);
  const [description, setDescription] = useState(data.description);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!description.trim()) {
      setErrorMessage("Mô tả không được để trống!");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const updateData = {
        description: description.trim()
      };

      const response = await updDrinkCate(data.drinksCategoryId, updateData);
      if (response.status === 200) {
        message.success(response.data.message || "Updated Successfully");
        setShowPopup(false);
        setTimeout(() => {
          onClose();
        }, 180);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response?.data?.errors?.Description) {
        setErrorMessage(error.response.data.errors.Description[0]);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Có lỗi xảy ra khi cập nhật danh mục.");
      }
    } finally {
      setIsSubmitting(false);
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
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 
      ${showPopup ? 'opacity-100' : 'opacity-0'}`}>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5 
        transition-all duration-300 ${showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <h2 className="self-start text-2xl font-aBeeZee text-blue-900 mb-6">Chỉnh sửa danh mục đồ uống</h2>

        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="categoryName" className="self-start text-base font-aBeeZee italic mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              readOnly
              className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed opacity-70 w-full"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="description" className="self-start text-base font-aBeeZee italic mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full min-h-[100px] resize-none"
              placeholder="Nhập mô tả"
            />
          </div>

          {errorMessage && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-500 text-sm">{errorMessage}</p>
            </div>
          )}
        </div>

        <div className="flex gap-5 justify-between mt-8 w-full text-xl leading-none text-white">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 text-white font-aBeeZee rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="w-full py-3 text-white font-aBeeZee rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopUpUpdate;
