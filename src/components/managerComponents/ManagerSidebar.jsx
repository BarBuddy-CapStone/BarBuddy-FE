import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import BarChartIcon from '@mui/icons-material/BarChart';
import StoreIcon from '@mui/icons-material/Store';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import MoodIcon from '@mui/icons-material/Mood';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentIcon from '@mui/icons-material/Payment';

const sidebarItems = [
  {
    icon: ListAltIcon,
    label: "Danh Sách Đặt Bàn",
    path: "/manager/table-registrations",
  },
  {
    icon: TableRestaurantIcon,
    label: "Loại bàn",
    path: "/manager/table-type-management",
  },
  {
    icon: TableRestaurantIcon,
    label: "Bàn",
    path: "/manager/table-management",
  },
  {
    icon: LocalActivityIcon,
    label: "Sự kiện",
    path: "/manager/event-management",
  },
  {
    icon: BadgeIcon,
    label: "Nhân viên",
    path: "/manager/staff",
  },
  {
    icon: LocalBarIcon,
    label: "Thức uống",
    path: "/manager/managerDrinkCategory",
  },
  {
    icon: PaymentIcon,
    label: "Lịch Sử Thanh Toán",
    path: "/manager/payment-history",
  },
  {
    icon: FeedbackIcon,
    label: "Đánh giá",
    path: "/manager/feedback",
  },
];

function ManagerSidebar({ className, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find((item) => item.path === currentPath);
    if (currentItem) {
      setActiveItem(currentItem.label);
    }
  }, [location]);

  const handleItemClick = (label) => {
    setActiveItem(label);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <nav className={`${className} bg-white flex flex-col`}>
      <div className="flex justify-between items-center p-4 md:hidden">
        <h2 className="text-xl font-bold">Danh Mục</h2>
        <button onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="flex justify-center items-center py-8">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a0a0c1b5ecdf562f92f44965e83233e25cd253bd5323f36c1b1977b0b39805d?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d"
            alt="Bar Buddy 1 logo"
            className="object-contain h-24 w-auto"
          />
        </div>
        <ul className="flex flex-col space-y-2 px-4">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`rounded-lg overflow-hidden ${
                activeItem === item.label ? "bg-sky-100" : ""
              }`}
            >
              {item.label === "Đăng xuất" ? (
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleItemClick(item.label)}
                >
                  <item.icon className="w-5 h-5 text-sky-900" />
                  <span className="text-sky-900">{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleItemClick(item.label)}
                >
                  <item.icon className="w-5 h-5 text-sky-900" />
                  <span className="text-sky-900">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default ManagerSidebar;
