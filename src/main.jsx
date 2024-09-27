import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
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
import StaffManagement from "./pages/staff/StaffManagement/StaffManagement";
import StaffCreation from "./pages/staff/staffCreation/StaffCreation";
import StaffDetail from "./pages/staff/staffDetail/StaffDetail";
import CustomerManagement from "./pages/admin/customer/CustomerManagement";
import CustomerCreation from "./pages/admin/customer/CustomerCreation";
import CustomerDetail from "./pages/admin/customer/CustomerDetail";
import BookingList from "./pages/staff/TableRegistration/BookingList";
import BarManagement from "./pages/admin/barManager/BarManagement";
import BarBuddyProfile from "./pages/admin/dashboard/BarProfile";
import DrinkCategories from "./pages/admin/managerDrink/ManagerDrink";
import ManagerDrink from "./pages/admin/ManagerDrinkBasedCate/ManagerDrink";
import DrinkDetail from "./pages/admin/ManagerDrinkBasedCate/DrinkDetail";
import ManagerDrinkBasedEmotional from "./pages/admin/ManagerDrinkBasedCate/ManagerDrinkBasedEmotion";
import AdminLayout from "./components/adminComponents/AdminLayout";

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
          <Route path="/staff/table-management/table-list" element={<TableManagementDetail />}></Route>
          <Route path="/staff/payment-history" element={<PaymentHistoryStaff />}></Route>
          {/* Trí Đức */}
          <Route path="/staff" element={<StaffManagement />}></Route>
          <Route path="/staff/staff-creation" element={<StaffCreation/>}></Route>
          <Route path="/staff/staff-detail" element={<StaffDetail/>}></Route>
          <Route path="/customers" element={<CustomerManagement/>}></Route>
          <Route path="/customers/customer-creation" element={<CustomerCreation/>}></Route>
          <Route path="/customers/customer-detail" element={<CustomerDetail/>}></Route>
          <Route path="/table-registrations" element={<BookingList/>}></Route>
          {/* Tiến */}
          <Route path="/barmanager" element={<BarManagement/>}></Route>
          <Route path="/barmanager/barProfile" element={<BarBuddyProfile/>}></Route>
          <Route path="/managerDrinkCategory" element={<DrinkCategories />}></Route>
          <Route path="/managerDrink" element={<ManagerDrink />}></Route>
          <Route path="/managerDrink/DrinkDetail" element={<DrinkDetail />}></Route>
          <Route path="/managerDrink/emotional" element={<ManagerDrinkBasedEmotional />}></Route>
        </Route>
      </Routes> 
    </BrowserRouter>
  </React.StrictMode>
);
