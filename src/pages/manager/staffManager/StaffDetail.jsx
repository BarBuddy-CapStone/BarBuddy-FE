import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStaffById, updateStaff } from 'src/lib/service/staffService';
import { message } from 'antd';
import useValidateAccountForm from 'src/lib/hooks/useValidateAccountForm';
import { getAllBarsNoPage } from 'src/lib/service/barManagerService';

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
                    <option value={options.barId}>{options.barName}</option>
                </select>
            ) : (
                <input
                    type={label === "Ngày sinh" ? "date" : "text"}
                    className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm w-full"
                    value={value}
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
    const { id } = useParams();
    const [staffDetail, setStaffDetail] = useState(null);
    const [formData, setFormData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("Bạn có chắc chắn muốn cập nhật thông tin?");
    const [errors, setErrors] = useState({});
    const { validateForm } = useValidateAccountForm();
    const [isLoading, setIsLoading] = useState(true);
    const [staffImage, setStaffImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [bars, setBars] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch bars
                const barsResponse = await getAllBarsNoPage();
                if (barsResponse?.data?.data?.onlyBarIdNameResponses) {
                    setBars(barsResponse.data.data.onlyBarIdNameResponses);
                } else {
                    console.error('Invalid bars data:', barsResponse);
                    setBars([]);
                    message.error("Không thể tải danh sách bar");
                }

                // Fetch staff detail
                const response = await getStaffById(id);
                if (response.data.statusCode === 200) {
                    const staffData = response.data.data;
                    setStaffDetail(staffData);
                    setFormData({
                        email: staffData.email,
                        fullname: staffData.fullname,
                        phone: staffData.phone,
                        dob: new Date(staffData.dob).toISOString().split('T')[0],
                        barId: staffData.barId,
                        status: staffData.status,
                        image: staffData.image
                    });
                    setImageUrl(staffData.image);
                } else {
                    message.error("Không thể tải thông tin nhân viên");
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                message.error("Đã xảy ra lỗi khi tải thông tin");
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleBack = () => {
        navigate("/manager/staff");
    };

    const handleUpdate = async () => {
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setShowPopup(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            const updatedData = {
                email: formData.email,
                fullname: formData.fullname,
                phone: formData.phone,
                dob: new Date(formData.dob).toISOString(),
                barId: formData.barId,
                status: formData.status === 1 ? 1 : 0,
                image: formData.image // Thêm image vào data update
            };
            const response = await updateStaff(id, updatedData);
            if (response.data.statusCode === 200) {
                message.success("Thông tin đã được cập nhật thành công!");
                navigate("/manager/staff");
            }
        } catch (error) {
            console.error("Failed to update staff detail:", error);
            message.error("Cập nhật thông tin thất bại!");
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleToggleStatus = () => {
        setFormData({ ...formData, status: formData.status === 1 ? 0 : 1 });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result // Cập nhật image trong formData
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) return <div>Đang tải...</div>;
    if (!staffDetail) return <div>Không tìm thấy thông tin nhân viên</div>;

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
                    <div className="relative">
                        <img
                            src={imageUrl || "https://via.placeholder.com/200"} // Sử dụng imageUrl từ API
                            alt={formData.fullname}
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
                            isDropdown={false}
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
        </main>
    );
}
