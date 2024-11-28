import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <div className="bg-neutral-900 min-h-screen text-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">
            Bar Buddy - Người Bạn Đồng Hành
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Khám phá không gian giải trí đẳng cấp cùng hệ thống quản lý bar thông minh
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-neutral-800 p-8 rounded-lg"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Sứ Mệnh</h2>
            <p className="text-gray-300 leading-relaxed">
              Bar Buddy ra đời với sứ mệnh mang đến trải nghiệm giải trí đẳng cấp và tiện lợi nhất cho người dùng. 
              Chúng tôi kết nối những người yêu thích không gian bar với những địa điểm tốt nhất tại Sài Gòn.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-neutral-800 p-8 rounded-lg"
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Tầm Nhìn</h2>
            <p className="text-gray-300 leading-relaxed">
              Trở thành nền tảng hàng đầu trong lĩnh vực kết nối và quản lý hệ thống bar, 
              mang đến những trải nghiệm giải trí độc đáo và an toàn cho cộng đồng.
            </p>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">Điểm Nổi Bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-3">Không Gian Đẳng Cấp</h3>
              <p className="text-gray-300">
                Hệ thống bar được tuyển chọn kỹ lưỡng, đảm bảo chất lượng và phong cách độc đáo
              </p>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🍸</span>
              </div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-3">Đồ Uống Đặc Sắc</h3>
              <p className="text-gray-300">
                Menu đa dạng với các loại cocktail độc đáo và đồ uống cao cấp
              </p>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-3">Đặt Chỗ Dễ Dàng</h3>
              <p className="text-gray-300">
                Hệ thống đặt chỗ thông minh, nhanh chóng và tiện lợi
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-amber-400 mb-6">Liên Hệ Với Chúng Tôi</h2>
          <div className="bg-neutral-800 p-8 rounded-lg max-w-2xl mx-auto">
            <p className="text-gray-300 mb-4">
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình khám phá những trải nghiệm tuyệt vời
            </p>
            <div className="space-y-2 text-gray-300">
              <p>Email: barbuddy@gmail.com</p>
              <p>Hotline: 0982502200</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 