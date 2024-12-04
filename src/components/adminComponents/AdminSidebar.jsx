import BadgeIcon from "@mui/icons-material/Badge";
import BarChartIcon from "@mui/icons-material/BarChart";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import MoodIcon from "@mui/icons-material/Mood";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreIcon from "@mui/icons-material/Store";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
  {
    icon: BarChartIcon,
    label: "Thống Kê",
    path: "/admin/dashboard",
    subItems: [
      {
        icon: ReceiptIcon,
        label: "Lịch sử giao dịch",
        path: "/admin/payment-history",
      },
      {
        icon: BookOnlineIcon,
        label: "Lịch sử đặt bàn",
        path: "/admin/table-registrations",
      },
    ],
  },
  {
    icon: StoreIcon,
    label: "Chi Nhánh Bar",
    path: "/admin/barmanager",
  },
  {
    icon: BadgeIcon,
    label: "Quản Lí",
    path: "/admin/managers",
  },
  {
    icon: PeopleIcon,
    label: "Khách Hàng",
    path: "/admin/customers",
  },
  {
    icon: LocalBarIcon,
    label: "Thể Loại Thức Uống",
    path: "admin/drink-categories",
  },
  {
    icon: MoodIcon,
    label: "Danh mục cảm xúc",
    path: "/admin/emotional",
  },
  {
    icon: FeedbackIcon,
    label: "Đánh giá",
    path: "/admin/feedback",
  },
];

function AdminSidebar({ className, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    const findMatchingItem = () => {
      for (const item of sidebarItems) {
        if (item.subItems) {
          const matchingSubItem = item.subItems.find(
            (subItem) => location.pathname === subItem.path
          );
          if (matchingSubItem) {
            setActiveItem(item.label);
            setExpandedItem(item.label);
            return;
          }
        }
        if (location.pathname === item.path) {
          setActiveItem(item.label);
          return;
        }
      }
    };

    findMatchingItem();
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.label);
    if (window.innerWidth < 768) {
      onClose();
    }
    navigate(item.path);
  };

  const handleSubItemClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDropdownClick = (e, item) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    if (item.subItems) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
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
            <li key={index}>
              <div className="rounded-lg overflow-hidden">
                <div
                  className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-all duration-200
                    ${
                      activeItem === item.label
                        ? "bg-sky-100"
                        : "hover:bg-gray-50"
                    }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 ${
                        activeItem === item.label
                          ? "text-sky-900"
                          : "text-gray-700"
                      }`}
                    />
                    <span
                      className={
                        activeItem === item.label
                          ? "text-sky-900"
                          : "text-gray-700"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.subItems && (
                    <div
                      className="p-1.5 rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-200"
                      onClick={(e) => handleDropdownClick(e, item)}
                    >
                      <div
                        className={`transform transition-transform duration-200 ${
                          expandedItem === item.label
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      >
                        <KeyboardArrowDownIcon
                          fontSize="small"
                          className={
                            activeItem === item.label
                              ? "text-sky-900"
                              : "text-gray-700"
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-items với animation */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedItem === item.label
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.subItems && (
                    <div className="ml-8 space-y-1 mb-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-lg transition-all duration-200
                            ${
                              location.pathname === subItem.path
                                ? "bg-sky-50 text-sky-900"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => handleSubItemClick(subItem.path)}
                        >
                          <subItem.icon
                            className={`w-4 h-4 ${
                              location.pathname === subItem.path
                                ? "text-sky-900"
                                : "text-gray-700"
                            }`}
                          />
                          <span
                            className={
                              location.pathname === subItem.path
                                ? "text-sky-900"
                                : "text-gray-700"
                            }
                          >
                            {subItem.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default AdminSidebar;
