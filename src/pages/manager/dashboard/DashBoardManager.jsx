import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useRef, useState } from "react";
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { getAllRevenue, revenueDashboard, getExportCSVManager } from "../../../lib/service/adminService";
import { getAllBarsNoPage } from "../../../lib/service/barManagerService";
import { message } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Thêm hàm helper để format ngày theo UTC+7
const formatDateToUTC7 = (date) => {
  const d = date || new Date();
  // Thêm 7 giờ để chuyển về UTC+7
  d.setHours(d.getHours() + 7);
  return d.toISOString().split('T')[0]; // Lấy phần ngày yyyy-mm-dd
};

// Sửa hàm helper để format tiền VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount).replace('₫', 'VND');
};

// Thêm hàm helper để lấy ngày đầu năm 2024
const getStartOf2024 = () => {
  return '2024-01-01';
};

const DashBoardManager = () => {
  // Khởi tạo startDate là ngày 1/1/2024 và endDate là ngày hiện tại UTC+7
  const [startDate, setStartDate] = useState(getStartOf2024());
  const [endDate, setEndDate] = useState(formatDateToUTC7());
  const [barId, setBarId] = useState("");
  const [barList, setBarList] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const navigate = useNavigate();

  // Thêm state để lưu dữ liệu biểu đồ
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Số đơn đặt bàn',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        yAxisID: 'y1',
      }
    ]
  });

  // Thêm state mới cho totalBooking
  const [totalBooking, setTotalBooking] = useState(0);

  // Thêm state mới cho totalRevenue và totalBarBranch
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBarBranch, setTotalBarBranch] = useState(0);

  // Thêm state để quản lý lỗi
  const [dateError, setDateError] = useState("");

  // Thêm state để quản lý lỗi API
  const [apiError, setApiError] = useState("");

  const initialFetchDone = useRef(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!initialFetchDone.current) {
        try {
          // Fetch danh sách bar trước
          const barListResponse = await getAllBarsNoPage();
          
          if (barListResponse?.data?.data?.onlyBarIdNameResponses) {
            const bars = barListResponse.data.data.onlyBarIdNameResponses;
            setBarList(bars);
            
            // Nếu có bars, lấy barId đầu tiên
            if (bars.length > 0) {
              const firstBarId = bars[0].barId;
              setBarId(firstBarId); // Set selected barId
              
              // Fetch revenue data với barId đầu tiên
              const revenueResponse = await getAllRevenue();
              
              if (revenueResponse.data?.data) {
                const { revenueBranch, totalBooking, totalBarBranch } = revenueResponse.data.data;
                setTotalRevenue(revenueBranch);
                setTotalBooking(totalBooking);
                // setTotalBarBranch(totalBarBranch);
              }

              // Fetch biểu đồ với barId đầu tiên
              await fetchRevenue({
                barId: firstBarId,
                fromTime: getStartOf2024(),
                toTime: formatDateToUTC7()
              });
            }
          }

          initialFetchDone.current = true;
        } catch (error) {
          console.error("Error fetching initial data:", error);
          setApiError("Có lỗi xảy ra khi tải dữ liệu");
        }
      }
    };

    fetchInitialData();
  }, []);

  const fetchRevenue = async (filters = {}) => {
    try {
      // Reset error messages
      setDateError("");
      setApiError("");

      const response = await revenueDashboard(
        filters.barId || barId,
        filters.fromTime || startDate,
        filters.toTime || endDate
      );
      
      if (response.data?.data) {
        const { revenueOfBar, totalBooking, bookingReveueResponses } = response.data.data;
        setRevenue(revenueOfBar);
        setTotalBooking(totalBooking);

        const labels = bookingReveueResponses.map(item => 
          new Date(item.date).toLocaleDateString('vi-VN')
        );
        const revenueData = bookingReveueResponses.map(item => item.totalPrice);
        const bookingData = bookingReveueResponses.map(item => item.totalBookingOfDay);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Doanh thu (VNĐ)',
              data: revenueData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
              yAxisID: 'y',
            },
            {
              label: 'Số đơn đặt bàn',
              data: bookingData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.3,
              yAxisID: 'y1',
            }
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Có lỗi xảy ra khi tải dữ liệu');
      }
    }
  };

  // Cập nhật hàm handleFilter
  const handleFilter = () => {
    // Reset error trước khi validate
    setDateError("");

    // Kiểm tra cả hai ngày phải được chọn
    if (!startDate || !endDate) {
      setDateError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }

    // Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
    if (new Date(startDate) > new Date(endDate)) {
      setDateError("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
      return;
    }

    // Nếu validation pass, gọi API
    fetchRevenue({
      barId: barId,
      fromTime: startDate,
      toTime: endDate
    });
  };

  // Cập nhật options cho biểu đồ
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu và số đơn đặt bàn',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) { // Doanh thu
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(context.parsed.y);
            } else { // Số đơn
              label += context.parsed.y + ' đơn';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value);
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số đơn đặt bàn'
        },
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value + ' đơn';
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  // Handle navigation
  const handleNavigate = () => {
    navigate('/manager/payment-history'); // Replace with your desired route
  };

  // Thêm hàm xử lý export CSV
  const handleExportCSV = async () => {
    try {
      // Kiểm tra ngày trước khi export
      if (!startDate || !endDate) {
        message.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc");
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        message.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
        return;
      }

      const response = await getExportCSVManager(barId, startDate, endDate);
      
      // Tạo blob từ response
      const blob = new Blob([response.data], { type: 'text/csv' });
      
      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo element a để download
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success("Xuất file thành công!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      message.error("Có lỗi xảy ra khi xuất file");
    }
  };

  return (
    <div className="space-y-8">
      {/* Card thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng Chi Nhánh</h3>
          <p className="text-3xl font-bold text-blue-600">{totalBarBranch}</p>
        </div> */}
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">Tổng doanh thu</h3>
            <button
              onClick={() => navigate('/manager/payment-history')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-white rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span>Lịch sử giao dịch</span>
            </button>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">Tổng đơn đặt bàn</h3>
            <button
              onClick={() => navigate('/manager/table-registrations')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-white rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span>Lịch sử đặt bàn</span>
            </button>
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalBooking}</p>
        </div>
      </div>

      {/* Card biểu đồ và bộ lọc */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Header của card */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Biểu đồ doanh thu và số đơn đặt bàn</h2>
        </div>

        {/* Phần filter */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5 font-medium">
                Chi nhánh
              </label>
              <select
                value={barId}
                onChange={(e) => {
                  const selectedBarId = e.target.value;
                  setBarId(selectedBarId);
                  // Khi thay đổi bar, tự động fetch dữ liệu mới
                  fetchRevenue({
                    barId: selectedBarId,
                    fromTime: startDate,
                    toTime: endDate
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {barList && barList.length > 0 && barList.map((bar) => (
                  <option key={bar.barId} value={bar.barId}>
                    {bar.barName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5 font-medium">
                Từ ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`px-3 py-2 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5 font-medium">
                Đến ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`px-3 py-2 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>

            <div className="flex flex-col">
              <div className="flex-grow"></div>
              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Áp dụng bộ lọc
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Xuất CSV
                </button>
              </div>
            </div>
          </div>

          {/* Hiển thị lỗi validation ngày */}
          {dateError && (
            <div className="mt-2">
              <span className="text-red-500 text-sm">{dateError}</span>
            </div>
          )}

          {/* Hiển thị lỗi từ API */}
          {apiError && (
            <div className="mt-2">
              <span className="text-red-500 text-sm">{apiError}</span>
            </div>
          )}
        </div>

        {/* Phần biểu đồ */}
        <div className="p-6">
          <div className="h-[400px]">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardManager;
