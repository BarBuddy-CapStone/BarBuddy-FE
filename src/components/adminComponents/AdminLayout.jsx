import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminHeader, AdminSidebar } from "src/components";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../animations/PageTransition";
import Loading from "../commonComponents/loading/Loading";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Show loading when route changes
    setIsLoading(true);
    
    // Hide loading after content is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <Loading />}
      </AnimatePresence>

      <div ref={sidebarRef}>
        <AdminSidebar 
          className={`w-64 shadow-md transition-all duration-300 ease-in-out 
                      md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                      md:static absolute z-30 h-full`} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader 
          className="bg-white shadow-sm" 
          onMenuClick={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100">
          <div className="container mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              {!isLoading && (
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
