import React, { useState } from "react";

function AddEmotionCategory({ onClose }) { // Receive onClose as a prop
  const [emotionType, setEmotionType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Emotion:", emotionType);
    onClose(); // Close the form after submitting
  };

  const handleCancel = () => {
    onClose(); // Call the onClose prop to close the form
  };

  return (
    <main className="flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
      <h1 className="self-start text-2xl text-blue-900 mb-6">
        Thêm Danh Mục Cảm Xúc
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="emotionType" className="self-start text-base font-aBeeZee italic mb-2 ">
            Tên loại cảm xúc
          </label>
          <input
            id="emotionType"
            type="text"
            className="px-4 py-3 text-sm rounded-md border font-aBeeZee border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all w-full"
            placeholder="Nhập cảm xúc vào đây"
            aria-label="Tên loại cảm xúc"
            value={emotionType}
            onChange={(e) => setEmotionType(e.target.value)}
          />
        </div>
        <div className="flex gap-5 justify-between mt-8 w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 text-white font-semibold rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none"
          >
            Thêm
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddEmotionCategory;
