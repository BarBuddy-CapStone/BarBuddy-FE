import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import SearchIcon from '@mui/icons-material/Search';
import { getStaffAccounts } from '../../../lib/service/adminService'; // Import hàm mới
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination'; // Import Pagination từ MUI

// Các components
const StaffTable = ({ staffData }) => (
    <table className="min-w-full text-sm table-auto border-collapse">
        <StaffTableHeader />
        <tbody>
            {staffData.map((staff, index) => (
                <StaffTableRow key={index} staff={staff} index={index} />
            ))}
        </tbody>
    </table>
);

const StaffTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-b-2">
            {["Họ và tên", "Ngày sinh", "Email", "Số điện thoại", "Bar", "Status", ""].map((header, index) => (
                <th key={index} className="px-4 py-6 text-center">{header}</th>
            ))}
        </tr>
    </thead>
);

const StaffTableRow = ({ staff, index }) => {
    const navigate = useNavigate();
    const rowClass = index % 2 === 0 ? "bg-bg-white" : "bg-bg-orange-50";
    const statusClass = getStatusClass(staff.status);
    const handleViewDetail = (id) => {
        navigate(`/admin/staff-detail?accountId=${id}`); // Chuyển hướng đến trang StaffDetail với accountId
    };

    return (
        <tr className={`text-sm hover:bg-gray-100 transition duration-150 border-b-2 ${rowClass}`}>
            <td className="px-4 py-6 text-center align-middle">{staff.fullname}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(staff.dob).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.email}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.phone}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.bar ? staff.bar.barName : 'N/A'}</td> {/* Cập nhật để hiển thị tên bar */}
            <td className="flex justify-center items-center px-4 py-6 align-middle">
                <div className={`flex justify-center items-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
                    {staff.status === 1 ? "Active" : "Deactive" === 1 ? "Active" : "Deactive"}
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-2 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    onClick={() => handleViewDetail(staff.accountId)}
                >
                    Xem chi tiết
                </button>
            </td>
        </tr>
    );
};

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

const SearchStaffName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="flex items-center gap-3 bg-white rounded-md border border-gray-300 max-w-md">
            <input
                type="text"
                className="flex-grow border-none px-1 py-1 text-black"
                placeholder="Search staff's name"
                aria-label="Search staff's name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-md" onClick={() => onSearch(searchTerm)}>
                <SearchIcon />
            </button>
        </div>
    );
};

const AddStaffButton = () => {
    const navigate = useNavigate();
    return (
        <button
            className="overflow-hidden gap-2 self-stretch pr-6 pl-6 w-auto italic bg-blue-600 max-h-[60px] rounded-[50px] whitespace-nowrap fixed-height"
            onClick={() => navigate('/admin/staff-creation')}
        >
            Thêm staff
        </button>
    );
};

const FilterDropdown = ({ onFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Filter by bar');
    const options = ["Bar Buddy1", "Bar Buddy2", "Bar Buddy3"];

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onFilter(option);
    };

    return (
        <div className="relative inline-block text-left fixed-height">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {selectedOption}
                <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <button key={index} onClick={() => handleOptionClick(option)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Nhóm các hàm chính
const StaffManagement = () => {
    const [staffData, setStaffData] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCustomers, setTotalCustomers] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getStaffAccounts(pageSize, pageIndex); // Gọi hàm với pageSize và pageIndex
                const data = response.data.items;
                setTotalCustomers(response.data.count); // Tính tổng số trang

                setStaffData(data);
                setFilteredStaff(data);
            } catch {
                setError('Failed to fetch staff data');
            }
        };
        loadData();
    }, [pageIndex]); // Thêm pageIndex vào dependency array

    const handlePageChange = (event, value) => {
        setPageIndex(value); // Cập nhật pageIndex khi người dùng chọn trang
    };

    const handleSearch = (searchTerm) => {
        setFilteredStaff(staffData.filter(staff => staff.name.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    const handleFilter = (bar) => {
        setFilteredStaff(staffData.filter(staff => staff.bar === bar));
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-5 max-w-full text-base text-center text-white w-[800px] max-md:mt-10 mx-4">
                    <SearchStaffName onSearch={handleSearch} />
                    <FilterDropdown onFilter={handleFilter} />
                    <AddStaffButton />
                </div>
                <div className="flex overflow-hidden flex-col mt-14 max-w-full text-sm leading-5 table-container">
                    <StaffTable staffData={filteredStaff} />
                </div>
                <Pagination
                    count={Math.ceil(totalCustomers / pageSize)} // Số trang tổng cộng
                    page={pageIndex} // Trang hiện tại
                    onChange={handlePageChange} // Hàm xử lý khi trang thay đổi
                    color="primary" // Màu sắc của Pagination
                />
            </div>
            <ToastContainer />
        </main>
    );
};

export default StaffManagement;