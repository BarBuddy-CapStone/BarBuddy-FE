import React from 'react';
import { useNavigate } from 'react-router-dom';

const customerData = [
    { name: "Customer 1", birthDate: "19/09/2000", email: "barbuddy111111111111@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 2", birthDate: "19/09/2001", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 3", birthDate: "19/09/2002", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 4", birthDate: "19/09/2003", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" }
];

function CustomerTableHeader() {
    return (
        <thead>
            <tr className="bg-slate-400 text-neutral-900">
                <th className="px-4 py-2 border">Họ và tên</th>
                <th className="px-4 py-2 border">Ngày sinh</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Số điện thoại</th>
                <th className="px-4 py-2 border">Ngày đăng ký</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border"></th>
            </tr>
        </thead>
    );
}

function CustomerTableRow({ name, birthDate, email, phone, registrationDate, status }) {
    const navigate = useNavigate();
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border">{name}</td>
            <td className="px-4 py-2 border break-words">{birthDate}</td>
            <td className="px-4 py-2 border">{email}</td>
            <td className="px-4 py-2 border">{phone}</td>
            <td className="px-4 py-2 border">{registrationDate}</td>
            <td className="px-4 py-2 border">{status}</td>
            <td className="px-4 py-2 border">
                <button className="font-bold text-black" onClick={() => navigate('/customers/customer-detail')}>Xem chi tiết</button>
            </td>
        </tr>
    );
}

function SearchBar() {
    return (
        <div className="flex items-center gap-3 bg-white rounded-md border border-gray-300 p-2 w-full max-w-md">
            <input
                type="text"
                className="flex-grow p-2 border-none text-black"
                placeholder="Search customer's name"
                aria-label="Search customer's name"
            />
            <button className="p-2">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cd489bc186c2efdaa389942d6051382a5f532b00e1ab0fffecfefe29650e31dc?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b" alt="" className="object-contain w-6 h-6" />
            </button>
        </div>
    );
}

function AddCustomerButton() {
    const navigate = useNavigate();
    return (
        <button
            className="overflow-hidden gap-2 self-stretch pr-6 pl-6 w-auto italic bg-blue-600 max-h-[60px] rounded-[50px] whitespace-nowrap fixed-height"
            onClick={() => navigate('/customers/customer-creation')}
        >
            Thêm customer
        </button>
    );
}

// const AdminHeader = ({ className }) => {
//     return (
//         <header className={`flex justify-between items-center p-4 ${className}`}>
//             <h1 className="text-2xl font-bold text-sky-900">QUẢN LÝ TÀI KHOẢN STAFF</h1>
//             <div className="flex items-center space-x-4">
//                 <button aria-label="Notifications" className="p-1">
//                     <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c34835f58c1179a603170a4818c15626bcd875bc8fda99919b8ec07d2fa1753a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-6 h-6" />
//                 </button>
//                 <button aria-label="User Profile" className="p-1">
//                     <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e19980153730dfe9760688834a12cb497b5d07d1a906fdcbc4c2084f9e6116f?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-10 h-10 rounded-full" />
//                 </button>
//             </div>
//         </header>
//     );
// };

function CustomerManagement() {
    return (
        <>
            {/* <AdminHeader className="bg-white shadow-sm" /> */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex gap-5 justify-between items-center max-w-full text-lg text-center text-white w-[800px] max-md:mt-10">
                        <SearchBar />
                        <AddCustomerButton />
                    </div>
                    <div className="flex overflow-hidden flex-col mt-14 ml-16 max-w-full text-sm leading-5 bg-white rounded-xl shadow-[0px_45px_112px_rgba(0,0,0,0.06)] text-zinc-800 w-[1050px] max-md:mt-10">
                        <table className="min-w-full table-auto border-collapse">
                            <CustomerTableHeader />
                            <tbody>
                                {customerData.map((staff, index) => (
                                    <CustomerTableRow key={index} {...staff} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

export default CustomerManagement;