import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "src/assets/image/errorAnimation.json";

function Error() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-100px)] bg-zinc-900 px-4">
      <main className="w-full max-w-sm p-6 bg-neutral-800 rounded-xl text-gray-200 shadow-lg">
        <section className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20">
            <Lottie animationData={errorAnimation} loop={false} />
          </div>
          <h1 className="text-xl font-bold text-center text-yellow-500">Lỗi giao dịch</h1>
          
          <p className="text-center text-sm">
            Đã xảy ra lỗi trong quá trình xử lý giao dịch. Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.
          </p>
          
          <a href="/" className="mt-4 text-sm font-semibold text-amber-400 hover:underline">
            Trở Lại Trang Home ({countdown}s)
          </a>
        </section>
      </main>
    </div>
  );
}

export default Error;
