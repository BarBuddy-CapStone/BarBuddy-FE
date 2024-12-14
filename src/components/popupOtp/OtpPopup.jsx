import React, { useState } from 'react';
import { verifyOtp, verifyResetPasswordOtp } from '../../lib/service/authenService'; // Import hàm verifyOtp
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { toast } from 'react-toastify'; // Import toast
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { useAuthStore } from 'src/lib';
import { useNavigate } from 'react-router-dom';

const OtpPopup = ({ onClose, email, onSuccess, isForgetPassword }) => { // Thêm onSuccess vào props
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State cho các ô OTP
  const [loading, setLoading] = useState(false); // State để kiểm soát loading
  const loginStore = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (/^[0-9]*$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Tự động chuyển đến ô tiếp theo nếu nhập đúng
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    const data = {
      email,
      otp: otpString,
    };

    setLoading(true);
    try {
      if (isForgetPassword) {
        const response = await verifyResetPasswordOtp(data);
        if (response.status === 200) {
          toast.success("Xác thực OTP thành công!");
          onSuccess(response.data.data); // Pass the token to ForgetPassword
        }
      } else {
        const response = await verifyOtp(data);
        if (response.status === 200) {
          toast.success("Xác thực OTP thành công!");
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Xác nhận OTP thất bại', error);
      toast.error("Xác thực OTP thất bại! Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 rounded-lg p-8 w-96">
        <h2 className="text-2xl text-orange-400 mb-4">Nhập OTP</h2>
        <p className="text-gray-400 mb-6">OTP sẽ được gửi qua email bạn đã đăng ký</p>
        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`} // Thêm id cho mỗi ô nhập
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength={1}
              className="w-12 h-12 text-center text-2xl bg-zinc-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          ))}
        </div>
        {loading ? ( // Hiển thị spinner khi đang loading
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-400 text-black py-3 rounded-lg hover:bg-orange-500 transition duration-200"
          >
            Xác nhận
          </button>
        )}
        <div className="flex justify-center mt-4">
          <span className="text-gray-400">Bạn đã có tài khoản?</span>
          <button onClick={onClose} className="ml-1 text-orange-400">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;