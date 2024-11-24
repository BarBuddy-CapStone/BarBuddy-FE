import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBars, createStaff } from '../../../lib/service/adminService';
import { message } from 'antd';
import { TextField, InputAdornment } from '@mui/material';
import useValidateAccountForm from '../../../lib/hooks/useValidateAccountForm';
import { getAllBarsNoPage } from 'src/lib/service/barManagerService';

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
        pattern: "0[0-9]{9}"
    },
    { 
        label: "Email", 
        name: "email", 
        type: "email",
        placeholder: "Nhập email" 
    },
    { 
        label: "Ngày sinh", 
        name: "dob",
        type: "date"
    },
    {
        label: "Chi nhánh",
        name: "barId",
        type: "select",
        placeholder: "Chọn chi nhánh"
    }
];

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
                    <option value="">Chọn chi nhánh</option>
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

const AccountForm = () => {
    const navigate = useNavigate();
    const { validateForm } = useValidateAccountForm();
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        dob: "",
        status: 0,
        image: "",
        barId: ""
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageUrl, setImageUrl] = useState("https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674");
    const [imageFile, setImageFile] = useState(null);
    const [bars, setBars] = useState([]);
    const [confirmMessage, setConfirmMessage] = useState("Bạn có chắc chắn muốn tạo tài khoản này?");

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
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
                    image: imageDataUrl
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsPopupOpen(true);
    };

    const handleConfirm = async () => {
        try {
            const staffData = {
                email: formData.email.trim(),
                fullname: formData.fullname.trim(),
                phone: formData.phone.trim(),
                dob: formData.dob,
                status: 0,
                image: formData.image,
                barId: formData.barId
            };
            
            const response = await createStaff(staffData);
            if (response.data.statusCode === 200) {
                message.success(response.data.message || "Tạo tài khoản nhân viên thành công!");
                navigate("/manager/staff");
            }
        } catch (error) {
            console.error('Error creating staff:', error);
            if (error.response?.status === 400) {
                const apiErrors = {};
                if (error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    if (serverErrors.Email) apiErrors.email = serverErrors.Email[0];
                    if (serverErrors.Phone) apiErrors.phone = serverErrors.Phone[0];
                    if (serverErrors.Fullname) apiErrors.fullname = serverErrors.Fullname[0];
                    if (serverErrors.Dob) apiErrors.dob = serverErrors.Dob[0];
                }
                setErrors(apiErrors);
                message.error(error.response.data.message || "Dữ liệu không hợp lệ");
            } else {
                message.error("Có lỗi xảy ra khi tạo tài khoản nhân viên!");
            }
        }
        setIsPopupOpen(false);
    };

    return (
        <>
            <form className="flex gap-5 max-md:flex-col">
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

                <section className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full text-sm min-h-[454px] max-md:max-w-full">
                        {formFields.map((field) => (
                            <FormField
                                key={field.name}
                                {...field}
                                value={formData[field.name]}
                                onChange={handleChange}
                                error={errors[field.name]}
                                options={field.type === 'select' ? bars.map(bar => ({
                                    value: bar.barId,
                                    label: bar.barName
                                })) : []}
                            />
                        ))}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </section>
            </form>

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="font-bold text-lg">Xác nhận</h2>
                        <p>{confirmMessage}</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Đồng ý</button>
                            <button onClick={() => setIsPopupOpen(false)} className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default function StaffCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/manager/staff");
    };

    return (
        <main className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={handleBack}
                    className="text-3xl font-bold hover:text-gray-700 transition-colors"
                >
                    &#8592;
                </button>
                <h1 className="font-bold text-center flex-grow">THÊM TÀI KHOẢN NHÂN VIÊN</h1>
                <div className="w-8"></div>
            </header>
            <AccountForm />
        </main>
    );
}
