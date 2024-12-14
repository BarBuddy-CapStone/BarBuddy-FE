import React, { useState, useEffect, useCallback } from 'react';
import { register, googleLogin } from '../../../lib/service/authenService';
import OtpPopup from 'src/components/popupOtp/OtpPopup';
import Login from 'src/pages/(auth)/login/Login';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthStore } from "src/lib";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';
import { useGoogleSignIn } from 'src/hooks/useGoogleSignIn';

const Registration = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const loginStore = useAuthStore();
  const navigate = useNavigate();
  const [currentPopup, setCurrentPopup] = useState('registration'); // Trạng thái duy nhất để quản lý pop-up
  const [openLogin, setOpenLogin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      setGoogleLoading(true);
      setErrors({});

      const token = response.credential;
      const googleLoginResponse = await googleLogin(token);
      
      if (googleLoginResponse.data.statusCode === 200) {
        const userData = googleLoginResponse.data.data;
        loginStore.login(userData.accessToken, userData);

        const decodedToken = jwtDecode(userData.accessToken);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        toast.success("Đăng nhập Google thành công!");
        onClose();

        switch (userRole) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "STAFF":
            navigate("/staff/table-management");
            break;  
          case "CUSTOMER":
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            break;
          default:
            navigate("/home");
            break;
        }
      }
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      setErrors({ google: "Đăng nhập bằng Google thất bại. Vui lòng thử lại." });
    } finally {
      setGoogleLoading(false);
    }
  }, [loginStore, navigate, onClose, setErrors, setGoogleLoading]);

  useGoogleSignIn('google-signin-register', handleGoogleResponse);

  const handleSwitchToRegister = () => {
    setCurrentPopup('registration');
  };

  const handleSwitchToLogin = () => {
    onSwitchToLogin(); // Sử dụng hàm chuyển đổi từ props
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

    setLoading(true);
    try {
      const response = await register(data);
      if (response.status === 200) {
        setCurrentPopup('otp');
      } else {
        console.error('Đăng ký thất bại:', response);
        toast.error("Đăng ký thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setOpenLogin(false);
    setAnchorEl(null);
  };

  const handleOtpSuccess = () => {
    setCurrentPopup('login');
  };

  return (
    <div>
      {currentPopup === 'otp' && (
        <OtpPopup 
          onClose={() => setCurrentPopup('registration')} 
          email={email} 
          onSuccess={handleOtpSuccess}
        />
      )}
      {currentPopup === 'login' && (
        <Login 
          onClose={onClose}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setCurrentPopup('registration')}
        />
      )}
      {currentPopup === 'registration' && (
        <div className={`relative flex flex-col px-7 py-6 w-full max-w-xl rounded-xl bg-neutral-800 transition-transform duration-500`}>
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

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mt-7">
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

          <div className="flex flex-col items-center mt-6 w-full">
            <button 
              onClick={handleRegister} 
              className="text-base bg-orange-400 text-black py-3 px-5 rounded-[64px] w-full mb-4"
            >
              Đăng ký
            </button>

            <div className="flex items-center w-full my-4">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="px-3 text-gray-400 text-sm">Hoặc</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            {/* Container cho nút đăng nhập Google */}
            <div className="w-full flex justify-center items-center mt-4">
              <div id="google-signin-register" className="google-btn"></div>
            </div>
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
