import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./components/adminComponents/AdminLayout";
import "./index.css";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import Feedback from "./pages/admin/feedback/Feedback";
import FeedbackDetail from "./pages/admin/feedback/FeedbackDetail";
import EmotionalCategory from "./pages/admin/emotionalCategory/EmotionalCategory";
import TableTypeManagement from "./pages/admin/table-type-management/TableTypeManagementAdmin";
import PaymentHistoryAdmin from "./pages/admin/payment-history/PaymentHistoryAdmin";
import PaymentHistoryStaff from "./pages/staff/payment-history/PaymentHistoryStaff";
import TableManagement from "./pages/staff/table-management/TableTypeManagementStaff";
import TableManagementDetail from "./pages/staff/table-management/TableManagement";
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
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/feedback" element={<Feedback />}></Route>
          <Route path="/feedbackdetail" element={<FeedbackDetail />}></Route>
          <Route path="/emotional" element={<EmotionalCategory />}></Route>
          {/* Trung Kiên */}
          <Route path="/admin/table-type-management" element={<TableTypeManagement />}></Route>
          <Route path="/admin/payment-history" element={<PaymentHistoryAdmin />}></Route>
          <Route path="/staff/table-management" element={<TableManagement />}></Route>
          <Route path="/staff/table-management-detail" element={<TableManagementDetail />}></Route>
          <Route path="/staff/payment-history" element={<PaymentHistoryStaff />}></Route>
          {/* Trí Đức */}
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
