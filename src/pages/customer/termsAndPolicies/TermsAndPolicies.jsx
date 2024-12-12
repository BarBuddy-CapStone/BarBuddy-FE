import React, { useEffect } from "react";
import { motion } from "framer-motion";
import warningDrink from "src/assets/image/WarningDrink.png";

const TermsAndPolicies = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-12 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          Điều Khoản và Chính Sách
        </h1>
        <p className="text-gray-400">
          Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ
        </p>
      </motion.div>

      <div className="grid gap-8">
        <motion.section
          className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
            <span className="text-3xl mr-3">📋</span>
            1. Quy Định Đặt Bàn
          </h2>
          <ul className="space-y-4 text-gray-300 ml-8">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Quý khách chỉ được đặt một khung giờ mỗi ngày tại một quán bar.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Số lượng bàn tối đa có thể đặt trong một lần là 5 bàn.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Khi quý khách chuyển sang khung giờ khác, danh sách bàn đã chọn
              trước đó sẽ bị hủy.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Quý khácch cần đặt ít nhất 1 bàn để tiến hành thanh toán.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
            <span className="text-3xl mr-3">💳</span>
            2. Chính Sách Thanh Toán
          </h2>
          <ul className="space-y-4 text-gray-300 ml-8">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Thanh toán được thực hiện thông qua các cổng thanh toán trực tuyến
              được hệ thống hỗ trợ.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Quý khách sẽ nhận được thông báo xác nhận sau khi thanh toán thành
              công.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Chúng tôi không áp dụng chính sách hoàn tiền cho các đơn đặt bàn
              đã được thanh toán.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
            <span className="text-3xl mr-3">🕒</span>
            3. Chính Sách Hủy Đặt Bàn
          </h2>
          <ul className="space-y-4 text-gray-300 ml-8">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Quý khách có thể hủy đặt bàn miễn phí trước khi thanh toán.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Sau khi thanh toán, quý khách chỉ có thể hủy đặt bàn trước 2 giờ
              so với thời gian đã đặt.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Đối với đặt bàn thường, vui lòng check-in trước 1 giờ so với thời
              gian đặt để tránh bị hủy tự động.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Đối với đặt bàn kèm đồ uống, quý khách có thể check-in trong suốt
              khung giờ hoạt động của quán.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
            <span className="text-3xl mr-3">⭐</span>
            4. Đánh Giá Dịch Vụ
          </h2>
          <ul className="space-y-4 text-gray-300 ml-8">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Quý khách có thể đánh giá và chia sẻ trải nghiệm sau khi sử dụng
              dịch vụ.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Mỗi lần đặt bàn, quý khách có thể gửi một đánh giá.
            </li>
          </ul>
        </motion.section>

        <motion.section
          className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
            <span className="text-3xl mr-3">📜</span>
            5. Quy Định Chung
          </h2>
          <ul className="space-y-4 text-gray-300 ml-8">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              <span>
                Quý khách{" "}
                <span className="text-yellow-500 font-semibold">
                  phải từ 18 tuổi trở lên
                </span>{" "}
                để sử dụng dịch vụ đặt bàn.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Vui lòng cung cấp thông tin chính xác khi đăng ký và đặt bàn.
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Mọi thông tin cá nhân của quý khách sẽ được bảo mật theo quy định.
            </li>
          </ul>
        </motion.section>

        <motion.div
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-lg border border-orange-500/50 mt-4"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/3">
              <motion.img
                src={warningDrink}
                alt="Cảnh báo đồ uống có cồn"
                className="w-full h-auto rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400 flex items-center">
                <span className="text-3xl mr-3">⚠️</span>
                Lưu ý về sử dụng đồ uống có cồn
              </h2>
              <div className="text-gray-300 space-y-3">
                <p className="font-medium">
                  Vì sự an toàn của quý khách và mọi người, chúng tôi khuyến
                  cáo:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="text-yellow-500 font-semibold">
                      Uống có trách nhiệm
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="text-yellow-500 font-semibold">
                      Không lái xe khi đã sử dụng đồ uống có cồn
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-500 mr-2">•</span>
                    <span>
                      Tuân thủ quy định về{" "}
                      <span className="text-yellow-500 font-semibold">
                        độ tuổi sử dụng đồ uống có cồn
                      </span>
                    </span>
                  </li>
                </ul>
                <p className="mt-4 text-yellow-500 font-medium border-l-4 border-yellow-500 pl-3">
                  Dịch vụ không dành cho người dưới 18 tuổi và phụ nữ đang mang
                  thai.
                  <br />
                  Chúng tôi có quyền từ chối phục vụ nếu phát hiện vi phạm.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsAndPolicies;
