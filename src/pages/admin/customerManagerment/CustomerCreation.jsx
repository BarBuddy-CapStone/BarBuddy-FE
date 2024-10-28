import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { createCustomer } from 'src/lib/service/adminService'; // Thêm import hàm createCustomer
import useValidateAccountForm from '../../../lib/hooks/useValidateAccountForm'; // Import hook validate
import { TextField, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';

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
        image: "" // Thêm image mặc định là rỗng
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Thêm state cho Popup
    const [errors, setErrors] = useState({}); // Thêm state để lưu trữ lỗi
    const [imageUrl, setImageUrl] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674");
    const [imageFile, setImageFile] = useState(null);

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
            // Tạo customerData với đầy đủ thông tin bao gồm cả image
            const customerData = {
                email: formData.email,
                fullname: formData.fullname,
                phone: formData.phone,
                dob: formData.dob,
                status: 0,
                image: imageUrl // Thêm imageUrl vào data gửi đi
            };
            
            await createCustomer(customerData);
            navigate("/admin/customers", { 
                state: { successMessage: "Tạo tài khoản thành công!" } 
            });
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo tài khoản!");
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
            <form className="flex gap-8" onSubmit={handleSubmit}>
                {/* Phần ảnh bên trái */}
                <div className="w-1/4">
                    <div className="relative w-48 h-48"> {/* Thêm kích thước cố định */}
                        <img
                            src={imageUrl}
                            alt="User profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                        {/* Sửa lại vị trí và style của nút upload để giống CustomerDetail */}
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
                </div>

                {/* Phần form bên phải */}
                <div className="flex-1 space-y-4">
                    {formFields.map((field) => (
                        <FormField
                            key={field.name}
                            {...field}
                            value={formData[field.name]}
                            onChange={handleChange}
                            error={errors[field.name]}
                        />
                    ))}
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Thêm
                        </button>
                    </div>
                </div>
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

const FormField = ({ label, name, type, value, onChange, placeholder, pattern, error }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="font-medium text-gray-700">
                {label}
            </label>
            <TextField
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                inputProps={{
                    pattern: pattern
                }}
                fullWidth
                variant="outlined"
                size="medium"
                error={!!error}
                helperText={error}
                InputProps={{
                    endAdornment: type === "tel" && (
                        <InputAdornment position="end">
                            VN (+84)
                        </InputAdornment>
                    )
                }}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    pattern: PropTypes.string,
    error: PropTypes.string // Thêm error vào PropTypes
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

export default function CustomerCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/admin/customers");
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
                <h1 className="text-3xl font-bold text-center flex-grow">THÊM TÀI KHOẢN</h1>
                <div className="w-8"></div>
            </header>
            <div className="w-full max-w-6xl mx-auto">
                <AccountForm />
            </div>
        </main>
    );
}
