import React from "react";

function Notification({ onConfirm, onCancel }) {
  const buttons = [
    { text: "Có", bgColor: "bg-blue-600", onClick: onConfirm },
    { text: "Không", bgColor: "bg-neutral-400", onClick: onCancel }
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <section className="flex flex-col p-6 w-[500px] bg-white border border-blue-400 border-solid rounded-lg shadow-lg">
        {/* Notification Header */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-center text-2xl font-bold flex-grow">Notification</h1>
          <button
            onClick={onCancel}
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
              className={`px-8 py-2 text-white rounded-full ${button.bgColor}`}
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
