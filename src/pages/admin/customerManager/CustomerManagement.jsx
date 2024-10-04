import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { getCustomerAccounts } from 'src/lib/service/adminService';
import { ToastContainer, toast } from 'react-toastify'; // Nhập ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho toast
import Pagination from '@mui/material/Pagination'; // Nhập Pagination từ MUI

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
    const rowClass = isEven ? "bg-white" : "bg-orange-50";
    const statusClass = getStatusClass(customer.status); // Lấy lớp trạng thái từ hàm getStatusClass

    return (
        <tr className={`${rowClass} text-sm hover:bg-gray-100 transition duration-150 border-b-2`}>
            <td className="px-4 py-6 text-center align-middle">
                {customer.fullname}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {new Date(customer.dob).toLocaleDateString('vi-VN')}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.email}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {customer.phone}
            </td>
            <td className="px-4 py-6 text-center align-middle">
                {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
            </td>
            <td className="flex justify-center items-center px-4 py-6 align-middle">
                <div className={`flex justify-center items-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
                    {customer.status === 1 ? "Active" : "Deactive"}
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-2 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    onClick={() => onViewDetails(customer.accountId)} // Sử dụng accountId
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
        case 1:
            return "bg-green-500 text-white";
        case 0:
            return "bg-red-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
}

const CustomerTable = ({ customerData }) => {
    const navigate = useNavigate();
    const handleViewDetail = (id) => {
        navigate(`/admin/customer-detail?accountId=${id}`) // Điều hướng với tham số
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
                        onViewDetails={() => handleViewDetail(customer.accountId)} // Điều hướng với tham số
                    />
                ))}
            </tbody>
        </table>
    );
};

const CustomerManagement = () => {
    const [filteredCustomers, setFilteredCustomers] = useState([]); // Thay đổi state để lưu danh sách khách hàng
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCustomers, setTotalCustomers] = useState(0); // Thêm state cho tổng số khách hàng
    const navigate = useNavigate();
    const location = useLocation(); // Khai báo useLocation

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await getCustomerAccounts(pageSize, pageIndex); // Gọi hàm với pageSize và pageIndex
            setFilteredCustomers(response.data.items); // Cập nhật danh sách khách hàng đã lấy từ API
            setTotalCustomers(response.data.count); // Lưu tổng số khách hàng từ phản hồi
        };

        fetchCustomers();
    }, [pageIndex, pageSize]); // Thêm pageIndex và pageSize vào dependency array

    const handleSearch = (searchTerm) => {
        const filtered = customerData.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered); // Cập nhật danh sách khách hàng đã lọc
    };

    // Hiển thị thông báo nếu có
    useEffect(() => {
        if (location.state && location.state.successMessage) {
            toast.success(location.state.successMessage);
        }
    }, [location.state]);

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-5 max-w-full text-base text-center text-white w-[800px] max-md:mt-10 mx-4">
                    <SearchCustomerName onSearch={handleSearch} />
                    <AddCustomerButton />
                </div>
                <div className="flex overflow-hidden flex-col mt-14 max-w-full text-sm leading-5 table-container">
                    <CustomerTable customerData={filteredCustomers} /> 
                </div>
                <Pagination
                    count={Math.ceil(totalCustomers / pageSize)}
                    page={pageIndex}
                    onChange={(event, value) => setPageIndex(value)} // Cập nhật pageIndex khi thay đổi
                    variant="outlined"
                    shape="rounded"
                />
            </div>
            <ToastContainer /> {/* Thêm ToastContainer vào trong JSX */}
        </main>
    );
}

export default CustomerManagement;