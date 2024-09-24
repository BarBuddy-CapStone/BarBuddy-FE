import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "src/components";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar className="w-64 shadow-md" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {/* Adjust the padding values here */}
          <div className="container mx-auto px-2 py-2"> 
            {/* Adjusted padding from px-6 py-8 to px-4 py-4 */}
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
