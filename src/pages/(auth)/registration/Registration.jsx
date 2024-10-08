import React from 'react';

const Registration = ({ onClose, onSwitchToLogin }) => {
  return (
    <div className="relative flex flex-col px-7 py-11 w-full max-w-xl rounded-xl bg-zinc-900" style={{ borderRadius: '16px' }}> {/* Add `relative` class here */}
      {/* Tiêu đề */}
      <div className='relative w-full'>
        <div className="flex gap-0.5 self-start text-2xl text-orange-400">
          <div className='font-notoSansSC text-2xl'>Đăng ký</div>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 z-10"  /* Set button inside relative container */
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
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Họ và tên</div>
          <input
            type="text"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="nguyenvana"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Mật khẩu</div>
          <input
            type="password"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="••••••••"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Nhập lại mật khẩu</div>
          <input
            type="password"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="••••••••"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Ngày sinh</div>
          <input
            type="date"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="text-xs text-gray-400">Số điện thoại</div>
          <input
            type="number"
            className="px-5 py-3 mt-2 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
            placeholder="123123123"
          />
        </div>
      </div>

      {/* Nút và liên kết */}
      <div className="flex justify-between items-center mt-6">
        <button className="flex-1 text-base bg-orange-400 text-black py-3 px-5 rounded-[64px] w-full max-w-[50%]">
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
