import React, { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CustomerHeader, CustomerFooter, ScrollToTopButton } from "src/components";
import LoginForm from "src/pages/authen/Login";
import Registration from "src/pages/authen/Registration";

const CustomerLayout = () => {
  const [isPopupLogin, setPopupLogin] = useState(true);
  const [isPopupVisible, setPopupVisible] = useState(false); 
  const [isRegister, setIsRegister] = useState(false); 

  const handleLoginClose = () => {
    setPopupVisible(false);
  };

  const openLogin = () => {
    setIsRegister(false);
    setPopupVisible(true); 
  };

  const openRegister = () => {
    setIsRegister(true);
    setPopupVisible(true); 
  };

  return (
<div className="flex flex-col min-h-screen bg-zinc-900 relative">
      <CustomerHeader onLoginClick={openLogin} />

      <main className={`flex-grow py-3 px-3 ${isPopupVisible ? 'pointer-events-none' : ''}`}>
        <Outlet />
        <ScrollToTopButton />
      </main>

      <CustomerFooter />
      <ToastContainer theme="dark" />

      {/* Overlay che toàn bộ trang với Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          {isRegister ? (
            <Registration onClose={handleLoginClose} onSwitchToLogin={openLogin} />
          ) : (
            <LoginForm onClose={handleLoginClose} onSwitchToRegister={openRegister} />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerLayout;
