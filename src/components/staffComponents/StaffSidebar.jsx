import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5b51421817b621e58b6a1673254f2d5fb679185ca7183802dac1a797802c3426?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Bàn",
    path: "#",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/77f49d6df90bd18cb31fd9971dc279e92d749b7bda76bdc20ccec31b24e26688?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Danh Sách Đặt Bàn",
    path: "#",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee61b0e1ffecfeffb4d5eb279f86f81d5f315a19b9ecb59ec68f0a87e5bb6490?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Danh Sách Thanh Toán",
    path: "#",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e7eb2ad337036706b7532fd40364b21565d86709be13d4e19a66ba6c3e7636bf?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6",
    label: "Đăng xuất",
    path: "#",
  },
];

function StaffSidebar() {
  const [activeItem, setActiveItem] = useState("Bàn");

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
              <ul className="flex flex-col items-start mt-10 text-md text-blue-900 max-md:mt-8 w-full">
                {sidebarItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex overflow-hidden gap-3 items-center px-2 py-1 mt-3 whitespace-nowrap rounded-lg cursor-pointer w-full ${
                      activeItem === item.label ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 w-full"
                    >
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

export default StaffSidebar;
