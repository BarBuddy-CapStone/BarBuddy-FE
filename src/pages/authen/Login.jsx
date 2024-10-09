import React, { useState } from 'react'; // Thêm useState
import { login } from '../../lib/service/authenService'; // Nhập hàm login
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../lib/hooks/useUserStore'; // Nhập useAuthStore

function LoginForm({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState(''); // Trạng thái cho email
  const [password, setPassword] = useState(''); // Trạng thái cho mật khẩu
  const navigate = useNavigate();
  const loginStore = useAuthStore(); // Khởi tạo useAuthStore

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      if (response.data.statusCode == 200) {
        loginStore.login(response.data.data.accessToken, response.data.data); // Lưu thông tin người dùng vào store
        navigate('/home');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error); // Xử lý lỗi
    }
  };

  return (
    <div className="relative flex flex-col px-7 py-11 w-full max-w-md rounded-xl bg-zinc-900">
      {/* Nút đóng Popup */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
      >
        X
      </button>

      <div className="flex gap-0.5 self-start text-2xl text-orange-400">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d2b7ddc5f38be20013ab7eda058d48550f8d13d1428456892050189fe4a2df68?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
          className="object-contain shrink-0 my-auto w-5 aspect-square"
          alt="Login icon"
        />
        <div className="basis-auto">Đăng nhập</div>
      </div>

      <div className="col-span-2 md:col-span-1 mt-5">
        <div className="text-xs text-gray-400">Địa chỉ Email</div>
        <input
          type="email"
          className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
          placeholder="nguyenvana@gmail.com"
          value={email} // Gán giá trị email
          onChange={(e) => setEmail(e.target.value)} // Cập nhật trạng thái email
        />
      </div>
      <div className="col-span-2 md:col-span-1 mt-5">
        <div className="text-xs text-gray-400">Mật khẩu</div>
        <input
          type="password"
          className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
          placeholder="••••••••"
          value={password} // Gán giá trị mật khẩu
          onChange={(e) => setPassword(e.target.value)} // Cập nhật trạng thái mật khẩu
        />
      </div>

      <div className="flex gap-5 justify-between mt-6 w-full max-md:mr-1 max-md:max-w-full">
        <button className="text-gray-400">Quên mật khẩu ?</button>
        <div className="flex gap-0.5">
          <div className="grow text-gray-400">Bạn chưa có tài khoản ?</div>
          <button className="text-orange-400" onClick={() => navigate('/register')}>
            Đăng ký
          </button>
        </div>
      </div>
      <div className='flex'>
        <div className="flex flex-col items-center self-center mt-5 w-full max-w-[398px] text-zinc-100">
          <button className="gap-2.5 self-stretch w-full text-xl leading-none text-black bg-orange-400 py-3 rounded-[64px]" onClick={handleLogin}>
            Đăng nhập
          </button>
        </div>
        <div className="flex flex-col items-center self-center mt-5 w-full max-w-[398px] text-zinc-100">
          <button className="flex items-center text-center justify-center bg-zinc-800 text-white py-3 px-7 rounded-[64px] w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/60e2c583c050e4144ff530c58b0a844f76ad69b2a4ce4e71e263c2acbbc2bb3a?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
              className="w-5 h-5 mr-2"
              alt="Google icon"
            />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
