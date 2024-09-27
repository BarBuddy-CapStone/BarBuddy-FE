import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const customerData = [
    { name: "Customer 1", birthDate: "19/09/2000", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 2", birthDate: "19/09/2001", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 3", birthDate: "19/09/2002", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { name: "Customer 4", birthDate: "19/09/2003", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" }
];

const SearchCustomerName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex items-center gap-3 bg-white rounded-md border border-gray-300 w-full max-w-md fixed-height">
            <input
                type="text"
                className="flex-grow border-none text-black"
                placeholder="Search customer's name"
                aria-label="Search customer's name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-md" onClick={() => onSearch(searchTerm)}>
                <SearchIcon />
            </button>
        </div>
    );
}

const AddCustomerButton = () => {
    const navigate = useNavigate();
    return (
        <button
            className="overflow-hidden gap-2 self-stretch pr-6 pl-6 w-auto italic bg-blue-600 max-h-[60px] rounded-[50px] whitespace-nowrap fixed-height"
            onClick={() => navigate('/admin/customer-creation')}
        >
            Thêm customer
        </button>
    );
}

const CustomerTable = ({ customerData }) => (
    <table className="min-w-full text-lg table-auto border-collapse">
        <CustomerTableHeader />
        <tbody>
            {customerData.map((customer, index) => (
                <CustomerTableRow key={index} customer={customer} index={index} />
            ))}
        </tbody>
    </table>
);

const CustomerTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-b-2">
            {["Họ và tên", "Ngày sinh", "Email", "Số điện thoại", "Ngày đăng ký", "Status", ""].map((header, index) => (
                <th key={index} className="px-4 py-6 text-center">{header}</th>
            ))}
        </tr>
    </thead>
);

const CustomerTableRow = ({ customer, index }) => {
    const navigate = useNavigate();
    const rowClass = index % 2 === 0 ? "white" : "orange-50";
    const colorStatus = customer.status === "Active" ? "text-green-500" : "text-red-500";
    const statusColor = customer.status === "Active" ? "bg-green-500" : "bg-red-500"; // Thêm biến để xác định màu sắc hình tròn

    return (
        <tr className={`hover:bg-gray-200 transition duration-200 bg-${rowClass} border-b-2`}>
            {Object.values(customer).map((value, idx) => (
                <td key={idx} className={`px-4 py-6 text-center ${idx === 5 ? colorStatus : ''}`}>
                    {idx === 5 ? ( // Kiểm tra nếu là cột trạng thái
                        <div className="flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`} /> {/* Hình tròn màu sắc */}
                            {value}
                        </div>
                    ) : value}
                </td>
            ))}
            <td className="px-4 py-6 text-center">
                <button className="font-bold text-blue-600 hover:underline" onClick={() => navigate('/admin/customer-detail')}>Xem chi tiết</button>
            </td>
        </tr>
    );
}

const CustomerManagement = () => {
    const [filteredCustomers, setFilteredCustomers] = useState(customerData); // Thêm state để lưu danh sách khách hàng đã lọc

    const handleSearch = (searchTerm) => {
        const filtered = customerData.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered); // Cập nhật danh sách khách hàng đã lọc
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-5 max-w-full text-lg text-center text-white w-[800px] max-md:mt-10">
                    <SearchCustomerName onSearch={handleSearch} /> {/* Truyền hàm tìm kiếm vào component */}
                    <AddCustomerButton />
                </div>
                <div className="flex overflow-hidden flex-col mt-14 ml-16 max-w-full text-sm leading-5 bg-white rounded-xl shadow-[0px_45px_112px_rgba(0,0,0,0.06)] text-zinc-800 w-[1050px] max-md:mt-10">
                    <CustomerTable customerData={filteredCustomers} /> {/* Sử dụng danh sách khách hàng đã lọc */}
                </div>
            </div>
        </main>
    );
}

export default CustomerManagement;