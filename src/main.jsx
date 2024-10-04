import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
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
import StaffManagement from "./pages/admin/staffManager/StaffManagement";
import StaffCreation from "./pages/admin/staffManager/StaffCreation";
import StaffDetail from "./pages/admin/staffManager/StaffDetail";
import CustomerManagement from "./pages/admin/customerManager/CustomerManagement";
import CustomerCreation from "./pages/admin/customerManager/CustomerCreation";
import CustomerDetail from "./pages/admin/customerManager/CustomerDetail";
import BookingList from "./pages/staff/table-registration/BookingList";
import BarManagement from "./pages/admin/barManager/BarManagement";
import BarBuddyProfile from "./pages/admin/barManager/BarProfile";
import DrinkCategories from "./pages/admin/managerDrinkCate/ManagerDrink";
import ManagerDrink from "./pages/admin/ManagerDrinkBasedCate/ManagerDrink";
import DrinkDetail from "./pages/admin/ManagerDrinkBasedCate/DrinkDetail";
import ManagerDrinkBasedEmotional from "./pages/admin/ManagerDrinkBasedCate/ManagerDrinkBasedEmotion";
import AdminLayout from "./components/adminComponents/AdminLayout";
import StaffLayout from "./components/staffComponents/StaffLayout";
import AddBar from "./pages/admin/barManager/AddBar";
import AddDrink from "./pages/admin/ManagerDrinkBasedCate/AddDrink";
import BookingDetail from "./pages/staff/table-registration/BookingDetail";
import BarDetail from "./pages/customer/barDetail/BarDetail";
import HomePage from "./pages/customer/homePage/HomePage";
import CustomerLayout from "./components/customerComponents/CustomerLayout";
import BookingTable from "./pages/customer/booking/bookingTable/BookingTable";
import BookingDrink from "./pages/customer/booking/bookingDrink/BookingDrink";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route Của Admin */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* Set Dashboard as the default page */}
          <Route path="admin/dashboard" element={<Dashboard />} />

          <Route path="admin/feedback" element={<Feedback />}></Route>
          <Route path="admin/feedbackdetail" element={<FeedbackDetail />}></Route>

          <Route path="admin/emotional" element={<EmotionalCategory />}></Route>

          <Route path="admin/table-type-management" element={<TableTypeManagement />}></Route>
          <Route path="admin/payment-history" element={<PaymentHistoryAdmin />}></Route>

          <Route path="admin/customers" element={<CustomerManagement />}></Route>
          <Route path="admin/customer-creation" element={<CustomerCreation />}></Route>
          <Route path="admin/customer-detail" element={<CustomerDetail />}></Route>

          <Route path="admin/staff" element={<StaffManagement />}></Route>
          <Route path="admin/staff-creation" element={<StaffCreation />}></Route>
          <Route path="admin/staff-detail" element={<StaffDetail />}></Route>

          <Route path="admin/barmanager" element={<BarManagement />}></Route>
          <Route path="admin/barProfile" element={<BarBuddyProfile />}></Route>
          <Route path="admin/addBar" element={<AddBar />}></Route>

          <Route path="admin/managerDrinkCategory" element={<DrinkCategories />}></Route>
          <Route path="admin/managerDrinkCategory/managerDrink" element={<ManagerDrink />}></Route>
          <Route path="admin/managerDrink/DrinkDetail" element={<DrinkDetail />}></Route>
          <Route path="admin/managerDrink/addDrink" element={<AddDrink />}></Route>
          <Route path="admin/emotional/drinkBaseEmotional" element={<ManagerDrinkBasedEmotional />}></Route>
        </Route>

        {/* Route Của Staff */}
        <Route path="/" element={<StaffLayout />}>
          <Route path="staff/table-management" element={<TableManagement />}></Route>
          <Route path="staff/table-management/table-list" element={<TableManagementDetail />}></Route>
          <Route path="staff/payment-history" element={<PaymentHistoryStaff />}></Route>
          <Route path="staff/table-registrations" element={<BookingList />}></Route>
        </Route>

        {/* Route Của Customer */}
        <Route path="/" element={<CustomerLayout />}>
          <Route path="bookingtable" element={<BookingTable/>}></Route>
          <Route path="bookingdrink" element={<BookingDrink/>}></Route>
          <Route path="home" element={<HomePage />}></Route>
          <Route path="bar-detail" element={<BarDetail />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode >
);
