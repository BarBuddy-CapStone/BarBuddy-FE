import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const userFields = [
    { label: 'Họ và tên', value: 'Nguyen Van A' },
    { label: 'Số điện thoại', value: '0906006699' },
    { label: 'Email', value: 'anguyenvan@gmail.com' },
    { label: 'Ngày sinh', value: '09/09/1999' },
    { label: 'Ngày tạo', value: 'August 18 2021- 15:20:56' }
];

function ProfileField({ label, value }) {
    return (
        <div className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
            <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full max-md:mb-2">
                {label}
            </div>
            <div className="w-[742px] max-w-full max-md:w-full">
                <div className="px-6 py-3 bg-white rounded-md border border-neutral-200 shadow-sm">
                    {value}
                </div>
            </div>
        </div>
    );
}

function StatusIndicator() {
    const [isActive, setIsActive] = useState(true);

    const toggleStatus = () => {
        setIsActive(!isActive);
    };

    return (
        <main className="flex items-center w-full text-black min-h-[64px] max-md:flex-col">
            <div className="font-medium text-right w-[152px] pr-4 max-md:text-left max-md:w-full max-md:mb-2">
                Trạng thái
            </div>
            <div className="flex items-center w-[742px] max-w-full max-md:w-full">
                {/* Toggle Button */}
                <button 
                    onClick={toggleStatus} 
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                >
                    <span 
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            isActive ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                </button>
                <div className="ml-3">
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </div>
            </div>
        </main>
    );
}

export default function CustomerDetail() {
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
                <h1 className="text-3xl font-bold text-center flex-grow">THÔNG TIN TÀI KHOẢN CUSTOMER</h1>
                <div className="w-8"></div> {/* Để cân bằng layout */}
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
                    <div className="flex flex-col w-full text-xl min-h-[454px] max-md:max-w-full">
                        {userFields.map((field, index) => (
                            <ProfileField key={index} label={field.label} value={field.value} />
                        ))}
                        <StatusIndicator />
                    </div>
                </section>
            </div>
            <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    Lưu
                </button>
            </div>
        </main>
    );
}

