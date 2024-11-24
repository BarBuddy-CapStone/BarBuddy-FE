import React from 'react';

const ForgetPassword = ({ onClose, onSwitchToLogin }) => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
      {/* Add your forget password form here */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-500"
        >
          Quay lại đăng nhập
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword; 