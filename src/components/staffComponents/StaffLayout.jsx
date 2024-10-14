import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { StaffHeader, StaffSidebar } from "src/components";

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div ref={sidebarRef}>
        <StaffSidebar 
          className={`w-64 shadow-md transition-all duration-300 ease-in-out 
                      md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      md:static absolute z-30 h-full`} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <StaffHeader 
          className="bg-white shadow-sm" 
          onMenuClick={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StaffLayout;
