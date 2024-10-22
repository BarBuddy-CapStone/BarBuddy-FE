import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "src/assets/image/successAnimation.json"; // Bạn cần tạo file JSON này

function Success() {
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
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <h1 className="text-xl font-bold text-center text-green-400">Thanh toán thành công</h1>
          
          <p className="text-center text-sm">
            Bạn đã thanh toán thành công. Cảm ơn đã tin tưởng và đặt bàn!
          </p>
          
          <a href="/" className="mt-4 text-sm font-semibold text-amber-400 hover:underline">
            Trở Lại Trang Home ({countdown}s)
          </a>
        </section>
      </main>
    </div>
  );
}

export default Success;
