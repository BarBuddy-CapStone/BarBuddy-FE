import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

// Hàm giả lập gọi API
const fetchStaffData = async () => [
    { name: "Staff 1", bar: "Bar Buddy1", email: "barbuddy1@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
    { name: "Staff 2", bar: "Bar Buddy2", email: "barbuddy2@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
    { name: "Staff 3", bar: "Bar Buddy1", email: "barbuddy3@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" },
    { name: "Staff 4", bar: "Bar Buddy3", email: "barbuddy4@gmail.com", phone: "0909090909", birthDate: "19/09/2000", status: "Active" }
];

const StaffTable = ({ staffData }) => (
    <table className="min-w-full text-lg table-auto border-collapse">
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
            {["Họ và tên", "Bar", "Email", "Phone", "Ngày sinh", "Status", ""].map((header, index) => (
                <th key={index} className="px-4 py-6 text-center">{header}</th>
            ))}
        </tr>
    </thead>
);

const StaffTableRow = ({ staff, index }) => {
    const navigate = useNavigate();
    const rowClass = index % 2 === 0 ? "white" : "orange-50";
    const colorStatus = staff.status === "Active" ? "text-green-500" : "text-red-500";
    const statusColor = staff.status === "Active" ? "bg-green-500" : "bg-red-500"; // Thêm dòng này

    return (
        <tr className={`hover:bg-gray-200 transition duration-200 bg-${rowClass} border-b-2`}>
            {Object.values(staff).map((value, idx) => (
                <td key={idx} className={`px-4 py-6 text-center ${idx === 5 ? colorStatus : ''}`}>
                    {idx === 5 && ( // Thêm điều kiện để hiển thị hình tròn
                        <span className={`inline-block w-3 h-3 rounded-full ${statusColor} mr-2`}></span>
                    )}
                    {value}
                </td>
            ))}
            <td className="px-4 py-6 text-center">
                <button className="font-bold text-blue-600 hover:underline" onClick={() => navigate('/admin/staff-detail')}>Xem chi tiết</button>
            </td>
        </tr>
    );
};

const SearchStaffName = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="flex items-center gap-3 bg-white rounded-md border border-gray-300 w-full max-w-md fixed-height">
            <input
                type="text"
                className="flex-grow border-none text-black"
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

const StaffManagement = () => {
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
            } catch {
                setError('Failed to fetch staff data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (searchTerm) => {
        setFilteredStaff(staffData.filter(staff => staff.name.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    const handleFilter = (bar) => {
        setFilteredStaff(staffData.filter(staff => staff.bar === bar));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto mr-100 bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-5 justify-between items-center max-w-full text-lg text-center text-white w-[800px] max-md:mt-10">
                    <SearchStaffName onSearch={handleSearch} />
                    <FilterDropdown onFilter={handleFilter} />
                    <AddStaffButton />
                </div>
                <div className="flex overflow-hidden flex-col mt-14 ml-16 max-w-full text-sm leading-5 bg-white rounded-xl shadow-[0px_45px_112px_rgba(0,0,0,0.06)] text-zinc-800 w-[1050px] max-md:mt-10">
                    <StaffTable staffData={filteredStaff} />
                </div>
            </div>
        </main>
    );
};

export default StaffManagement;