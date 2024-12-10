import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { createManager, getBars } from 'src/lib/service/adminService'; // Thêm getBars
import useValidateAccountForm from '../../../lib/hooks/useValidateAccountForm'; // Import hook validate
import { TextField, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import { getAllBarsNoPage } from 'src/lib/service/barManagerService'; // Import hàm mới

const formFields = [
    { 
        label: "Họ và tên", 
        name: "fullname", 
        type: "text",
        placeholder: "Nhập họ và tên" 
    },
    { 
        label: "Số điện thoại", 
        name: "phone", 
        type: "tel",
        placeholder: "Nhập số điện thoại",
        pattern: "0[0-9]{9}" // Pattern cho số điện thoại VN
    },
    { 
        label: "Email", 
        name: "email", 
        type: "email",
        placeholder: "Nhập email" 
    },
    { 
        label: "Ngày sinh", 
        name: "dob", // Đổi từ birthDate thành dob theo API
        type: "date"
    },
    {
        label: "Bar",
        name: "barId",
        type: "select",
        placeholder: "Chọn bar"
    }
];

const AccountForm = () => {
    const navigate = useNavigate(); // Khai báo useNavigate
    const { validateForm } = useValidateAccountForm(); // Sử dụng hook validate
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        dob: "", // Đổi từ birthDate thành dob
        status: 0, // Thêm status mặc định là 0
        image: "", // Thêm image mặc định là rỗng
        barId: "" // Thêm barId vào formData
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Thêm state cho Popup
    const [errors, setErrors] = useState({}); // Thêm state để lưu trữ lỗi
    const [imageUrl, setImageUrl] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674");
    const [imageFile, setImageFile] = useState(null);
    const [bars, setBars] = useState([]);

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const response = await getAllBarsNoPage();

                if (response?.data?.data?.onlyBarIdNameResponses) {
                    const barsList = response.data.data.onlyBarIdNameResponses;
                    setBars(barsList);
                    if (barsList.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            barId: barsList[0].barId
                        }));
                    }
                } else {
                    console.error('Invalid bars data structure:', response);
                    setBars([]);
                    message.error("Không thể tải danh sách bar");
                }
            } catch (error) {
                console.error("Failed to fetch bars:", error);
                setBars([]);
                message.error("Không thể tải danh sách bar");
            }
        };
        fetchBars();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Dừng lại nếu có lỗi
        }
        setIsPopupOpen(true); // Mở Popup khi gửi biểu mẫu
    };

    const handleConfirm = async () => {
        try {
            const managerData = {
                email: formData.email,
                fullname: formData.fullname,
                phone: formData.phone,
                dob: formData.dob,
                status: 0,
                image: imageUrl,
                barId: formData.barId
            };
            
            const response = await createManager(managerData);
            if (response.data.statusCode === 200) {
                message.success("Tạo tài khoản quản lý thành công!");
                navigate("/admin/managers");
            }
        } catch (error) {
            console.error('Error creating manager:', error);
            if (error.response?.status === 400) {
                message.error(error.response.data.message || "Dữ liệu không hợp lệ");
            } else {
                message.error("Có lỗi xảy ra khi tạo tài khoản quản lý!");
            }
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // Đóng Popup
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

    return (
        <>
            <form className="flex gap-5 max-md:flex-col" onSubmit={handleSubmit}>
                {/* Phần ảnh bên trái - điều chỉnh width và responsive */}
                <aside className="flex flex-col w-[30%] max-md:ml-0 max-md:w-full">
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt="User profile"
                            className="object-cover w-48 h-48 rounded-full"
                        />
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

                {/* Phần form bên phải - điều chỉnh min-height và margin */}
                <section className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full text-sm max-md:max-w-full">
                        {formFields.map((field) => (
                            <FormField
                                key={field.name}
                                {...field}
                                value={formData[field.name]}
                                onChange={handleChange}
                                error={errors[field.name]}
                                options={field.type === 'select' ? bars.map(bar => ({
                                    value: bar.barId,
                                    label: bar.barName || 'Unnamed Bar'
                                })) : []}
                            />
                        ))}
                        {/* Di chuyển nút Thêm vào trong div này và điều chỉnh margin */}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </section>
            </form>
            {isPopupOpen && (
                <Popup 
                    message="Bạn có chắc chắn muốn tạo tài khoản này?" 
                    onClose={handleClosePopup} 
                    onConfirm={handleConfirm} 
                />
            )}
        </>
    );
};

const FormField = ({ label, name, type, value, onChange, placeholder, pattern, error, options }) => (
    <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
        <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full flex-shrink-0">
            {label}
        </div>
        <div className="w-[742px] max-w-full max-md:w-full flex-grow">
            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    pattern={pattern}
                    className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                />
            )}
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
    </div>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.array
};

const Popup = ({ message, onClose, onConfirm }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="font-bold text-lg">Xác nhận</h2>
            <p>{message}</p>
            <div className="mt-4 flex justify-end">
                <button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Đồng ý</button>
                <button onClick={onClose} className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Hủy</button>
            </div>
        </div>
    </div>
);

export default function ManagerCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/admin/managers");
    }

    return (
        <main className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={handleBack}
                    className="text-3xl font-bold hover:text-gray-700 transition-colors"
                >
                    &#8592;
                </button>
                <h1 className="font-bold text-center flex-grow">THÊM TÀI KHOẢN QUẢN LÝ</h1>
                <div className="w-8"></div>
            </header>
            <AccountForm />
        </main>
    );
}
