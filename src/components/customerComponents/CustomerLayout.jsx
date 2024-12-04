import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CustomerHeader, CustomerFooter, ScrollToTopButton } from "src/components";
import { useFCMToken } from "src/hooks/useFCMToken";

const CustomerLayout = () => {
  const { fcmToken, loading, error } = useFCMToken();

  useEffect(() => {
    if (error) {
      console.error('FCM Error:', error);
    }
    if (fcmToken) {
      console.log('FCM Token initialized:', fcmToken);
    }
  }, [fcmToken, error]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 relative">
      <CustomerHeader />

      <main className="flex-grow py-3 px-3">
        <Outlet />
        <ScrollToTopButton />
      </main>

      <CustomerFooter />
      <ToastContainer theme="dark" />
    </div>
  );
};

export default CustomerLayout;
