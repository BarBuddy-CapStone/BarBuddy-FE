import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../../../config';

function PaymentHistory() {
  const [activeTab, setActiveTab] = useState('Hoàn thành');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;
  const [barBranches, setBarBranches] = useState([]);
  const [payments, setPayments] = useState([]); 
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({});
  const navigate = useNavigate();

  // Fetch payment history based on the active tab, current page, and search parameters
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const params = {
          Status: activeTab === 'Hoàn thành', 
          PageIndex: currentPage,
          PageSize: paymentsPerPage,
          ...searchParams, // Merge in search parameters
        };

        // Remove empty/null parameters
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key];
          }
        });

        const response = await axios.get(`${Config.baseUrl}/PaymentHistory`, { params });

        const paymentData = response.data.response.map((payment) => ({
          date: new Date(payment.paymentDate).toLocaleDateString(),
          name: payment.customerName,
          phone: payment.phoneNumber,
          total: `${payment.totalPrice.toLocaleString()} VND`,
          status: payment.status ? 'Thành công' : 'Thất bại',
          time: new Date(payment.paymentDate).toLocaleTimeString(),
          transactionId: payment.transactionCode,
          branch: payment.barName,
          content: payment.note,
        }));

        setPayments(paymentData);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPayments();
  }, [activeTab, currentPage, searchParams]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page on search
  };

  // Fetch bar branches
  useEffect(() => {
    const fetchBarBranches = async () => {
      try {
        const response = await axios.get(`${Config.baseUrl}/Bar/admin/barmanager`);
        const bars = response.data.data.map(bar => ({
          barId: bar.barId,
          barName: bar.barName,
        }));
        setBarBranches(bars);
      } catch (error) {
        console.error('Error fetching bar branches:', error);
      }
    };
    fetchBarBranches();
  }, []);

  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleNavigateBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="overflow-hidden pr-5 pl-2.5 bg-white">
      <div className="flex gap-5 max-md:flex-col">
        <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden flex-col py-5 pr-2 pl-5 mx-auto w-full bg-white max-md:max-w-full">
            {/* Arrow button and page title */}
            <div className="flex items-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8193c2c7a19b0a3b80ee04ee6c2fd4a3239559cb76a7c142500d11b564d9c3ba?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
                alt="Back Arrow"
                className="w-8 h-8 cursor-pointer"
                onClick={handleNavigateBack}
              />
              <h2 className="text-xl font-bold ml-5">Lịch sử giao dịch</h2>
            </div>

            <SearchForm barBranches={barBranches} onSearch={handleSearch} />

            {/* Tab Buttons */}
            <div className="flex justify-start gap-10 mt-4 max-w-full text-xl font-bold w-full max-md:w-full">
              <button
                className={`border-b-2 ${activeTab === 'Hoàn thành' ? 'text-blue-900 border-blue-900' : 'text-gray-500'}`}
                onClick={() => handleTabChange('Hoàn thành')}
              >
                Hoàn thành
              </button>
              <button
                className={`border-b-2 ${activeTab === 'Thất bại' ? 'text-blue-900 border-blue-900' : 'text-gray-500'}`}
                onClick={() => handleTabChange('Thất bại')}
              >
                Thất bại
              </button>
            </div>

            {/* Payment Table */}
            <PaymentTable
              payments={payments}
              tabStatus={activeTab === 'Hoàn thành' ? 'Thành công' : 'Thất bại'}
              onRowClick={handleRowClick}
            />

            {/* Pagination */}
            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>

            {/* Modal */}
            {isModalOpen && selectedPayment && (
              <TransactionModal
                payment={selectedPayment}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// SearchForm Component
// SearchForm Component
function SearchForm({ barBranches, onSearch }) {
  const [transactionDate, setTransactionDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('null');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Check if any field has a value to control the "Xóa bộ lọc" button
  const isAnyFieldFilled = transactionDate || selectedBranch !== 'null' || customerName || phoneNumber || email;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the search parameters
    const searchParams = {
      CustomerName: customerName || null,
      PhoneNumber: phoneNumber || null,
      Email: email || null,
      BarId: selectedBranch !== 'null' ? selectedBranch : null,
      PaymentDate: transactionDate || null,
    };

    // Call the onSearch function passed as a prop
    onSearch(searchParams);
  };

  // Handle resetting the form and search parameters
  const handleReset = () => {
    setTransactionDate('');
    setSelectedBranch('null');
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    onSearch({}); // Call onSearch with an empty object to reset search parameters
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start p-4 mt-1.5 w-full text-sm bg-white rounded-3xl border border-black max-md:pr-5 max-md:mr-2.5 max-md:max-w-full"
    >
      <p className="text-sky-900 max-md:max-w-full">
        * Bạn có thể tìm kiếm/xem (các) đặt chỗ bằng cách nhập một hoặc nhiều thông tin này
      </p>

      {/* Flex container for inputs */}
      <div className="flex flex-wrap gap-4 justify-between w-full mt-3">
        {/* Full Name */}
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="fullName" className="w-1/3 md:w-auto mr-2">Họ tên:</label>
          <input 
            id="fullName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="phoneNumber" className="w-1/3 md:w-auto mr-2">Số điện thoại:</label>
          <input 
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        {/* Email */}
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="email" className="w-1/3 md:w-auto mr-2">Email:</label>
          <input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>
      </div>

      {/* Branch and Date row */}
      <div className="flex flex-wrap gap-4 justify-between items-center w-full mt-3">
        {/* Branch selection */}
        <div className="flex gap-2 items-center flex-1">
          <label htmlFor="branch" className="whitespace-nowrap">Chi nhánh:</label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-neutral-200 rounded-md border border-neutral-200 w-full"
          >
            <option value="null">Tất cả</option>
            {barBranches.map(branch => (
              <option key={branch.barId} value={branch.barId}>{branch.barName}</option>
            ))}
          </select>
        </div>

        {/* Transaction Date */}
        <div className="flex gap-2 items-center flex-1">
          <label htmlFor="transactionDate" className="whitespace-nowrap">Thời gian giao dịch:</label>
          <div className="flex items-center bg-neutral-200 px-3 py-1.5 rounded-md">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a9b02d05a787d565df1f055eef0b77e94e13647832821a03e0fed9f070a335e"
              alt=""
              className="w-4 aspect-square"
            />
            <input 
              id="transactionDate"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="bg-transparent border-none text-black ml-2 text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Reset Button */}
          <button
            type="button"
            className={`px-6 py-1.5 text-sm font-semibold text-white bg-gray-500 rounded-full hover:bg-gray-300 w-[150px] text-center ${!isAnyFieldFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleReset}
            disabled={!isAnyFieldFilled}
          >
            Xóa bộ lọc
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-1.5 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 w-[150px] text-center"
          >
            Xem
          </button>
        </div>
      </div>
    </form>
  );
}


SearchForm.propTypes = {
  barBranches: PropTypes.array.isRequired,
};

// Payment table
function PaymentTable({ payments, tabStatus, onRowClick }) {
  PaymentTable.propTypes = {
    payments: PropTypes.array.isRequired,
    tabStatus: PropTypes.string.isRequired,
    onRowClick: PropTypes.func.isRequired,
  };

  return (
    <div className="flex flex-col self-center mt-9 w-full text-sm leading-5 bg-white rounded-xl">
      {/* Table Header */}
      <div className="flex bg-white rounded-t-xl font-semibold text-neutral-900 w-full">
        <div className="flex items-center justify-center text-center px-4 py-3 w-1/5">Ngày giao dịch</div>
        <div className="flex items-center justify-center text-center px-4 py-3 w-1/5">Tên khách hàng</div>
        <div className="flex items-center justify-center text-center px-4 py-3 w-1/5">Số điện thoại</div>
        <div className="flex items-center justify-center text-center px-4 py-3 w-1/5">Tổng tiền</div>
        <div className="flex items-center justify-center text-center px-4 py-3 w-1/5">Trạng thái</div>
        <div className="flex items-center justify-center text-center px-4 py-3 w-16"></div> {/* Action column */}
      </div>

      {/* Check if there are no payments */}
      {payments.length === 0 ? (
        <div className="flex justify-center items-center py-6">
          <p className="text-red-500">Không có dữ liệu để hiển thị.</p>
        </div>
      ) : (
        // Table Rows
        payments.map((payment, index) => (
          <div
            key={index}
            className={`flex items-center border-t border-gray-300 ${
              index % 2 === 0 ? 'bg-orange-50' : 'bg-white'
            } ${index === payments.length - 1 ? 'rounded-b-xl' : ''}`}
            onClick={() => onRowClick(payment)} // Open modal on row click
          >
            <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.date}</div>
            <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.name}</div>
            <div className="flex items-center justify-center text-center py-3 w-1/5 break-words">{payment.phone}</div>
            <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.total}</div>
            <div
              className={`flex items-center justify-center text-center py-3 w-1/5 font-bold ${
                tabStatus === 'Thành công' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {payment.status}
            </div>
            <div className="flex items-center justify-center text-center py-3 w-16">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/991df118f925ffab94381e6c044c6f0de9bb50883bc39a8081acecdaf2236760?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
                alt="Action Icon"
                className="cursor-pointer w-5 h-5"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}


  // Modal component to show transaction details
  function TransactionModal({ payment, onClose }) {
    const statusColor = payment.status === 'Thất bại' ? 'bg-red-500' : 'bg-green-500';
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
          <div className="text-xl font-bold mb-4 text-center">Chi tiết thanh toán</div>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center px-4 py-2 text-white rounded-full ${statusColor}`}>
              <span>Thanh toán {payment.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">  {/* Added grid gap for better spacing */}
            <div>
              <p className="font-bold mb-2">Thời gian giao dịch</p>
              <p>{payment.time}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Mã giao dịch</p>
              <p>{payment.transactionId}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Người chuyển</p>
              <p>{payment.name}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Tổng tiền</p>
              <p>{payment.total}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Số điện thoại</p>
              <p>{payment.phone}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Chi nhánh</p>
              <p>{payment.branch}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold mb-2">Nội dung</p>
            <p>{payment.content}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    );
  }

// Modal
TransactionModal.propTypes = {
  payment: PropTypes.object.isRequired, // Xác thực payment là một object và là bắt buộc
  onClose: PropTypes.func.isRequired, // Xác thực onClose là một function và là bắt buộc
};

export default PaymentHistory;