import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d447963c0e2878906a2d47debe0689375423a1e6aae06abe9c3bb9c0f7ef8125?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Thống Kê",
    path: "/admin/dashboard",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/33db59cd7508c1e0722b7aac5ca349c12026693c3ac33f10f3829b08ddf4f21b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Chi Nhánh Bar",
    path: "/admin/barmanager",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/de548ed0752aac144960cdb1b1ffb03ad8c3499e1187d77a7fe1d9549bf32ce0?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Loại bàn",
    path: "/admin/table-type-management",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2124de1f84debf18515d926b7f3783616150e0e217e5c335c88bc2e4c8a678b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Khách hàng",
    path: "/admin/customers",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/440ee1a0e1ebdac55864998cfca81381313813be443ef5d583612ba25030d8dd?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Nhân viên",
    path: "/admin/staff",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3c65972de928de441937c8a84d149de0421f25b446ce8619d40ebbb8ec92d536?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Danh mục cảm xúc",
    path: "/admin/emotional",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/04c84a327e6b5f93017f85eaea888eacfcc50195393a5722b5df28954d37c034?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Thức uống",
    path: "/admin/managerDrinkCategory",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/da0eaa428bea85955e87112199b227f3c69d12e8f2859d4d5d91d7ace3f2c300?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đánh giá",
    path: "/admin/feedback",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e7eb2ad337036706b7532fd40364b21565d86709be13d4e19a66ba6c3e7636bf?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đăng xuất",
    path: "#",
  },
];

function AdminSidebar({ className, isOpen, onClose }) {
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

export default AdminSidebar;
