import React, { useState } from 'react';

function EditEmotionCategory({ emotionName, onClose }) {
  const [emotion, setEmotion] = useState(emotionName); // Initialize with the passed emotion name

  const handleEmotionNameChange = (event) => {
    setEmotion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Updated Emotion:", emotion);
    onClose(); // Close the form after submitting
  };

  const handleCancel = () => {
    onClose(); // Close the form without saving
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-12 py-10 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
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
      </div>

      <div className="flex gap-5 justify-between mt-8 w-full text-xl leading-none text-white">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-gray-500 hover:bg-gray-600 transition-all focus:outline-none"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="w-full py-3 text-white font-aBeeZee rounded-full bg-blue-900 hover:bg-blue-800 transition-all focus:outline-none"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}

export default EditEmotionCategory;
