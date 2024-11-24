import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCustomerDetail, updateCustomerDetail } from 'src/lib/service/adminService'; // Import hàm gọi API
import { message } from 'antd'; // Thêm import message từ antd
import useValidateAccountForm from 'src/lib/hooks/useValidateAccountForm'; // Nhập hook xác thực
import LoadingSpinner from 'src/components/commonComponents/LoadingSpinner';

const ProfileField = ({ label, value, onChange, type = "text" }) => ( // Thêm type với giá trị mặc định là "text"
    <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
        <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full flex-shrink-0">
            {label}
        </div>
        <div className="w-[742px] max-w-full max-md:w-full flex-grow">
            <input
                type={type} // Sử dụng type từ props
                className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                value={value} // Sử dụng value thay vì defaultValue
                onChange={onChange}
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

const Popup = ({ message, onClose, onConfirm }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="font-bold text-lg">Xác nhận</h2> {/* Thay đổi tiêu đề */}
            <p>{message}</p>
            <div className="mt-4 flex justify-end">
                <button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Đồng ý</button> {/* Thay đổi nút */}
                <button onClick={onClose} className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Hủy</button> {/* Thêm nút hủy */}
            </div>
        </div>
    </div>
);

export default function CustomerDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const accountId = new URLSearchParams(location.search).get('accountId'); // Lấy accountId từ URL
    const [customerData, setCustomerData] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State để quản lý hiển thị popup
    const [formData, setFormData] = useState({}); // State để quản lý dữ liệu form
    const [popupMessage, setPopupMessage] = useState(null); // Thêm state cho message
    const { validateForm } = useValidateAccountForm(); // Khởi tạo hook xác thực
    const [errors, setErrors] = useState({}); // Thêm state để lưu trữ lỗi
    const [updateSuccess, setUpdateSuccess] = useState(false); // Thêm state để theo dõi việc cập nhật thành công
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
                    image: response.data.data.image
                });
                setImageUrl(response.data.data.image);
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

    const handleUpdate = () => {
        const validationErrors = validateForm(formData); // Xác thực dữ liệu
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Cập nhật lỗi nếu có
            return; // Dừng lại nếu có lỗi
        }
        setPopupMessage("Bạn có chắc chắn muốn cập nhật thông tin?"); // Cập nhật nội dung popup
        setShowPopup(true); // Hiển thị popup
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleToggleStatus = () => {
        setFormData({ ...formData, status: formData.status === 1 ? 0 : 1 }); // Chuyển đổi trạng thái
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                setImageUrl(imageDataUrl);
                setFormData(prev => ({
                    ...prev,
                    image: imageDataUrl // Cập nhật image trong formData
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const onConfirm = async () => {
        try {
            const updatedData = {
                email: formData.email,
                fullname: formData.fullname,
                phone: formData.phone,
                dob: formData.dob,
                status: formData.status === 1 ? 1 : 0,
                image: formData.image
            };

            const response = await updateCustomerDetail(accountId, updatedData);
            if (response.data.statusCode === 200) {
                message.success("Thông tin đã được cập nhật thành công!");
                navigate("/admin/customers");
            } else {
                message.error(response.data.message || "Cập nhật thông tin thất bại!");
            }
        } catch (error) {
            console.error("Error updating customer detail:", error);
            if (error.response?.status === 400) {
                message.error(error.response.data.message || "Dữ liệu không hợp lệ");
            } else {
                message.error("Có lỗi xảy ra khi cập nhật thông tin!");
            }
        }
        setShowPopup(false);
    };

    if (!customerData) return <div>Loading...</div>; // Hiển thị loading khi chưa có dữ liệu

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
                <div className="w-8"></div> {/* Để cân bằng layout */}
            </header>
            <div className="flex gap-5 max-md:flex-col">
                <aside className="flex flex-col w-[30%] max-md:ml-0 max-md:w-full">
                    <div className="relative">
                        <img
                            src={imageUrl || "https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674"}
                            alt="User profile"
                            className="object-cover w-48 h-48 rounded-full"
                        />
                        {/* Thêm nút upload ảnh */}
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </label>
                    </div>
                </aside>
                <section className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full text-sm max-md:max-w-full">
                        {errors.fullname && <span className="text-center my-2 text-red-500">{errors.fullname}</span>} {/* Hiển thị lỗi */}
                        <ProfileField label="Họ và tên" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                        
                        {errors.phone && <span className="text-center my-2 text-red-500">{errors.phone}</span>} {/* Hiển thị lỗi */}
                        <ProfileField label="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        
                        {errors.email && <span className="text-center my-2 text-red-500">{errors.email}</span>} {/* Hiển thị lỗi */}
                        <ProfileField label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        
                        {errors.dob && <span className="text-center my-2 text-red-500">{errors.dob}</span>} {/* Hiển thị lỗi */}
                        <ProfileField label="Ngày sinh" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} type="date" /> 
                        
                        <StatusToggle status={formData.status} onToggle={handleToggleStatus} /> {/* Thêm nút trạng thái */}

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
            {showPopup && <Popup message={popupMessage} onClose={handleClosePopup} onConfirm={onConfirm} />}
        </main>
    );
}
