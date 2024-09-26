import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import AdminLayout from "./components/adminComponents/AdminLayout";
import StaffManagement from "./pages/admin/staffs/StaffManagement";
import StaffCreation from "./pages/admin/staffs/StaffCreation";
import StaffDetail from "./pages/admin/staffs/StaffDetail";
import CustomerManagement from "./pages/admin/customers/CustomerManagement";
import CustomerCreation from "./pages/admin/customers/CustomerCreation";
import CustomerDetail from "./pages/admin/customers/CustomerDetail";
import BookingList from "./pages/staff/TableRegistration/BookingList";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Thêm Route Trang vào */}
        {/* <Route path="/customers" element={<CustomerManagement />}></Route> */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/staffs" element={<StaffManagement />}></Route>
          <Route path="/staffs/staff-creation" element={<StaffCreation/>}></Route>
          <Route path="/staffs/staff-detail" element={<StaffDetail/>}></Route>
          <Route path="/customers" element={<CustomerManagement/>}></Route>
          <Route path="/customers/customer-creation" element={<CustomerCreation/>}></Route>
          <Route path="/customers/customer-detail" element={<CustomerDetail/>}></Route>
          <Route path="/table-registrations" element={<BookingList/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
