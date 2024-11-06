import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { revenueDashboard, getBarNameOnly, getAllRevenue } from "../../../lib/service/adminService";
import { message } from 'antd';

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

const Dashboard = () => {
  // Khởi tạo startDate với ngày hiện tại theo UTC+7
  const [startDate, setStartDate] = useState(formatDateToUTC7());
  const [endDate, setEndDate] = useState("");
  const [barId, setBarId] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [barList, setBarList] = useState([]);
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

  useEffect(() => {
    const fetchBarList = async () => {
      try {
        const response = await getBarNameOnly();
        if (response.data?.data) {
          setBarList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching bar list:", error);
      }
    };

    const fetchAllRevenue = async () => {
      try {
        const response = await getAllRevenue();
        if (response.data?.data) {
          const { revenueBranch, totalBooking, totalBarBranch } = response.data.data;
          setTotalRevenue(revenueBranch);
          setTotalBooking(totalBooking);
          setTotalBarBranch(totalBarBranch);
        }
      } catch (error) {
        console.error("Error fetching all revenue:", error);
      }
    };

    fetchBarList();
    fetchAllRevenue(); // Gọi API mới
    fetchRevenue({
      fromTime: formatDateToUTC7()
    });
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
    navigate('/admin/payment-history'); // Replace with your desired route
  };

  return (
    <div className="space-y-8">
      {/* Card thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng Chi Nhánh</h3>
          <p className="text-3xl font-bold text-blue-600">{totalBarBranch}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">Tổng doanh thu</h3>
            <button
              onClick={handleNavigate}
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
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng đơn đặt bàn</h3>
          <p className="text-3xl font-bold text-purple-600">{totalBooking}</p>
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
                onChange={(e) => setBarId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả chi nhánh</option>
                {barList.map((bar) => (
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
              <button
                onClick={handleFilter}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Áp dụng bộ lọc
              </button>
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

export default Dashboard;
