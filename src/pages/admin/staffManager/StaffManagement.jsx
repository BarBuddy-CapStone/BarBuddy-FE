import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import SearchIcon from '@mui/icons-material/Search';
import { getStaffAccounts } from '../../../lib/service/adminService'; // Import hàm mới
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination'; // Import Pagination từ MUI
import { CircularProgress } from '@mui/material'; // Thêm import này
import { getAllBar } from '../../../lib/service/barManagerService'; // Import hàm getAllBar

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
        navigate(`/admin/staff-detail?accountId=${id}`); // Chuyển hướng đến trang StaffDetail với accountId
    };

    return (
        <tr className={`text-sm hover:bg-gray-100 transition duration-150 border-y-2 border-x-2 border-gray-300 ${rowClass}`}>
            <td className="px-4 py-6 text-center align-middle">{staff.fullname}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(staff.dob).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.email}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.phone}</td>
            <td className="px-4 py-6 text-center align-middle">{staff.bar ? staff.bar.barName : 'N/A'}</td> {/* Cập nhật để hiển thị tên bar */}
            <td className="flex justify-center items-center px-4 py-6 align-middle">
                <div className={`flex justify-center items-center text-center w-28 px-2 py-1 rounded-full ${statusClass}`}>
                    {staff.status === 1 ? "Hoạt Động" : "Không Hoạt Động"}
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
                placeholder="Tìm theo tên của nhân viên"
                aria-label="Tìm theo tên của nhân viên"
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

const FilterDropdown = ({ onFilter, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Lọc theo quán bar');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onFilter(option);
    };

    return (
        <div className="relative inline-block text-left fixed-height">
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
    const [barOptions, setBarOptions] = useState([]); // Thêm state cho barOptions

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await getStaffAccounts(pageSize, pageIndex);
                const data = response.data.data.items;
                setTotalStaff(response.data.data.total);
                setStaffData(data);
                setFilteredStaff(data);
            } catch (error) {
                console.error('Failed to fetch staff data:', error);
                toast.error('Không thể tải danh sách nhân viên.');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [pageIndex, pageSize]);

    useEffect(() => {
        if (location.state && location.state.successMessage) {
            toast.success(location.state.successMessage);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchBarOptions = async () => {
            try {
                const response = await getAllBar();
                if (response.data.statusCode === 200) {
                    const bars = response.data.data;
                    const options = ["All", ...bars.map(bar => bar.barName)]; // Thêm "All" vào đầu mảng
                    setBarOptions(options);
                }
            } catch (error) {
                console.error('Failed to fetch bar options:', error);
                toast.error('Không thể tải danh sách bar.');
            }
        };
        fetchBarOptions();
    }, []); // Chỉ gọi một lần khi component được mount

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
        <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-5 max-w-full text-base text-center text-white w-[800px] max-md:mt-10 mx-4">
                    <SearchStaffName onSearch={handleSearch} />
                    <FilterDropdown onFilter={handleFilter} options={barOptions} /> {/* Truyền options vào FilterDropdown */}
                    <AddStaffButton />
                </div>
                <div className="flex overflow-hidden flex-col mt-14 max-w-full text-sm leading-5 table-container">
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
                                        Không có nhân viên
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
                    <div className="flex justify-center mt-4">
                        <Pagination
                            count={Math.ceil(totalStaff / pageSize)}
                            page={pageIndex}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                )}
            </div>
            <ToastContainer />
        </main>
    );
};

export default StaffManagement;
