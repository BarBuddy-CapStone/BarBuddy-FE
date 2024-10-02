import React from "react";
import { Outlet } from "react-router-dom";
import { CustomerHeader, CustomerFooter, ScrollToTopButton } from "src/components";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <CustomerHeader />
      <main className="flex-grow py-6 px-3">
        <Outlet />
        <ScrollToTopButton />
      </main>
      <CustomerFooter />
    </div>
  );
};

export default CustomerLayout;
