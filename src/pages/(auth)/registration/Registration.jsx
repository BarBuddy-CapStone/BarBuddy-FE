import React, { useState } from 'react';
import { register } from '../../../lib/service/authenService';
import OtpPopup from 'src/components/popupOtp/OtpPopup';
import Login from 'src/pages/(auth)/login/Login'; // Import Login
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

const Registration = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // State để kiểm soát hiển thị Login
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(true); // State để kiểm soát hiển thị Registration
  const [loading, setLoading] = useState(false); // State để kiểm soát trạng thái loading
  const [errors, setErrors] = useState({}); // State để lưu trữ các lỗi của form

  const handleSwitchToLogin = () => {
    setShowRegistrationPopup(false);
    setShowLoginPopup(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email không được để trống';
    if (!fullname) newErrors.fullname = 'Họ và tên không được để trống';
    if (!password) newErrors.password = 'Mật khẩu không được để trống';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    if (!phone) newErrors.phone = 'Số điện thoại không được để trống';
    if (!dob) newErrors.dob = 'Ngày sinh không được để trống';
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      email,
      password,
      confirmPassword,
      fullname,
      phone,
      dob,
    };

    setLoading(true); // Bắt đầu loading
    try {
      const response = await register(data);
      if (response.status === 200) {
        setShowRegistrationPopup(false);
        setShowOtpPopup(true); // Đảm bảo rằng điều này được gọi khi đăng ký thành công
      } else {
        // Xử lý trường hợp response không phải 200
        console.error('Đăng ký thất bại:', response);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error); // In ra lỗi để kiểm tra
      // Xử lý lỗi (ví dụ: thông báo lỗi)
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleOtpSuccess = () => {
    // Ẩn OtpPopup và hiển thị Login
    setShowOtpPopup(false);
    setShowLoginPopup(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegistrationPopup(true);
  };

  return (
    <div>
      {showOtpPopup && <OtpPopup onClose={() => setShowOtpPopup(false)} email={email} onSuccess={handleOtpSuccess} />}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} onSwitchToRegister={handleSwitchToRegister} />}
      {showRegistrationPopup && (
        <div className={`relative flex flex-col px-7 py-11 w-full max-w-xl rounded-xl bg-zinc-900 transition-transform duration-500 ${showRegistrationPopup ? 'translate-x-0' : '-translate-x-full'}`} style={{ borderRadius: '16px' }}>
          <div className='relative w-full'>
            <div className="flex gap-0.5 self-start text-2xl text-orange-400">
              <div className='font-notoSansSC text-2xl'>Đăng ký</div>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 z-10"
              onClick={onClose}
            >
              X
            </button>
          </div>

          {loading ? ( // Hiển thị spinner khi đang loading
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mt-7">
              {/* Các trường nhập liệu */}
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Địa chỉ Email</div>
                <input
                  type="email"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  placeholder="nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                />
                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Họ và tên</div>
                <input
                  type="text"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  placeholder="nguyenvana"
                  value={fullname}
                  onChange={(e) => { setFullname(e.target.value); setErrors({ ...errors, fullname: '' }); }}
                />
                {errors.fullname && <div className="text-red-500 text-xs">{errors.fullname}</div>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Mật khẩu</div>
                <input
                  type="password"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                />
                {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Nhập lại mật khẩu</div>
                <input
                  type="password"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }}
                />
                {errors.confirmPassword && <div className="text-red-500 text-xs">{errors.confirmPassword}</div>}
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Ngày sinh</div>
                <input
                  type="date"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  value={dob}
                  onChange={(e) => { setDob(e.target.value); setErrors({ ...errors, dob: '' }); }}
                />
                {errors.dob && <div className="text-red-500 text-xs">{errors.dob}</div>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400">Số điện thoại</div>
                <input
                  type="number"
                  className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
                  placeholder="123123123"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors({ ...errors, phone: '' }); }}
                />
                {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button onClick={handleRegister} className="flex-1 text-base bg-orange-400 text-black py-3 px-5 rounded-[64px] w-full max-w-[50%]">
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
            <button onClick={handleSwitchToLogin} className="ml-1 text-orange-400">
              Đăng nhập
            </button>
          </div>

          <div className="text-xs leading-5 text-center text-zinc-400 mt-4">
            Bằng cách đăng ký hoặc đăng nhập, bạn đã đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;