import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import PaymentHistoryService from '../../../lib/service/paymentHistoryService';
import { CircularProgress } from '@mui/material'; // Thêm import này

function PaymentHistoryAdmin() {
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
  const [loading, setLoading] = useState(false); // Thêm state cho loading

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const params = {
          Status: activeTab === 'Hoàn thành' ? 1 : activeTab === 'Đang chờ' ? 0 : 2,
          PageIndex: currentPage,
          PageSize: paymentsPerPage,
          ...searchParams,
        };
        const response = await PaymentHistoryService.getAllPayments(params);
        const paymentData = response.data.response.map((payment) => ({
          date: new Date(payment.paymentDate).toLocaleString(),  // Includes both date and time
          name: payment.customerName,
          phone: payment.phoneNumber,  // Add phone number field
          branch: payment.barName,     // Add branch (Chi nhánh)
          total: `${payment.totalPrice.toLocaleString()} VND`,
          status: payment.status, // Đảm bảo rằng status được lấy đúng từ API
          transactionId: payment.transactionCode,
          content: payment.note,       // Add content (Nội dung)
      }));
      
      
        setPayments(paymentData);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchPayments();
  }, [currentPage, searchParams, activeTab]);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  // Fetch bar branches
  useEffect(() => {
    const fetchBarBranches = async () => {
      try {
        const response = await PaymentHistoryService.getBarBranches();
        setBarBranches(response.data.data);
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

            <div className="flex justify-start gap-10 mt-4 max-w-full text-xl font-bold w-full max-md:w-full">
              <button
                className={`border-b-2 ${activeTab === 'Hoàn thành' ? 'text-blue-900 border-blue-900' : 'text-gray-500'}`}
                onClick={() => handleTabChange('Hoàn thành')}
              >
                Hoàn thành
              </button>
              <button
                className={`border-b-2 ${activeTab === 'Đang chờ' ? 'text-blue-900 border-blue-900' : 'text-gray-500'}`}
                onClick={() => handleTabChange('Đang chờ')}
              >
                Đang chờ
              </button>
              <button
                className={`border-b-2 ${activeTab === 'Thất bại' ? 'text-blue-900 border-blue-900' : 'text-gray-500'}`}
                onClick={() => handleTabChange('Thất bại')}
              >
                Thất bại
              </button>
            </div>

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

              {/* Table Body */}
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <CircularProgress />
                </div>
              ) : payments.length === 0 ? (
                <div className="flex justify-center items-center py-6">
                  <p className="text-red-500">Không có dữ liệu để hiển thị.</p>
                </div>
              ) : (
                <PaymentTable
                  payments={payments}
                  tabStatus={activeTab === 'Hoàn thành' ? 'Thành công' : activeTab === 'Đang chờ' ? 'Đang chờ' : 'Thất bại'}
                  onRowClick={handleRowClick}
                />
              )}
            </div>

            <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>

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
function SearchForm({ barBranches, onSearch }) {
  const [transactionDate, setTransactionDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('null');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const isAnyFieldFilled = transactionDate || selectedBranch !== 'null' || customerName || phoneNumber || email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    const searchParams = {
      CustomerName: customerName || null,
      PhoneNumber: phoneNumber || null,
      Email: email || null,
      BarId: selectedBranch !== 'null' ? selectedBranch : null,
      PaymentDate: transactionDate || null,
    };

    await onSearch(searchParams);
    setIsSearching(false);
  };

  const handleReset = async () => {
    setTransactionDate('');
    setSelectedBranch('null');
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setIsSearching(true);
    await onSearch({});
    setIsSearching(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start p-4 mt-1.5 w-full text-sm bg-white rounded-3xl border border-black max-md:pr-5 max-md:mr-2.5 max-md:max-w-full"
    >
      <p className="text-sky-900 max-md:max-w-full">
        * Bạn có thể tìm kiếm/xem (các) đặt chỗ bằng cách nhập một hoặc nhiều thông tin này
      </p>

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
            disabled={!isAnyFieldFilled || isSearching}
          >
            {isSearching ? <CircularProgress size={20} color="inherit" /> : 'Xóa bộ lọc'}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-1.5 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 w-[150px] text-center"
            disabled={isSearching}
          >
            {isSearching ? <CircularProgress size={20} color="inherit" /> : 'Xem'}
          </button>
        </div>
      </div>
    </form>
  );
}

SearchForm.propTypes = {
  barBranches: PropTypes.array.isRequired,  // Already defined
  onSearch: PropTypes.func.isRequired,      // Add validation for onSearch
};

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
    <>
      {payments.map((payment, index) => (
        <div
          key={index}
          className={`flex items-center border-t border-gray-300 ${
            index % 2 === 0 ? 'bg-orange-50' : 'bg-white'
          } ${index === payments.length - 1 ? 'rounded-b-xl' : ''}`}
          onClick={() => onRowClick(payment)}
        >
          <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.date}</div>
          <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.name}</div>
          <div className="flex items-center justify-center text-center py-3 w-1/5 break-words">{payment.phone}</div>
          <div className="flex items-center justify-center text-center py-3 w-1/5">{payment.total}</div>
          <div
            className={`flex items-center justify-center text-center py-3 w-1/5 font-bold ${
              payment.status === 1 ? 'text-green-600' : payment.status === 2 ? 'text-red-600' : 'text-orange-600'
            }`}
          >
            {payment.status === 1 ? 'Hoàn thành' : payment.status === 2 ? 'Thất bại' : 'Đang chờ'}
          </div>
          <div className="flex items-center justify-center text-center py-3 w-16">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/991df118f925ffab94381e6c044c6f0de9bb50883bc39a8081acecdaf2236760?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
              alt="Action Icon"
              className="cursor-pointer w-5 h-5"
            />
          </div>
        </div>
      ))}
    </>
  );
}


  // Modal component to show transaction details
  function TransactionModal({ payment, onClose }) {
    const statusColor = payment.status === 2 ? 'bg-red-500' : payment.status === 1 ? 'bg-green-500' : 'bg-orange-500'; // Cập nhật màu sắc
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
          <div className="text-xl font-bold mb-4 text-center">Chi tiết thanh toán</div>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center px-4 py-2 text-white rounded-full ${statusColor}`}>
              <span>
                {payment.status === 1 ? 'Thanh toán thành công' : payment.status === 2 ? 'Thanh toán thất bại' : 'Đang chờ xử lý'}
              </span> {/* Cập nhật trạng thái */}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left"> 
            <div>
              <p className="font-bold mb-2">Thời gian giao dịch</p>
              <p>{payment.date}</p> {/* Change from payment.time to payment.date */}
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
  payment: PropTypes.object.isRequired, 
  onClose: PropTypes.func.isRequired,
};

export default PaymentHistoryAdmin;