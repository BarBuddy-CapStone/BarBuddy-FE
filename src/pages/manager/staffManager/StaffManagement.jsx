import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import SearchIcon from '@mui/icons-material/Search';
import { getStaffAccounts } from '../../../lib/service/adminService'; // Import hàm mới
import { message } from 'antd'; // Thêm import message từ antd
import Pagination from '@mui/material/Pagination'; // Import Pagination từ MUI
import { CircularProgress } from '@mui/material'; // Thêm import này
import { getAllStaff } from 'src/lib/service/staffService';

// Các components
// const StaffTable = ({ staffData }) => (
//     <table className="min-w-full text-sm table-auto border-collapse">
//         <StaffTableHeader />
//         <tbody>
//             {staffData.map((staff, index) => (
//                 <StaffTableRow key={index} staff={staff} index={index} />
//             ))}
//         </tbody>
//     </table>
// );

const StaffTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-y-2 border-x-2 border-gray-300">
            {["Họ và tên", "Ngày sinh", "Email", "Số điện thoại", "Bar", "Trạng thái", ""].map((header, index) => (
                <th key={index} className="px-4 py-6 text-center">{header}</th>
            ))}
        </tr>
    </thead>
);

const StaffTableRow = ({ staff, index }) => {
    const navigate = useNavigate();
    const rowClass = index % 2 === 0 ? "bg-white" : "bg-orange-50";
    const statusClass = getStatusClass(staff.status);
    const handleViewDetail = (id) => {
        navigate(`/manager/staff-detail/${id}`);
    };

    return (
        <tr className={`text-sm hover:bg-gray-100 transition duration-150 border-y-2 border-x-2 border-gray-300 ${rowClass}`}>
            <td className="px-4 py-6 text-center align-middle">{staff.fullname}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(staff.dob).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.email}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.phone}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.bar ? staff.bar.barName : 'N/A'}</td>
            <td className="flex justify-center items-center px-4 py-6 align-middle">
                <div className={`flex justify-center items-center text-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
                    {staff.status === 1 ? "Hoạt Động" : "Không Hoạt Động"}
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg transition duration-300 ease-in-out hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transform hover:scale-105"
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
        <div className="flex items-center flex-1 min-w-0">
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm theo tên của nhân viên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => onSearch(searchTerm)}
                >
                    <SearchIcon />
                </button>
            </div>
        </div>
    );
};

const AddStaffButton = () => {
    const navigate = useNavigate();
    return (
        <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 whitespace-nowrap"
            onClick={() => navigate('/manager/staff-creation')}
        >
            Thêm Nhân Viên
        </button>
    );
};

const FilterDropdown = ({ onFilter, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Lọc theo quán bar');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onFilter(option);
    };

    return (
        <div className="relative inline-block text-left w-48">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full min-w-[130px] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {selectedOption}
                <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
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
    const [totalStaff, setTotalStaff] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBar, setSelectedBar] = useState(null);
    const location = useLocation();
    const [barOptions, setBarOptions] = useState(["All"]); // Mặc định có option "All"

    // Thêm useMemo để tối ưu hóa việc lọc danh sách bar
    const uniqueBars = useMemo(() => {
        return ["All", ...new Set((staffData || []).map(staff => staff.bar?.barName).filter(Boolean))];
    }, [staffData]);

    // Sửa lại useEffect để tránh re-render không cần thiết
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await getAllStaff(pageSize, pageIndex);
                if (response.data.statusCode === 200) {
                    const { items, total, pageIndex: currentPage, pageSize: size } = response.data.data;
                    setStaffData(items || []); 
                    setFilteredStaff(items || []); 
                    setTotalStaff(total);
                    setPageIndex(currentPage);
                    setPageSize(size);
                    setBarOptions(uniqueBars);
                } else {
                    setStaffData([]);
                    setFilteredStaff([]);
                }
            } catch (error) {
                console.error('Failed to fetch staff data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Thêm một flag để kiểm soát việc gọi API
        let isSubscribed = true;

        if (isSubscribed) {
            loadData();
        }

        // Cleanup function
        return () => {
            isSubscribed = false;
        };
    }, [pageIndex]); // Chỉ theo dõi pageIndex, bỏ pageSize ra khỏi dependencies

    // Tách riêng useEffect cho location.state để tránh conflict
    useEffect(() => {
        if (location.state?.successMessage) {
            message.success(location.state.successMessage);
        }
    }, [location.state]);

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handleSearch = (searchTerm) => {
        const filtered = staffData.filter(staff =>
            staff.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaff(filtered);
    };

    const handleFilter = (bar) => {
        setSelectedBar(bar);
        if (bar === 'All') {
            setFilteredStaff(staffData);
        } else {
            const filtered = staffData.filter(staff => staff.bar && staff.bar.barName === bar);
            setFilteredStaff(filtered);
        }
    };

    return (
        <main className="overflow-hidden bg-white">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                        <SearchStaffName onSearch={handleSearch} />
                        <FilterDropdown onFilter={handleFilter} options={barOptions} />
                    </div>
                    <AddStaffButton />
                </div>
                
                {/* Điều chỉnh tiêu đề "Danh Sách Nhân Viên" ở đây */}
                <div className="flex justify-center mb-6">
                    <h2 className="text-2xl font-notoSansSC font-bold text-blue-600">Danh Sách Nhân Viên</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm table-auto border-collapse">
                        <StaffTableHeader />
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : filteredStaff.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-red-500 text-center py-4 text-lg">
                                        Danh sách staff đang trống !
                                    </td>
                                </tr>
                            ) : (
                                filteredStaff.map((staff, index) => (
                                    <StaffTableRow key={index} staff={staff} index={index} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredStaff.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            count={Math.ceil(totalStaff / pageSize)}
                            page={pageIndex}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default StaffManagement;
