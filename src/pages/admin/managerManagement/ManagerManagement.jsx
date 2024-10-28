import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { getManagerAccounts } from 'src/lib/service/adminService';
import { message } from 'antd';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';

function getStatusClass(status) {
    switch (status) {
        case 1:
            return "bg-green-500 hover:bg-green-600";
        case 0:
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}

const SearchManagerName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="flex items-center flex-1 min-w-0">
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm theo tên quản lý"
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
}

const AddManagerButton = () => {
    const navigate = useNavigate();
    return (
        <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 whitespace-nowrap"
            onClick={() => navigate('/admin/manager-creation')}
        >
            Thêm quản lý
        </button>
    );
}

const ManagerTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-y-2 border-x-2 border-gray-300">
            <th className="px-4 py-6 text-center w-[15%]">Họ và tên</th>
            <th className="px-4 py-6 text-center w-[12%]">Ngày sinh</th>
            <th className="px-4 py-6 text-center w-[15%]">Email</th>
            <th className="px-4 py-6 text-center w-[12%]">Số điện thoại</th>
            <th className="px-4 py-6 text-center w-[15%]">Bar</th>
            <th className="px-4 py-6 text-center w-[15%]">Trạng thái</th>
            <th className="px-4 py-6 text-center w-[14%]"></th>
        </tr>
    </thead>
);

const ManagerTableRow = ({ manager, isEven, onViewDetails }) => {
    const rowClass = isEven ? "bg-white" : "bg-orange-50";
    const statusClass = getStatusClass(manager.status);

    return (
        <tr className={`text-sm hover:bg-gray-100 transition duration-150 border-y-2 border-x-2 border-gray-300 ${rowClass}`}>
            <td className="px-4 py-6 text-center align-middle">{manager.fullname}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(manager.dob).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">{manager.email}</td>
            <td className="px-4 py-6 text-center align-middle">{manager.phone}</td>
            <td className="px-4 py-6 text-center align-middle">{manager.bar?.barName || 'N/A'}</td>
            <td className="px-4 py-6 text-center align-middle">
                <div className="flex justify-center">
                    <span className={`inline-flex items-center justify-center min-w-[120px] px-4 py-2 rounded-full text-white font-medium ${statusClass}`}>
                        {manager.status === 1 ? "Hoạt Động" : "Không Hoạt Động"}
                    </span>
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg transition duration-300 ease-in-out hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transform hover:scale-105"
                    onClick={() => onViewDetails(manager.accountId)}
                >
                    Xem chi tiết
                </button>
            </td>
        </tr>
    );
};

const ManagerManagement = () => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [managers, setManagers] = useState([]);
    const [filteredManagers, setFilteredManagers] = useState([]);
    const [totalManagers, setTotalManagers] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const fetchManagers = async () => {
            setIsLoading(true);
            try {
                const response = await getManagerAccounts(pageSize, pageIndex);
                setManagers(response.data.data.items);
                setFilteredManagers(response.data.data.items);
                setTotalManagers(response.data.data.total);
            } catch (error) {
                console.error("Error fetching managers:", error);
                message.error("Không thể tải danh sách quản lý.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchManagers();
    }, [pageIndex, pageSize]);

    useEffect(() => {
        if (location.state?.successMessage) {
            message.success(location.state.successMessage);
        }
    }, [location.state]);

    const handleSearch = (searchTerm) => {
        const filtered = managers.filter(manager =>
            manager.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredManagers(filtered);
    };

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/manager-detail/${id}`);
    };

    return (
        <main className="overflow-hidden bg-white">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                        <SearchManagerName onSearch={handleSearch} />
                    </div>
                    <AddManagerButton />
                </div>
                
                <div className="flex justify-center mb-6">
                    <h2 className="text-2xl font-notoSansSC font-bold text-blue-600">Danh Sách Quản Lý</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm table-auto border-collapse">
                        <ManagerTableHeader />
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : filteredManagers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-red-500 text-center py-4 text-lg">
                                        Không có quản lý
                                    </td>
                                </tr>
                            ) : (
                                filteredManagers.map((manager, index) => (
                                    <ManagerTableRow
                                        key={index}
                                        manager={manager}
                                        isEven={index % 2 === 0}
                                        onViewDetails={() => handleViewDetail(manager.accountId)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredManagers.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            count={Math.ceil(totalManagers / pageSize)}
                            page={pageIndex}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

export default ManagerManagement;
