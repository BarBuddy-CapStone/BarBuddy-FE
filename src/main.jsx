import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import CustomerManagement from "./pages/admin/staff/CustomerManagement";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import AdminLayout from "./components/adminComponents/AdminLayout";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Thêm Route Trang vào */}
        <Route path="/" element={<CustomerManagement />}></Route>
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
