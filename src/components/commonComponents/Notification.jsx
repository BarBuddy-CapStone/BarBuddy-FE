import React, { useState, useEffect } from "react";

function Notification({ onConfirm, onCancel }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300);
  };

  const buttons = [
    { text: "Có", bgColor: "bg-blue-600 hover:bg-blue-700", onClick: handleConfirm },
    { text: "Không", bgColor: "bg-neutral-400 hover:bg-neutral-500", onClick: handleCancel }
  ];

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <section className={`flex flex-col p-6 w-[500px] bg-white border border-blue-400 border-solid rounded-lg shadow-lg transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Notification Header */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-center text-2xl font-bold flex-grow">Thông báo</h1>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex justify-center items-center border border-blue-500 rounded-full text-blue-500 hover:bg-blue-100 transition-colors duration-200"
          >
            <span className="text-lg font-bold mb-1">×</span>
          </button>
        </header>

        {/* Notification Body */}
        <p className="text-lg text-black font-medium mb-6 text-center">
          Bạn có chắc với quyết định của bạn?
        </p>

        {/* Notification Actions */}
        <div className="flex justify-center gap-6">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`px-8 py-2 text-white rounded-full ${button.bgColor} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              onClick={button.onClick}
            >
              {button.text}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Notification;
