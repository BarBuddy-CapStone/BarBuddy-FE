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
import { revenueDashboard, getBarNameOnly } from "../../../lib/service/adminService";

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

const Dashboard = () => {
  // Khởi tạo startDate với ngày hiện tại theo UTC+7
  const [startDate, setStartDate] = useState(formatDateToUTC7());
  const [endDate, setEndDate] = useState("");
  const [barId, setBarId] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [filterType, setFilterType] = useState("day");
  const [barList, setBarList] = useState([]);
  const navigate = useNavigate();

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

    fetchBarList();
    // Gọi fetchRevenue với ngày hiện tại và type mặc định
    fetchRevenue({
      dateTime: formatDateToUTC7(),
      type: "day"
    });
  }, []);

  const fetchRevenue = async (filters = {}) => {
    try {
      const response = await revenueDashboard(
        filters.barId || barId,
        filters.dateTime || startDate,
        filters.type || filterType
      );
      if (response.data?.data?.revenueOfBar !== undefined) {
        setRevenue(response.data.data.revenueOfBar);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
    }
  };

  // Cập nhật hàm handleFilter để sử dụng ngày đã format
  const handleFilter = () => {
    fetchRevenue({
      barId: barId,
      dateTime: startDate,
      type: filterType
    });
  };

  // Sample data for Chart.js
  const data = {
    labels: ['09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07'],
    datasets: [
      {
        label: 'Đặt bàn trước',
        data: [100, 150, 180, 130, 190, 170, 220],
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Khách hàng',
        data: [120, 140, 160, 110, 150, 190, 210],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê đặt bàn trước và khách hàng',
      },
    },
  };

  // Handle navigation
  const handleNavigate = () => {
    navigate('/admin/payment-history'); // Replace with your desired route
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng số bàn</h3>
          <p className="text-3xl font-bold text-blue-600">50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">Tổng doanh thu</h3>
            <button
            onClick={handleNavigate}
            className="flex items-center gap-2 px-4 py-2 text-base text-black bg-white rounded-md border border-blue-500 shadow hover:bg-gray-300 w-full md:w-auto"
            >
            <span>Lịch sử giao dịch</span>
          </button>

          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {revenue.toLocaleString()}đ
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng khách hàng</h3>
          <p className="text-3xl font-bold text-purple-600">500</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1 font-bold">
              Chi nhánh
            </label>
            <select
              value={barId}
              onChange={(e) => setBarId(e.target.value)}
              className="p-1 border rounded-md text-sm min-w-[200px]"
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
            <label className="text-gray-600 text-sm mb-1 font-bold">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1 border rounded-md text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1 font-bold">
              Loại thống kê
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1 border rounded-md text-sm"
            >
              <option value="day">Trong ngày</option>
              <option value="month">Trong tháng</option>
              <option value="year">Trong năm</option>
            </select>
          </div>

          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Lọc
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h2>
        <div className="h-96">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
