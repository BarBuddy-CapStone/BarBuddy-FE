import React from "react";
import { delDrinkCate } from "src/lib/service/drinkCateService";

const Button = ({ children, type, variant, onClick }) => {
  const baseClasses = "gap-2.5 self-stretch min-h-[56px] w-[100px] rounded-[64px] text-white";
  const variantClasses = {
    primary: "bg-blue-900",
    secondary: "bg-neutral-500"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

function PopupConfirmDelete({ onClose, confirmDelete, id, setLoading, refreshList }) {
  const handleCancel = () => {
    onClose();
  };

  const ConfirmDeleteHandle = async () => {
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await delDrinkCate(id);
        if (response.status === 200) {
          onClose();
          refreshList();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-55 z-50">
      <form className="flex flex-col items-start px-12 pt-5 pb-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
        <h1 className="text-2xl text-blue-900 text-center mb-[20px] ml-[100px]">Thông báo</h1>
        <h1 className="text-lg text-blue-900 text-center text-gray-900">Bạn có muốn xóa nội dung bạn đã chọn?</h1>
        <div className="flex gap-5 justify-between mt-7 w-full text-lg leading-none whitespace-nowrap max-md:mt-10">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Hủy
          </Button>
          {/* Pass function reference to onClick without calling it immediately */}
          <Button onClick={ConfirmDeleteHandle} type="button" variant="primary">
            Xóa
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PopupConfirmDelete;
