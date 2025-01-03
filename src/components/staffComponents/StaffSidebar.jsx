import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PaymentIcon from '@mui/icons-material/Payment';

const sidebarItems = [
  {
    icon: ListAltIcon,
    label: "Danh Sách Đặt Bàn",
    path: "/staff/table-registrations",
  },
  {
    icon: TableRestaurantIcon,
    label: "Bàn",
    path: "/staff/table-management",
  },
  {
    icon: PaymentIcon,
    label: "Thanh Toán",
    path: "/staff/payment-history",
  },
];

function StaffSidebar({ className, isOpen, onClose }) {
  const location = useLocation();
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
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleItemClick(item.label)}
              >
                <item.icon className="w-5 h-5 text-sky-900" />
                <span className="text-sky-900">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default StaffSidebar;
