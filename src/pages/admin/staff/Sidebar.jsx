import React, { useState } from 'react';

const sidebarItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5ee81e3d0fe5807767e49521752dd291d6eefc68943039ec2abffada3af39c9b?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Tables" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fa774ca36c660bb46889adb6308aacd22c05b04435507c4d017f8f42a169e0f0?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "TimeSlots" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/23fc25d9575cde782419719eb6d82f6cee51eac38e5ec37270915a55fd27d627?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Payment History" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e219b978fb2446c164f5941fd18d4ccac83b9560246bd6f9c7f0740d31f9c0cb?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Chat" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/78a94c68a0697e9e28b0ad489f5f9191517d3d73e1a5a036248894f64df7701f?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Customers" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/df74b56782330f9d94c1ed8b7e8c1fc1c8df4d65f7b80f3b99923fd9003ff69c?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Staffs" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/37ffae80fd4151714fa4bfa48e08f8d680666b875cd4f4b0af431dd793805f10?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Drinks" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c06f27889d8575ed5773053188f00ed404b68fc6c233f92c2c94443221bd2b0f?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Feedbacks" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f09d4bc19b0bb3834f13520df845d86e301727e58b59f09293a5a16c5e7dba2c?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Settings" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a7a133b27d7f6e4a637bfbd15fd1632db51a39a8f301bc55f5db268bb1449eae?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Branch" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/09eefcba4729558797c61cb47dc57004e1233af1cf4c978c0cd19767b6422d08?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d", label: "Log Out" }
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Customers");

  return (
    <nav className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
      <div className="flex overflow-hidden flex-col mx-auto w-full bg-white">
        <div className="flex overflow-hidden gap-5 justify-between items-start py-px pl-11 bg-white max-md:pl-5">
          <div className="flex flex-col mt-5">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a0a0c1b5ecdf562f92f44965e83233e25cd253bd5323f36c1b1977b0b39805d?placeholderIfAbsent=true&apiKey=402c56a5a1d94d11bd24e7050966bb9d" alt="Bar Buddy 1 logo" className="object-contain aspect-[2.07] w-[197px]" />
            <div className="flex flex-col pl-2.5">
              <h1 className="self-center text-2xl font-bold text-sky-900 text-opacity-90">Bar Buddy 1</h1>
              <ul className="flex flex-col items-start mt-14 text-lg text-blue-900 max-md:mt-10">
                {sidebarItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex overflow-hidden gap-4 items-center px-3 py-2 mt-4 whitespace-nowrap rounded-[50px] ${
                      activeItem === item.label ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    <img loading="lazy" src={item.icon} alt="" className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square" />
                    <span className="gap-6 self-stretch my-auto">{item.label}</span>
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