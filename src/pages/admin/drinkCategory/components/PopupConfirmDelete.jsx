import React, { useState, useEffect } from "react";
import { delDrinkCate } from "src/lib/service/drinkCateService";
import { message } from "antd";
import ClipLoader from "react-spinners/ClipLoader";

const Button = ({ children, type, variant, onClick, disabled }) => {
  const baseClasses = "gap-2.5 self-stretch min-h-[56px] w-[100px] rounded-[64px] text-white transition-all duration-300 ease-in-out";
  const variantClasses = {
    primary: "bg-blue-900 hover:bg-blue-800",
    secondary: "bg-neutral-500 hover:bg-neutral-400"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} flex justify-center items-center`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

function PopupConfirmDelete({ onClose, data, setLoading, refreshList }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const response = await delDrinkCate(data.drinksCategoryId);
      if (response.status === 200) {
        message.success(response.data.message || "Deleted Successfully");
        setIsVisible(false);
        setTimeout(() => {
          onClose();
          refreshList();
        }, 300);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục.");
      console.error('Error deleting category:', error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-55 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5 transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="self-center text-2xl font-aBeeZee text-blue-900 mb-6">
          Thông báo
        </h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="self-start italic font-aBeeZee mb-2">
              Tên danh mục
            </label>
            <input
              type="text"
              value={data.drinksCategoryName}
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
            <label className="self-start italic font-aBeeZee mb-2">
              Mô tả
            </label>
            <textarea
              value={data.description}
              readOnly
              className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed opacity-70 w-full min-h-[100px] resize-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            />
          </div>
        </div>

        <p className="self-start mt-4 font-aBeeZee italic">
          Bạn có chắc muốn xóa danh mục này?
        </p>

        <div className="flex gap-5 justify-between mt-8 w-full text-xl leading-none text-white">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            type="button" 
            variant="primary"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : "Xóa"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PopupConfirmDelete;
