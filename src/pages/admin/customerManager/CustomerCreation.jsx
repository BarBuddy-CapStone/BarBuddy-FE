import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { createCustomer } from 'src/lib/service/adminService'; // Thêm import hàm createCustomer
import useValidateAccountForm from '../../../lib/hooks/useValidateAccountForm'; // Import hook validate

const formFields = [
    { label: "Họ và tên", name: "fullname", type: "text" },
    { label: "Số điện thoại", name: "phone", type: "tel" },
    { label: "Email", name: "email", type: "email" },
    { label: "Ngày sinh", name: "birthDate", type: "date" },
];

const AccountForm = () => {
    const { validateForm } = useValidateAccountForm(); // Sử dụng hook validate
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        birthDate: ""
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Thêm state cho Popup
    const [errors, setErrors] = useState({}); // Thêm state để lưu trữ lỗi

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
        const customerData = {
            email: formData.email, // Đảm bảo rằng tên trường khớp với yêu cầu
            fullname: formData.fullname,
            phone: formData.phone,
            dob: formData.birthDate, // Đổi tên trường thành 'dob'
            status: 0 // Thêm trường status với giá trị mặc định
        };
        try {
            await createCustomer(customerData); // Gọi hàm createCustomer với customerData đã chỉnh sửa
            toast.success("Tài khoản đã được thêm thành công")
            setIsPopupOpen(false); // Đóng Popup sau khi thành công
        } catch (error) {
            toast.error("Đã xảy ra lỗi trong quá trình thực hiện")
            console.error("Error creating customer:", error);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // Đóng Popup
    };

    return (
        <>
            <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {formFields.map((field) => (
                        <div key={field.name}>
                            {errors[field.name] && <p className="text-red-500 mb-1">{errors[field.name]}</p>}
                            <FormField {...field} value={formData[field.name]} onChange={handleChange} />
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        Thêm
                    </button>
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
}

const FormField = ({ label, name, type, value, onChange, options }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-2 font-medium">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
}

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
                <div className="w-8"></div> {/* Để cân bằng layout */}
            </header>
            <section className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/4 flex justify-center md:justify-start">
                    <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b"
                            alt="User profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </aside>
                <div className="flex-grow">
                    <AccountForm />
                </div>
            </section>
            <ToastContainer />
        </main>
    )
}