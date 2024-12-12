import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="max-w-5xl mx-auto px-4 py-12 text-white"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div 
                className="text-center mb-12"
                variants={itemVariants}
            >
                <h1 className="text-4xl font-bold text-orange-500 mb-4">Chính Sách Bảo Mật</h1>
                <p className="text-gray-400">Cam kết bảo vệ thông tin cá nhân của khách hàng</p>
            </motion.div>

            <div className="grid gap-8">
                <motion.section 
                    className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
                        <span className="text-3xl mr-3">🔒</span>
                        1. Thông Tin Thu Thập
                    </h2>
                    <ul className="space-y-4 text-gray-300 ml-8">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Thông tin cá nhân: họ tên, email, số điện thoại, ngày sinh
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Thông tin đặt bàn và lịch sử giao dịch
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Phản hồi và đánh giá của khách hàng
                        </li>
                    </ul>
                </motion.section>

                <motion.section 
                    className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
                        <span className="text-3xl mr-3">🛡️</span>
                        2. Mục Đích Sử Dụng
                    </h2>
                    <ul className="space-y-4 text-gray-300 ml-8">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Xác thực và quản lý tài khoản người dùng
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Xử lý đơn đặt bàn và thanh toán
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Cải thiện chất lượng dịch vụ
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Gửi thông báo về đơn đặt bàn và khuyến mãi
                        </li>
                    </ul>
                </motion.section>

                <motion.section 
                    className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
                        <span className="text-3xl mr-3">🔐</span>
                        3. Bảo Mật Thông Tin
                    </h2>
                    <ul className="space-y-4 text-gray-300 ml-8">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Mã hóa thông tin thanh toán và dữ liệu nhạy cảm
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Giới hạn quyền truy cập thông tin khách hàng
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Định kỳ kiểm tra và cập nhật hệ thống bảo mật
                        </li>
                    </ul>
                </motion.section>

                <motion.section 
                    className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center">
                        <span className="text-3xl mr-3">📜</span>
                        4. Quyền Của Khách Hàng
                    </h2>
                    <ul className="space-y-4 text-gray-300 ml-8">
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Quyền truy cập và chỉnh sửa thông tin cá nhân
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Quyền yêu cầu xóa tài khoản và dữ liệu
                        </li>
                        <li className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            Quyền từ chối nhận thông báo quảng cáo
                        </li>
                    </ul>
                </motion.section>

                <motion.div 
                    className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-lg border border-orange-500/50 mt-4"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-orange-400 flex items-center">
                        <span className="text-3xl mr-3">📞</span>
                        Liên Hệ Về Vấn Đề Bảo Mật
                    </h2>
                    <div className="text-gray-300 space-y-3">
                        <p className="font-medium">
                            Nếu quý khách có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ:
                        </p>
                        <ul className="space-y-2 ml-8">
                            <li className="flex items-center">
                                <span className="text-orange-500 mr-2">•</span>
                                Email: barbuddy05924@gmail.com
                            </li>
                            <li className="flex items-center">
                                <span className="text-orange-500 mr-2">•</span>
                                Hotline: 0982502200
                            </li>
                        </ul>
                        <p className="mt-4 text-yellow-500 font-medium border-l-4 border-yellow-500 pl-3">
                            Chúng tôi cam kết bảo vệ thông tin của quý khách và liên tục cập nhật các biện pháp bảo mật mới nhất.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicy; 