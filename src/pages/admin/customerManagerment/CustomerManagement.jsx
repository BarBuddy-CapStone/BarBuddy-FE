import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { getCustomerAccounts } from 'src/lib/service/adminService';
import { message } from 'antd';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';

const SearchCustomerName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="flex items-center flex-1 min-w-0">
            <div className="relative flex-1">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tìm theo tên khách hàng"
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

const AddCustomerButton = () => {
    const navigate = useNavigate();
    return (
        <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 whitespace-nowrap"
            onClick={() => navigate('/admin/customer-creation')}
        >
            Thêm khách hàng
        </button>
    );
}

const CustomerTableHeader = () => (
    <thead className="bg-white">
        <tr className="font-bold text-neutral-900 border-y-2 border-x-2 border-gray-300">
            <th className="px-4 py-6 text-center w-[15%]">Họ và tên</th>
            <th className="px-4 py-6 text-center w-[12%]">Ngày sinh</th>
            <th className="px-4 py-6 text-center w-[20%]">Email</th>
            <th className="px-4 py-6 text-center w-[12%]">Số điện thoại</th>
            <th className="px-4 py-6 text-center w-[12%]">Ngày đăng ký</th>
            <th className="px-4 py-6 text-center w-[15%]">Trạng thái</th>
            <th className="px-4 py-6 text-center w-[14%]"></th>
        </tr>
    </thead>
);

const CustomerTableRow = ({ customer, isEven, onViewDetails }) => {
    const rowClass = isEven ? "bg-white" : "bg-orange-50";
    const statusClass = getStatusClass(customer.status);

    return (
        <tr className={`text-sm hover:bg-gray-100 transition duration-150 border-y-2 border-x-2 border-gray-300 ${rowClass}`}>
            <td className="px-4 py-6 text-center align-middle">{customer.fullname}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(customer.dob).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">{customer.email}</td>
            <td className="px-4 py-6 text-center align-middle">{customer.phone}</td>
            <td className="px-4 py-6 text-center align-middle">{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
            <td className="px-4 py-6 text-center align-middle">
                <div className="flex justify-center">
                    <span className={`inline-flex items-center justify-center w-[100px] px-3 py-1 rounded-full text-white text-sm font-medium ${statusClass}`}>
                        {customer.status === 1 ? "Hoạt Động" : "Không HĐ"}
                    </span>
                </div>
            </td>
            <td className="px-4 py-6 text-center align-middle">
                <button
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg transition duration-300 ease-in-out hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transform hover:scale-105"
                    onClick={() => onViewDetails(customer.accountId)}
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
            return "bg-green-500 hover:bg-green-600";
        case 0:
            return "bg-red-500 hover:bg-red-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            try {
                const response = await getCustomerAccounts(pageSize, pageIndex);
                console.log('API Response:', response);

                if (response?.data?.data?.items) {
                    setCustomers(response.data.data.items);
                    setFilteredCustomers(response.data.data.items);
                    setTotalItems(response.data.data.total);
                } else {
                    setCustomers([]);
                    setFilteredCustomers([]);
                    setTotalItems(0);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
                message.error("Không thể tải danh sách khách hàng.");
                setCustomers([]);
                setFilteredCustomers([]);
                setTotalItems(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, [pageIndex, pageSize]);

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredCustomers(customers);
            return;
        }
        
        const filtered = customers.filter(customer =>
            customer.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/customer-detail/${id}`);
    };

    return (
        <main className="overflow-hidden bg-white">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                        <SearchCustomerName onSearch={handleSearch} />
                    </div>
                    <AddCustomerButton />
                </div>
                
                <div className="flex justify-center mb-6">
                    <h2 className="text-2xl font-notoSansSC font-bold text-blue-600">Danh Sách Khách Hàng</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm table-auto border-collapse">
                        <CustomerTableHeader />
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-red-500 text-center py-4 text-lg">
                                        Không có khách hàng
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer, index) => (
                                    <CustomerTableRow
                                        key={index}
                                        customer={customer}
                                        isEven={index % 2 === 0}
                                        onViewDetails={() => handleViewDetail(customer.accountId)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredCustomers.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            count={Math.ceil(totalItems / pageSize)}
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

export default CustomerManagement;
