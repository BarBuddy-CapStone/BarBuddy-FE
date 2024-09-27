import { useState } from 'react';
import PropTypes from 'prop-types'; // Added import for PropTypes
import Pagination from '@mui/material/Pagination'; // Import MUI Pagination
import Stack from '@mui/material/Stack'; // Import MUI Stack for layout

function PaymentHistory() {
    const [activeTab, setActiveTab] = useState('Hoàn thành');
    const [selectedPayment, setSelectedPayment] = useState(null); // To hold the selected payment for the popup
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [currentPage, setCurrentPage] = useState(1);
    const paymentsPerPage = 4;
  
    const completedPayments = [
      { date: '06/09/2024', name: 'Bob Smith', phone: '+1 6546 654 542', total: '6.080.000VND', status: 'Thành công', time: '22:29 - 06/09/2024', transactionId: 'da123dasda', branch: 'Bar Buddy1', content: 'Bob Smith Đặt bàn Lúc 23h30" - 17 December, 2024 loại bàn VIP 1' },
      { date: '06/09/2024', name: 'Bob Smith', phone: '+1 6546 654 542', total: '7.080.000VND', status: 'Thành công', time: '22:29 - 06/09/2024', transactionId: 'da123dasda', branch: 'Bar Buddy1', content: 'Bob Smith Đặt bàn Lúc 23h30" - 17 December, 2024 loại bàn VIP 1' },
      { date: '06/09/2024', name: 'Bob Smith', phone: '+1 6546 654 542', total: '8.080.000VND', status: 'Thành công', time: '22:29 - 06/09/2024', transactionId: 'da123dasda', branch: 'Bar Buddy1', content: 'Bob Smith Đặt bàn Lúc 23h30" - 17 December, 2024 loại bàn VIP 1' },
      { date: '06/09/2024', name: 'Bob Smith', phone: '+1 6546 654 542', total: '9.080.000VND', status: 'Thành công', time: '22:29 - 06/09/2024', transactionId: 'da123dasda', branch: 'Bar Buddy1', content: 'Bob Smith Đặt bàn Lúc 23h30" - 17 December, 2024 loại bàn VIP 1' },
      { date: '06/09/2024', name: 'Bob Smith', phone: '+1 6546 654 542', total: '10.080.000VND', status: 'Thành công', time: '22:29 - 06/09/2024', transactionId: 'da123dasda', branch: 'Bar Buddy1', content: 'Bob Smith Đặt bàn Lúc 23h30" - 17 December, 2024 loại bàn VIP 1' },
      // Add more completedPayments here
    ];
  
    const failedPayments = [
      { date: '05/09/2024', name: 'John Doe', phone: '+1 8123 456 789', total: '4.000.000VND', status: 'Thất bại', time: '21:15 - 05/09/2024', transactionId: 'fdas123fds', branch: 'Bar Buddy1', content: 'Failed content example' },
      { date: '05/09/2024', name: 'John Doe', phone: '+1 8123 456 789', total: '5.000.000VND', status: 'Thất bại', time: '21:15 - 05/09/2024', transactionId: 'fdas123fds', branch: 'Bar Buddy1', content: 'Failed content example' },
      { date: '05/09/2024', name: 'John Doe', phone: '+1 8123 456 789', total: '6.000.000VND', status: 'Thất bại', time: '21:15 - 05/09/2024', transactionId: 'fdas123fds', branch: 'Bar Buddy1', content: 'Failed content example' },
      { date: '05/09/2024', name: 'John Doe', phone: '+1 8123 456 789', total: '7.000.000VND', status: 'Thất bại', time: '21:15 - 05/09/2024', transactionId: 'fdas123fds', branch: 'Bar Buddy1', content: 'Failed content example' },
      { date: '05/09/2024', name: 'John Doe', phone: '+1 8123 456 789', total: '8.000.000VND', status: 'Thất bại', time: '21:15 - 05/09/2024', transactionId: 'fdas123fds', branch: 'Bar Buddy1', content: 'Failed content example' },
      // Add more failedPayments here
    ];
  
    const handleRowClick = (payment) => {
      setSelectedPayment(payment);
      setIsModalOpen(true); // Open modal on row click
    };
  
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

     // Handle Pagination change
     const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

     // Get current payments for the active page
     const displayedPayments = activeTab === 'Hoàn thành' 
     ? completedPayments.slice((currentPage - 1) * paymentsPerPage, currentPage * paymentsPerPage) 
     : failedPayments.slice((currentPage - 1) * paymentsPerPage, currentPage * paymentsPerPage);
  
     return (
      <div className="overflow-hidden pr-5 pl-2.5 bg-white">
          <div className="flex gap-5 max-md:flex-col">
              <main className="flex flex-col w-full max-md:ml-0 max-md:w-full">
                  <div className="flex overflow-hidden flex-col py-5 pr-2 pl-5 mx-auto w-full bg-white max-md:max-w-full">
                      <SearchForm />

                      {/* Adjust Tab Buttons */}
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

                      {/* Conditionally render the payment table based on active tab */}
                      <PaymentTable payments={displayedPayments} tabStatus={activeTab === 'Hoàn thành' ? 'Thành công' : 'Thất bại'} onRowClick={handleRowClick} />

                      {/* Pagination using MUI */}
                      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                          <Pagination
                              count={Math.ceil((activeTab === 'Hoàn thành' ? completedPayments.length : failedPayments.length) / paymentsPerPage)}
                              page={currentPage}
                              onChange={handlePageChange}
                              color="primary"
                          />
                      </Stack>

                      {/* Modal Popup */}
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

// Search form
function SearchForm() {
  return (
    <form className="flex flex-col items-start p-4 mt-1.5 w-full text-sm bg-white rounded-3xl border border-black max-md:pr-5 max-md:mr-2.5 max-md:max-w-full">
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
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="phoneNumber" className="w-1/3 md:w-auto mr-2">Số điện thoại:</label>
          <input 
            id="phoneNumber"
            type="tel"
            className="flex-1 px-3 py-1.5 w-full md:w-auto bg-white rounded-md border border-stone-300"
          />
        </div>

        {/* Email */}
        <div className="flex flex-1 flex-wrap items-center">
          <label htmlFor="email" className="w-1/3 md:w-auto mr-2">Email:</label>
          <input 
            id="email"
            type="email"
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
            className="flex-1 px-3 py-1.5 bg-neutral-200 rounded-md border border-neutral-200 w-full"
          >
            <option>Bar Buddy 1</option>
          </select>
        </div>

        {/* Transaction Date */}
        <div className="flex gap-2 items-center flex-1">
          <label htmlFor="transactionDate" className="whitespace-nowrap">Thời gian giao dịch:</label>
          <div className="flex items-center bg-neutral-200 px-3 py-1.5 rounded-md">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a9b02d05a787d565df1f055eef0b77e94e13647832821a03e0fed9f070a335e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
              alt=""
              className="w-4 aspect-square"
            />
            <input 
              id="transactionDate"
              type="date"
              value="2024-09-06"
              className="bg-transparent border-none text-black ml-2 text-sm"
            />
          </div>
        </div>

        {/* Submit Button (Xem) */}
        <button
          type="submit"
          className="px-6 py-1.5 text-sm font-semibold text-white bg-blue-900 rounded-full hover:bg-blue-800 w-[150px] text-center" // Applied rounded-full
        >
          Xem
        </button>
      </div>
    </form>
  );
}

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

      {/* Table Rows */}
      {payments.map((payment, index) => (
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
      ))}
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