import React, { useState } from 'react';
import { register } from '../../lib/service/authenService'; // Thêm import hàm register
import { useNavigate } from 'react-router-dom';

const Registration = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Xác thực các trường
    if (!email || !password || !confirmPassword || !fullName || !phoneNumber || !birthday) {
      setErrorMessage("Tất cả các trường đều là bắt buộc."); // Cập nhật thông báo lỗi
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp."); // Cập nhật thông báo lỗi
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Địa chỉ email không hợp lệ."); // Cập nhật thông báo lỗi
      return;
    }

    setErrorMessage(""); // Xóa thông báo lỗi nếu không có lỗi

    const data = {
      email,
      password,
      confirmPassword,
      fullname: fullName, // Chuyển đổi tên trường
      phone: phoneNumber, // Chuyển đổi tên trường
      dob: birthday, // Chuyển đổi tên trường
    };

    try {
      const response = await register(data); // Gọi hàm register
      if (response.data.statusCode === 200) {
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage("Đăng ký thất bại: " + error.message); // Cập nhật thông báo lỗi
    }
  };

  return (
    <div className="flex flex-col px-7 py-11 w-full max-w-xl rounded-xl bg-zinc-900">
      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      {/* Tiêu đề */}
      <div className='flex'>
        <div className="flex gap-0.5 self-start text-2xl text-orange-400">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d2b7ddc5f38be20013ab7eda058d48550f8d13d1428456892050189fe4a2df68?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
            className="object-contain shrink-0 my-auto w-5 aspect-square"
            alt="Registration icon"
          />
          <div>Đăng ký</div>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          X
        </button>
      </div>
      {/* Form chia 2 cột */}
      <div className="grid grid-cols-2 gap-6 mt-7">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Địa chỉ Email</div>
          <input
            type="email"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="nguyenvana@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Họ và tên</div>
          <input
            type="text"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="nguyenvana"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Mật khẩu</div>
          <input
            type="password"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Nhập lại mật khẩu</div>
          <input
            type="password"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Ngày sinh</div>
          <input
            type="date"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Số điện thoại</div>
          <input
            type="number"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="123123123"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      {/* Nút và liên kết */}
      <div className="flex justify-between items-center mt-6">
        <button 
          className="flex-1 text-base bg-orange-400 text-black py-3 px-5 rounded-[64px] w-full max-w-[50%]"
          onClick={handleRegister} // Thay đổi sự kiện onClick
        >
          Đăng ký
        </button>

        <div className="text-center flex-grow text-zinc-100">hoặc</div>

        <button className="flex items-center text-center justify-center bg-zinc-800 text-white py-3 px-7 rounded-[64px] w-full max-w-[35%]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/60e2c583c050e4144ff530c58b0a844f76ad69b2a4ce4e71e263c2acbbc2bb3a?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
            className="w-5 h-5 mr-2"
            alt="Google icon"
          />
          Google
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <span className="text-gray-400">Bạn đã có tài khoản?</span>
        <button onClick={onSwitchToLogin} className="ml-1 text-orange-400">
          Đăng nhập
        </button>
      </div>

      <div className="text-xs leading-5 text-center text-zinc-400 mt-4">
        Bằng cách đăng ký hoặc đăng nhập, bạn đã đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
      </div>
    </div>
  );
};

export default Registration;