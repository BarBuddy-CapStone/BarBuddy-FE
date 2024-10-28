import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { useNavigate } from 'react-router-dom';
import { getBars, createStaff } from '../../../lib/service/adminService'; // Import hàm createStaff
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toast
import useValidateAccountForm from '../../../lib/hooks/useValidateAccountForm'; // Import hook validate

const formFields = [
    { label: "Họ và tên", name: "fullname", type: "text" },
    { label: "Số điện thoại", name: "phone", type: "tel" },
    { label: "Email", name: "email", type: "email" },
    { label: "Ngày sinh", name: "dob", type: "date" },
];

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

const AccountForm = () => {
    const navigate = useNavigate();
    const { validateForm } = useValidateAccountForm(); // Sử dụng hook validate
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        dob: "",
        barId: ""
    });
    const [branchOptions, setBranchOptions] = useState([]); // Trạng thái cho branchOptions
    const [showPopup, setShowPopup] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setConfirmMessage("Bạn có chắc chắn muốn tạo tài khoản này?");
        setShowPopup(true);
    };

    const handleConfirm = async () => {
        setShowPopup(false);
        try {
            const response = await createStaff(formData);
            if(response.status === 200) {
                navigate("/manager/staff", { state: { successMessage: "Tài khoản đã được thêm thành công!" } });
            } else {
                navigate("/manager/staff", { state: { errorMessage: "Có lỗi xảy ra khi tạo tài khoản!" } });
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi tạo tài khoản:', error);
            toast.error('Có lỗi xảy ra khi tạo tài khoản!');
        }
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const response = await getBars();
                setBranchOptions(response.data.data);
            } catch (error) {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            }
        };

        fetchBars(); // Gọi hàm fetchBars khi component được mount
    }, []); // Chỉ chạy một lần khi component được mount

    return (
        <>
            <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {formFields.map((field) => (
                        <div key={field.name}>
                            {errors[field.name] && <p className="text-red-500">{errors[field.name]}</p>} {/* Đặt thông báo lỗi ở đây */}
                            <FormField {...field} value={formData[field.name]} onChange={handleChange} />
                        </div>
                    ))}
                    <FormField
                        label="Chi nhánh"
                        name="barId"
                        type="select"
                        options={branchOptions.map(bar => ({ value: bar.barId, label: bar.barName }))}
                        value={formData.barId}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        Thêm
                    </button>
                </div>
            </form>
            {showPopup && (
                <Popup message={confirmMessage} onClose={handleClose} onConfirm={handleConfirm} />
            )}
            <ToastContainer />
        </>
    );
}

const FormField = ({ label, name, type, value, onChange, options }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-2 font-medium">
                {label}
            </label>
            {type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Chọn chi nhánh</option>
                    {options.map((option) => ( // Sửa ở đây
                        <option key={option.value} value={option.value}>{option.label}</option> // Sử dụng option.label để hiển thị
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            )}
        </div>
    );
}

export default function StaffCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/manager/staff");
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
        </main>
    )
}