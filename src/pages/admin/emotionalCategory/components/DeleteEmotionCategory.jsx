import React from "react";

const DeleteEmotionCategory = ({ emotionName, onConfirm, onCancel }) => {
  return (
    <section className="flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
      <h2 className="self-center text-2xl font-aBeeZee text-blue-900 mb-6">Thông báo</h2>
      <div className="flex flex-col">
        <label htmlFor="emotionName" className="self-start italic font-aBeeZee mb-2">
          Tên loại cảm xúc
        </label>
        <input
          type="text"
          id="emotionName"
          value={emotionName}
          readOnly
          className="px-4 py-3 text-sm font-aBeeZee rounded-md border border-gray-300 bg-gray-100 focus:outline-none transition-all w-full"
        />
      </div>
      <p className="self-start mt-4 font-aBeeZee italic">
        Bạn có chắc muốn xóa cảm xúc này?
      </p>
      <div className="flex gap-5 justify-between mt-10 w-full text-xl leading-none text-white">
        <button
          onClick={onCancel}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none"
        >
          Xác nhận
        </button>
      </div>
    </section>
  );
};

export default DeleteEmotionCategory;
