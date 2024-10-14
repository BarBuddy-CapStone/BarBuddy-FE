import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5b51421817b621e58b6a1673254f2d5fb679185ca7183802dac1a797802c3426?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Bàn",
    path: "/staff/table-management",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/77f49d6df90bd18cb31fd9971dc279e92d749b7bda76bdc20ccec31b24e26688?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Danh Sách Đặt Bàn",
    path: "/staff/table-registrations",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee61b0e1ffecfeffb4d5eb279f86f81d5f315a19b9ecb59ec68f0a87e5bb6490?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Thanh Toán",
    path: "/staff/payment-history",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e7eb2ad337036706b7532fd40364b21565d86709be13d4e19a66ba6c3e7636bf?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đăng xuất",
    path: "#",
  },
];

function StaffSidebar({ className, isOpen, onClose }) {
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

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1500);
  };

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
                activeItem === item.label ? "bg-blue-100" : ""
              }`}
            >
              {item.label === "Đăng xuất" ? (
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                  <span>{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleItemClick(item.label)}
                >
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default StaffSidebar;
