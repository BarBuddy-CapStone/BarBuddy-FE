import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerDetail, updateCustomerDetail } from 'src/lib/service/adminService'; // Import hàm gọi API
import { message } from 'antd'; // Thêm import message từ antd
import useValidateAccountForm from 'src/lib/hooks/useValidateAccountForm'; // Nhập hook xác thực
import LoadingSpinner from 'src/components/commonComponents/LoadingSpinner';

const ProfileField = ({ label, value, type = "text" }) => (
    <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
        <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full flex-shrink-0">
            {label}
        </div>
        <div className="w-[742px] max-w-full max-md:w-full flex-grow">
            <input
                type={type}
                className="px-6 py-3 rounded-md border border-neutral-200 shadow-sm w-full bg-gray-100"
                value={value || ''}
                disabled
            />
        </div>
    </div>
);

const StatusToggle = ({ status, onToggle }) => (
    <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
        <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full">
            Trạng thái
        </div>
        <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={status === 1} onChange={onToggle} />
                <div className={`w-12 h-6 rounded-full shadow-inner ${status === 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${status === 1 ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </label>
            <span className="ml-3">{status === 1 ? "Hoạt động" : "Không hoạt động"}</span>
        </div>
    </div>
);

export default function CustomerDetail() {
    const navigate = useNavigate();
    const { accountId } = useParams(); // Lấy ID từ URL params thay vì query params
    const [customerData, setCustomerData] = useState(null);
    const [formData, setFormData] = useState({}); // State để quản lý dữ liệu form
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // State để quản lý hiển thị popup

    useEffect(() => {
        const fetchCustomerDetail = async () => {
            setIsLoading(true);
            try {
                const response = await getCustomerDetail(accountId);
                setCustomerData(response.data.data);
                setFormData({
                    email: response.data.data.email,
                    fullname: response.data.data.fullname,
                    phone: response.data.data.phone,
                    dob: new Date(response.data.data.dob).toISOString().split('T')[0],
                    status: response.data.data.status,
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("Đã xảy ra lỗi khi tải thông tin");
            } finally {
                setIsLoading(false);
            }
        };

        if (accountId) {
            fetchCustomerDetail();
        }
    }, [accountId]);

    const handleBack = () => {
        navigate("/admin/customers");
    };

    const handleToggleStatus = () => {
        setFormData(prev => ({ ...prev, status: prev.status === 1 ? 0 : 1 }));
    };

    const handleUpdate = () => {
        setShowPopup(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            // Chỉ gửi status lên API
            const response = await updateCustomerDetail(accountId, {
                status: formData.status
            });
            
            if (response.data.statusCode === 200) {
                message.success("Cập nhật trạng thái thành công!");
                navigate("/admin/customers");
            } else {
                message.error(response.data.message || "Cập nhật trạng thái thất bại!");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
        setShowPopup(false);
    };

    return (
        <main className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
            <LoadingSpinner open={isLoading} />
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={handleBack}
                    className="text-3xl font-bold hover:text-gray-700 transition-colors"
                >
                    &#8592;
                </button>
                <h1 className="font-bold text-center flex-grow">THÔNG TIN TÀI KHOẢN CUSTOMER</h1>
                <div className="w-8"></div>
            </header>
            <div className="flex gap-5 max-md:flex-col">
                <aside className="flex flex-col w-[30%] max-md:ml-0 max-md:w-full">
                    <div className="relative">
                        <img
                            src={customerData?.image || "https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674"}
                            alt="User profile"
                            className="object-cover w-48 h-48 rounded-full"
                        />
                    </div>
                </aside>
                <section className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full text-sm max-md:max-w-full">
                        <ProfileField label="Họ và tên" value={formData.fullname} />
                        <ProfileField label="Số điện thoại" value={formData.phone} />
                        <ProfileField label="Email" value={formData.email} />
                        <ProfileField label="Ngày sinh" value={formData.dob} type="date" />
                        <StatusToggle status={formData.status} onToggle={handleToggleStatus} />
                        
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận cập nhật</h3>
                        <p>Bạn có chắc chắn muốn cập nhật trạng thái tài khoản?</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
