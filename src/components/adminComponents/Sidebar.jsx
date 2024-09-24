import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d447963c0e2878906a2d47debe0689375423a1e6aae06abe9c3bb9c0f7ef8125?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Thống Kê",
    path: "/dashboard", 
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/33db59cd7508c1e0722b7aac5ca349c12026693c3ac33f10f3829b08ddf4f21b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Chi Nhánh Bar",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/de548ed0752aac144960cdb1b1ffb03ad8c3499e1187d77a7fe1d9549bf32ce0?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Loại bàn",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2124de1f84debf18515d926b7f3783616150e0e217e5c335c88bc2e4c8a678b?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Khách hàng",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/440ee1a0e1ebdac55864998cfca81381313813be443ef5d583612ba25030d8dd?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Nhân viên",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3c65972de928de441937c8a84d149de0421f25b446ce8619d40ebbb8ec92d536?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Danh mục cảm xúc",
    path: "/emotional",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/04c84a327e6b5f93017f85eaea888eacfcc50195393a5722b5df28954d37c034?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Thức uống",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/da0eaa428bea85955e87112199b227f3c69d12e8f2859d4d5d91d7ace3f2c300?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đánh giá",
    path: "/feedback",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e7eb2ad337036706b7532fd40364b21565d86709be13d4e19a66ba6c3e7636bf?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đăng xuất",
  },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Thống Kê");

  return (
    <nav className="flex flex-col w-[15%] max-md:ml-0 max-md:w-full h-full min-h-screen overflow-y-auto">
      <div className="flex overflow-hidden flex-col mx-auto w-full bg-white h-full">
        <div className="flex overflow-hidden gap-3 justify-between items-start py-px pl-6 bg-white max-md:pl-3">
          <div className="flex flex-col mt-5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a0a0c1b5ecdf562f92f44965e83233e25cd253bd5323f36c1b1977b0b39805d?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d"
              alt="Bar Buddy 1 logo"
              className="object-contain aspect-[2.07] w-[200px]"
            />
            <div className="flex flex-col pl-2">
              <h1 className="self-center text-xl font-bold text-sky-900 text-opacity-90">
                Bar Buddy 1
              </h1>
              <ul className="flex flex-col items-start mt-10 text-md text-blue-900 max-md:mt-8">
                {sidebarItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex overflow-hidden gap-3 items-center px-2 py-1 mt-3 whitespace-nowrap rounded-lg cursor-pointer ${
                      activeItem === item.label ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <img
                        loading="lazy"
                        src={item.icon}
                        alt=""
                        className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                      />
                      <span className="self-stretch my-auto">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
