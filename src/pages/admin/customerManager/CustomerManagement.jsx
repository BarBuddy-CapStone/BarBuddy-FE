import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const customerData = [
    { id: 1, name: "Customer 1", birthDate: "19/09/2000", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { id: 2, name: "Customer 2", birthDate: "19/09/2001", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { id: 3, name: "Customer 3", birthDate: "19/09/2002", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" },
    { id: 4, name: "Customer 4", birthDate: "19/09/2003", email: "barbuddy1@gmail.com", phone: "0909090909", registrationDate: "19/09/2024", status: "Active" }
];

const SearchCustomerName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex items-center gap-3 bg-white rounded-md border border-gray-300 max-w-md">
            <input
                type="text"
                className="flex-grow border-none px-1 py-1 text-black"
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
            className="overflow-hidden gap-2 self-stretch pr-6 pl-6 w-auto italic bg-blue-600 max-h-[60px] rounded-[50px] whitespace-nowrap"
            onClick={() => navigate('/admin/customer-creation')}
        >
            Thêm customer
        </button>
    );
}

const CustomerTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-b-2">
            {["Họ và tên", "Ngày sinh", "Email", "Số điện thoại", "Ngày đăng ký", "Status", ""].map((header, index) => (
                <th key={index} className="px-4 py-6 text-center">{header}</th>
            ))}
        </tr>
    </thead>
);

const CustomerTableRow = ({ customer, isEven, onViewDetails }) => {
    const rowClass = isEven ? "bg-gray-50" : "bg-white shadow-sm hover:bg-gray-100 transition duration-150";
    const statusClass = getStatusClass(customer.status); // Lấy lớp trạng thái từ hàm getStatusClass

    return (
        <tr className={`${rowClass} text-sm hover:bg-gray-100 transition duration-150`}>
            <td className="px-4 py-6 text-center align-middle">
                {customer.name}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.birthDate}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.email}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.phone}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.registrationDate}
            </td>
            <td className="flex justify-center items-center px-4 py-6 align-middle">
                <div className={`flex justify-center items-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
                    {customer.status}
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-2 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    onClick={() => onViewDetails(customer.id)}
                >
                    Xem chi tiết
                </button>
            </td>
        </tr>
    );
};

// Hàm để xác định class của status
function getStatusClass(status) {
    switch (status) {
        case "Active":
            return "bg-green-500 text-white";
        case "Inactive":
            return "bg-red-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
}

const CustomerTable = ({ customerData }) => {
    const navigate = useNavigate();
    const handleViewDetail = (id) => {
        navigate(`/admin/customer-detail?id=${id}`)
    };

    return (
        <table className="min-w-full text-sm table-auto border-collapse">
            <CustomerTableHeader />
            <tbody>
                {customerData.map((customer, index) => (
                    <CustomerTableRow
                        key={index}
                        customer={customer}
                        index={index}
                        isEven={index % 2 === 0}
                        onViewDetails={handleViewDetail} // Điều hướng với tham số
                    />
                ))}
            </tbody>
        </table>
    );
};

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
                <div className="flex gap-5 max-w-full text-base text-center text-white w-[800px] max-md:mt-10 mx-4">
                    <SearchCustomerName onSearch={handleSearch} /> {/* Truyền hàm tìm kiếm vào component */}
                    <AddCustomerButton />
                </div>
                <div className="flex flex-col mt-14 ml-16 max-w-full text-sm leading-5 bg-white rounded-xl shadow-[0px_45px_112px_rgba(0,0,0,0.06)] text-zinc-800 w-[1050px] max-md:mt-10">
                    <CustomerTable customerData={filteredCustomers} /> {/* Sử dụng danh sách khách hàng đã lọc */}
                </div>
            </div>
        </main>
    );
}

export default CustomerManagement;