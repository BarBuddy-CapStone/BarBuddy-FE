import React, { useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleFilter = () => {
    // Filter logic here
  };

  // Sample data for Chart.js
  const data = {
    labels: ['09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07'],
    datasets: [
      {
        label: 'Reservation',
        data: [100, 150, 180, 130, 190, 170, 220],
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Customer',
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
        text: 'Reservation and Customer Statistics',
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
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Lịch sử giao dịch
            </button>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">10,000,000đ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng khách hàng</h3>
          <p className="text-3xl font-bold text-purple-600">500</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center space-x-2">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-gray-600 text-sm mb-1 font-bold">
              From
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1 pr-6 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Ngày bắt đầu"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-gray-600 text-sm mb-1 font-bold">
              To
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-1 pr-6 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Ngày kết thúc"
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
