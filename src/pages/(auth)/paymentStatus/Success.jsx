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
    <div className="flex justify-center items-center min-h-screen bg-zinc-900 px-4">
      <main className="w-full max-w-md p-8 bg-neutral-800 rounded-xl text-gray-200 shadow-lg">
        <section className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <h1 className="text-2xl font-bold text-center">Thanh toán thành công</h1>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center w-full text-lg">
              <span className="font-bold">Bob Smith</span>
              <span>+1 6546 654 542</span>
            </div>
            
            <hr className="border-amber-400" />
            
            <div className="space-y-2">
              <div className="flex items-center">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/99d1647f03e1de8a6223ac99ed7fbff9d159b63da4f07ffae2c8efd3e53b1296?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
                  alt=""
                  className="w-5 h-5 mr-3"
                />
                <span>23h30' - 17 December, 2024</span>
              </div>
              <div className="flex items-center">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/476f971bbf39982d0ce80a690f5cd8c0313187f593a6654e27b011225d88c39c?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
                  alt=""
                  className="w-5 h-5 mr-3"
                />
                <span>1x Bàn tiêu chuẩn</span>
              </div>
            </div>
            
            <hr className="border-amber-400" />
            
            <div className="space-y-2">
              {[
                { label: "Tổng số tiền", value: "8.433.900 VND" },
                { label: "Mã giao dịch", value: "da123dasda" },
                { label: "Nhà cung cấp", value: "VN Pay" },
                { label: "Phí thanh toán", value: "Miễn phí" },
                { label: "Chi nhánh", value: "Bar Buddy1" },
                { label: "Thời gian giao dịch", value: "22:29 - 06/09/2024" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <a href="/" className="mt-6 text-lg font-semibold text-amber-400 hover:underline">
            Trở Lại Trang Home ({countdown}s)
          </a>
        </section>
      </main>
    </div>
  );
}

export default Success;
