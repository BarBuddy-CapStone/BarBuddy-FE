import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
// import CustomerManagement from "./pages/admin/staff/CustomerManagement";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import AdminLayout from "./components/adminComponents/AdminLayout";
import TableTypeManagement from "./pages/admin/table-type-management/TableTypeManagementAdmin";
import PaymentHistoryAdmin from "./pages/admin/payment-history/PaymentHistoryAdmin";
import PaymentHistoryStaff from "./pages/staff/payment-history/PaymentHistoryStaff";
import TableManagement from "./pages/staff/table-management/TableTypeManagementStaff";
import TableManagementDetail from "./pages/staff/table-management/TableManagement";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Thêm Route Trang vào */}
        {/* <Route path="/" element={<CustomerManagement />}></Route> */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/admin/table-type-management" element={<TableTypeManagement />}></Route>
          <Route path="/admin/payment-history" element={<PaymentHistoryAdmin />}></Route>
          <Route path="/staff/table-management" element={<TableManagement />}></Route>
          <Route path="/staff/table-management-detail" element={<TableManagementDetail />}></Route>
          <Route path="/staff/payment-history" element={<PaymentHistoryStaff />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
