import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Hàm giả lập gọi API
const fetchStaffData = async () => {
    // Thay thế bằng gọi API thực tế
    return [
        { name: "Staff 1", bar: "Bar Buddy1", email: "barbuddy1@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
        { name: "Staff 2", bar: "Bar Buddy2", email: "barbuddy2@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
        { name: "Staff 3", bar: "Bar Buddy1", email: "barbuddy3@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
        { name: "Staff 4", bar: "Bar Buddy3", email: "barbuddy4@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" }
    ];
};

function StaffTableHeader() {
    return (
        <thead>
            <tr className="bg-slate-400 text-neutral-900">
                <th className="px-4 py-2 border">Họ và tên</th>
                <th className="px-4 py-2 border">Bar</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Số điện thoại</th>
                <th className="px-4 py-2 border">Ngày sinh</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border"></th>
            </tr>
        </thead>
    );
}

function StaffTableRow({ name, bar, email, phone, birthDate, status }) {
    const navigate = useNavigate();
    return (
        <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border">{name}</td>
            <td className="px-4 py-2 border">{bar}</td>
            <td className="px-4 py-2 border break-words">{email}</td>
            <td className="px-4 py-2 border">{phone}</td>
            <td className="px-4 py-2 border">{birthDate}</td>
            <td className="px-4 py-2 border">{status}</td>
            <td className="px-4 py-2 border">
                <button className="font-bold text-black" onClick={() => navigate('/staffs/staff-detail')}>Xem chi tiết</button>
            </td>
        </tr>
    );
}

function SearchStaffName({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="flex items-center gap-3 p-1 bg-white rounded-md border border-gray-300 w-full max-w-md fixed-height">
            <input
                type="text"
                className="flex-grow border-none text-black"
                placeholder="Search staff's name"
                aria-label="Search staff's name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>
                <img className="object-contain w-6 h-6" loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cd489bc186c2efdaa389942d6051382a5f532b00e1ab0fffecfefe29650e31dc?placeholderIfAbsent=true&apiKey=2f0fb41b041549e2a3975f3618160d3b" alt="" />
            </button>
        </div>
    );
}

function AddStaffButton() {
    const navigate = useNavigate();
    return (
        <button
            className="overflow-hidden gap-2 self-stretch pr-6 pl-6 w-auto italic bg-blue-600 max-h-[60px] rounded-[50px] whitespace-nowrap fixed-height"
            onClick={() => navigate('/staffs/staff-creation')}
        >
            Thêm staff
        </button>
    );
}

function FilterDropdown({ onFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Filter by bar');

    const options = ["Bar Buddy1", "Bar Buddy2", "Bar Buddy3"];

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false); // Đóng menu dropdown sau khi chọn
        onFilter(option); // Gọi hàm lọc khi chọn option
    };

    return (
        <div className="relative inline-block text-left fixed-height">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {selectedOption}
                <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StaffManagement() {
    const [staffData, setStaffData] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStaffData();
                setStaffData(data);
                setFilteredStaff(data);
            } catch (err) {
                setError('Failed to fetch staff data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = staffData.filter(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaff(filtered);
    };

    const handleFilter = (bar) => {
        const filtered = staffData.filter(staff => 
            staff.bar === bar
        );
        setFilteredStaff(filtered);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex gap-5 justify-between items-center max-w-full text-lg text-center text-white w-[800px] max-md:mt-10">
                        <SearchStaffName onSearch={handleSearch} />
                        <FilterDropdown onFilter={handleFilter} />
                        <AddStaffButton />
                    </div>
                    <div className="flex overflow-hidden flex-col mt-14 ml-16 max-w-full text-sm leading-5 bg-white rounded-xl shadow-[0px_45px_112px_rgba(0,0,0,0.06)] text-zinc-800 w-[1050px] max-md:mt-10">
                        <table className="min-w-full table-auto border-collapse">
                            <StaffTableHeader />
                            <tbody>
                                {filteredStaff.map((staff, index) => (
                                    <StaffTableRow key={index} {...staff} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

export default StaffManagement;
