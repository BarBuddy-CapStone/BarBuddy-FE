import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { StaffHeader, StaffSidebar } from "src/components";

const StaffLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <StaffSidebar className="w-64 shadow-md" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <StaffHeader className="bg-white shadow-sm" />
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
