import { useState } from 'react';
import PropTypes from 'prop-types'; // Added import for PropTypes

function PaymentHistory() {
    const [activeTab, setActiveTab] = useState('Hoàn thành');
    const [selectedPayment, setSelectedPayment] = useState(null); // To hold the selected payment for the popup
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  
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
  
    return (
      <div className="overflow-hidden pr-2.5 bg-white">
        <div className="flex gap-5 max-md:flex-col">
          <main className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
            <div className="flex overflow-hidden flex-col py-7 pr-2 pl-5 mx-auto w-full bg-white max-md:max-w-full">
              <Header />
              <SearchForm />
              
              <div className="flex justify-start gap-10 mt-8 max-w-full text-2xl font-bold w-full max-md:w-full">
                <button
                  className={`border-b-2 ${activeTab === 'Hoàn thành' ? 'text-blue-600 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => handleTabChange('Hoàn thành')}
                >
                  Hoàn thành
                </button>
                <button
                  className={`border-b-2 ${activeTab === 'Thất bại' ? 'text-blue-600 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => handleTabChange('Thất bại')}
                >
                  Thất bại
                </button>
              </div>
  
              {/* Conditionally render the payment table based on active tab */}
              {activeTab === 'Hoàn thành' ? (
                <PaymentTable payments={completedPayments} tabStatus="Thành công" onRowClick={handleRowClick} />
              ) : (
                <PaymentTable payments={failedPayments} tabStatus="Thất bại" onRowClick={handleRowClick} />
              )}
  
              <Pagination />
  
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

// header
const Header = () => {
    return (
      <header className="flex flex-wrap gap-10 items-start max-md:max-w-full mb-5">
        <div className="flex flex-col flex-2 font-bold">
          <h1 className="text-4xl text-sky-900 max-md:mr-2.5">DANH SÁCH THANH TOÁN</h1>
        </div>
        <div className="flex flex-col flex-1 mt-1.5">
          <div className="flex gap-6 items-center self-end">
            <div className="flex gap-2 items-center self-stretch my-auto w-10">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c34835f58c1179a603170a4818c15626bcd875bc8fda99919b8ec07d2fa1753a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="User profile" className="object-contain self-stretch my-auto w-10 shadow-sm aspect-square rounded-full" />
            </div>
            <div className="shrink-0 self-stretch my-auto w-0 border border-solid bg-zinc-300 border-zinc-300 h-[30px]" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e19980153730dfe9760688834a12cb497b5d07d1a906fdcbc4c2084f9e6116f?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="Notifications" className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square" />
          </div>
        </div>
      </header>
    );
  };

// Search form
function SearchForm() {
  return (
      <form className="flex flex-col items-start p-5 mt-1.5 w-full text-lg bg-white rounded-3xl border border-black border-solid max-md:pr-5 max-md:mr-2.5 max-md:max-w-full">
          <p className="text-sky-900 max-md:max-w-full">
              * Bạn có thể tìm kiếm/xem (các) đặt chỗ bằng cách nhập một hoặc nhiều thông tin này
          </p>

          {/* Flex container for inputs */}
          <div className="flex flex-wrap gap-5 justify-between w-full mt-4">
            
              {/* Full Name */}
              <div className="flex flex-1 flex-wrap items-center">
                  <label htmlFor="fullName" className="w-1/3 md:w-auto mr-3">Họ tên:</label>
                  <input 
                      id="fullName"
                      type="text"
                      className="flex-1 px-4 py-2 w-full md:w-auto bg-white rounded-md border border-stone-300"
                  />
              </div>

              {/* Phone Number */}
              <div className="flex flex-1 flex-wrap items-center">
                  <label htmlFor="phoneNumber" className="w-1/3 md:w-auto mr-3">Số điện thoại:</label>
                  <input 
                      id="phoneNumber"
                      type="tel"
                      className="flex-1 px-4 py-2 w-full md:w-auto bg-white rounded-md border border-stone-300"
                  />
              </div>

              {/* Email */}
              <div className="flex flex-1 flex-wrap items-center">
                  <label htmlFor="email" className="w-1/3 md:w-auto mr-3">Email:</label>
                  <input 
                      id="email"
                      type="email"
                      className="flex-1 px-4 py-2 w-full md:w-auto bg-white rounded-md border border-stone-300"
                  />
              </div>
          </div>

          {/* Branch and Date row */}
          <div className="flex flex-wrap gap-5 justify-between items-center w-full mt-4">
            
              {/* Branch selection */}
              <div className="flex gap-3 items-center flex-1">
                  <label htmlFor="branch" className="whitespace-nowrap">Chi nhánh:</label>
                  {/* Change select to an input with readOnly or div */}
                  <input
                      id="branch"
                      value="Bar Buddy 1"
                      readOnly
                      className="flex-1 px-4 py-2 bg-neutral-200 rounded-md border border-neutral-200 w-full"
                  />
              </div>

              {/* Transaction Date */}
              <div className="flex gap-3 items-center flex-1">
                  <label htmlFor="transactionDate" className="whitespace-nowrap">Thời gian giao dịch:</label>
                  <div className="flex items-center bg-neutral-200 px-4 py-2 rounded-md">
                      <img 
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a9b02d05a787d565df1f055eef0b77e94e13647832821a03e0fed9f070a335e?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
                          alt=""
                          className="w-5 aspect-square"
                      />
                      <input 
                          id="transactionDate"
                          type="date"
                          value="2024-09-06"
                          className="bg-transparent border-none text-black ml-2"
                      />
                  </div>
              </div>

              {/* Submit Button (Xem) */}
              <button
                  type="submit"
                  className="px-10 py-2 text-lg font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 w-[200px] text-center"
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
        payments: PropTypes.array.isRequired, // {{ edit_1 }}
        tabStatus: PropTypes.string.isRequired, // {{ edit_2 }}
        onRowClick: PropTypes.func.isRequired, // {{ edit_3 }}
    };
    
    return (
      <div className="flex flex-col self-center mt-9 w-full text-lg leading-5 bg-white rounded-xl shadow-lg">
        <div className="flex bg-white rounded-t-xl font-semibold text-neutral-900 w-full">
          <div className="px-6 py-4 w-[250px] text-left">Ngày giao dịch</div>
          <div className="px-6 py-4 w-[300px] text-left">Tên khách hàng</div>
          <div className="px-6 py-4 w-[250px] text-left">Số điện thoại</div>
          <div className="px-6 py-4 w-[250px] text-left">Tổng tiền</div>
          <div className="px-6 py-4 w-[250px] text-left">Trạng thái</div>
        </div>
        {payments.map((payment, index) => (
          <div
            key={index}
            className={`flex bg-white hover:bg-gray-100 border-t border-gray-200 rounded-lg items-center px-6 py-4 ${index === payments.length - 1 ? 'rounded-b-xl' : ''}`}
            onClick={() => onRowClick(payment)} // Open modal on row click
          >
            <div className="w-[250px] text-left">{payment.date}</div>
            <div className="w-[300px] text-left">{payment.name}</div>
            <div className="w-[250px] text-left">{payment.phone}</div>
            <div className="w-[250px] text-left">{payment.total}</div>
            <div className={`flex justify-between w-[250px] text-left font-bold ${tabStatus === 'Thành công' ? 'text-green-600' : 'text-red-600'}`}>
              <span>{payment.status}</span>
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

// Pagination
function Pagination() {
  return (
    <div className="flex justify-between items-center px-4 py-6 w-full bg-white rounded-b-xl border-t border-gray-200">
      <div className="text-lg font-bold leading-loose text-zinc-800">
        Tổng: 5
      </div>
      <div className="flex gap-4 items-center"> {/* Căn giữa với flex và items-center */}
        <button className="flex items-center justify-center" aria-label="Previous page">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d153cc2f9b9971d0f62ec60bd747ba7833251fee0c3c40efb02a404afcc1ba8?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="Previous" className="object-contain w-6 h-6" />
        </button>
        <div className="flex gap-2 items-center text-lg font-bold text-zinc-800">
          <button className="px-3 py-1 rounded-full bg-stone-300">1</button>
          <button className="px-3 py-1">2</button>
          <button className="px-3 py-1">3</button>
        </div>
        <button className="flex items-center justify-center" aria-label="Next page">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/991df118f925ffab94381e6c044c6f0de9bb50883bc39a8081acecdaf2236760?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="Next" className="object-contain w-6 h-6" />
        </button>
      </div>
    </div>
  );
}


export default PaymentHistory;