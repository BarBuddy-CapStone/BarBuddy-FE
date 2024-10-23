import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStaffDetail, getBars, updateStaffDetail } from 'src/lib/service/adminService'; // Import API calls
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import useValidateAccountForm from 'src/lib/hooks/useValidateAccountForm';

const ProfileField = ({ label, value, onChange, isDropdown, options }) => (
    <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
        <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full">
            {label}
        </div>
        <div className="w-[742px] max-w-full max-md:w-full">
            {isDropdown ? (
                <select
                    className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                    value={value}
                    onChange={onChange}
                >
                    {options.map((option) => (
                        <option key={option.barId} value={option.barId}>
                            {option.barName}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={label === "Ngày sinh" ? "date" : "text"} // Thay đổi type thành "date" nếu label là "Ngày sinh"
                    className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                    value={value} // Sử dụng value thay vì defaultValue
                    onChange={onChange}
                />
            )}
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

const Popup = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="font-bold text-lg">Xác nhận</h2>
            <p>{message}</p>
            <div className="mt-4 flex justify-end">
                <button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Đồng ý</button>
                <button onClick={onCancel} className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Hủy</button>
            </div>
        </div>
    </div>
);

export default function StaffDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const accountId = new URLSearchParams(location.search).get('accountId');
    const [staffDetail, setStaffDetail] = useState(null);
    const [formData, setFormData] = useState({});
    const [bars, setBars] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("Bạn có chắc chắn muốn cập nhật thông tin?");
    const [errors, setErrors] = useState({}); // Thêm state để lưu trữ lỗi
    const { validateForm } = useValidateAccountForm();

    useEffect(() => {
        const fetchStaffDetail = async () => {
            try {
                const response = await getStaffDetail(accountId);
                if (response.status === 200) {
                    setStaffDetail(response.data.data);
                    setFormData({
                        email: response.data.data.email,
                        fullname: response.data.data.fullname,
                        phone: response.data.data.phone,
                        dob: new Date(response.data.data.dob).toISOString().split('T')[0],
                        barId: response.data.data.barId,
                        status: response.data.data.status,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch staff detail:", error);
            }
        };

        const fetchBars = async () => {
            try {
                const response = await getBars(); // Gọi API lấy danh sách quán bar
                if (response.status === 200) { // Cập nhật điều kiện kiểm tra
                    setBars(response.data.data); // Cập nhật cách truy cập dữ liệu
                }
            } catch (error) {
                console.error("Failed to fetch bars:", error);
            }
        };

        if (accountId) {
            fetchStaffDetail();
            fetchBars();
        }
    }, [accountId]);

    const handleBack = () => {
        navigate("/admin/staff");
    };

    const handleUpdate = async () => {
        const validationErrors = validateForm(formData); // Gọi hàm validateForm
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Cập nhật state lỗi nếu có
            return; // Dừng lại nếu có lỗi
        }
        setShowPopup(true); // Hiện popup xác nhận
    };

    const handleConfirmUpdate = async () => {
        try {
            const updatedData = {
                email: formData.email,
                fullname: formData.fullname,
                phone: formData.phone,
                dob: new Date(formData.dob).toISOString(), // Chuyển đổi ngày sinh sang định dạng ISO
                barId: formData.barId,
                status: formData.status === 1 ? 1 : 0
            };
            const response = await updateStaffDetail(accountId, updatedData);
            if (response.status === 200) {
                navigate("/admin/staff", { state: { successMessage: "Thông tin đã được cập nhật thành công!" } }); // Chuyển hướng về trang StaffManagement
            }
        } catch (error) {
            console.error("Failed to update staff detail:", error);
            toast.error("Cập nhật thông tin thất bại!");
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
    };

    const handleToggleStatus = () => {
        setFormData({ ...formData, status: formData.status === 1 ? 0 : 1 });
    };

    if (!staffDetail) return <div>Loading...</div>;

    return (
        <main className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={handleBack}
                    className="text-3xl font-bold hover:text-gray-700 transition-colors"
                >
                    &#8592;
                </button>
                <h1 className="font-bold text-center flex-grow">THÔNG TIN TÀI KHOẢN STAFF</h1>
                <div className="w-8"></div>
            </header>
            <div className="flex gap-5 max-md:flex-col">
                <aside className="flex flex-col w-[30%] max-md:ml-0 max-md:w-full">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d61fbfce841ecc9d25137354a868eca4d9a5b3f3a4e622afcda63d7cca503674?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b"
                        alt="User profile"
                        className="object-contain shrink-0 mt-3 -mr-8 max-w-full aspect-square w-full"
                    />
                </aside>
                <section className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col w-full text-sm min-h-[454px] max-md:max-w-full">
                        {errors.fullname && <span className="text-center my-2 text-red-500">{errors.fullname}</span>}

                        <ProfileField label="Họ và tên" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                        {errors.phone && <span className="text-center my-2 text-red-500">{errors.phone}</span>}

                        <ProfileField label="Số điện thoại" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        {errors.email && <span className="text-center my-2 text-red-500">{errors.email}</span>}

                        <ProfileField label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        {errors.dob && <span className="text-center my-2 text-red-500">{errors.dob}</span>}

                        <ProfileField
                            label="Ngày sinh"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            isDropdown={false} // Đặt isDropdown thành false để sử dụng input chọn ngày
                        />
                        <ProfileField
                            label="Chi nhánh"
                            value={formData.barId}
                            onChange={(e) => setFormData({ ...formData, barId: e.target.value })}
                            isDropdown={true}
                            options={bars}
                        />
                        <StatusToggle status={formData.status} onToggle={handleToggleStatus} />
                    </div>
                </section>
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={handleUpdate} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    Cập nhật
                </button>
            </div>
            {showPopup && <Popup message={popupMessage} onConfirm={handleConfirmUpdate} onCancel={handleClosePopup} />}
            <ToastContainer />
        </main>
    );
}