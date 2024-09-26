import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const formFields = [
    { label: "Họ và tên", name: "name", type: "text" },
    { label: "Số điện thoại", name: "phone", type: "tel" },
    { label: "Email", name: "email", type: "email" },
    { label: "Ngày sinh", name: "birthDate", type: "date" },
];

const AccountForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        birthDate: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(formData));
    };

    return (
        <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6">
                {formFields.map((field) => (
                    <FormField key={field.name} {...field} value={formData[field.name]} onChange={handleChange} />
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    Thêm
                </button>
            </div>
        </form>
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

export default function CustomerCreation() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/customers");
    }

    return (
        <>
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
        </>
    )
}
