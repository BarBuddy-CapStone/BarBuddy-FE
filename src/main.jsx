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
import ProfilePage from "./pages/customer/customerProfile/CustomerProfile";
import BookingHistory from "./pages/customer/bookingHistory/CustomerBookingHistory";
import BookingDetailPage from "./pages/customer/bookingDetail/BookingDetail"; 
import CustomerPaymentHistory from "./pages/customer/customerPaymentHistory/CustomerPaymentHistory";
import DrinkList from "./pages/customer/drink/DrinkList";
import DrinkDetailCustomer from "./pages/customer/drink/DrinkDetail.jsx"

import PaymentPage from "./pages/customer/paymentPage/PaymentPage";
import PaymentDetail from "./pages/customer/paymentDetail/PaymentDetail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Trang default */}
         <Route path="/" element={<CustomerLayout />}>
             <Route index element={<HomePage />} /> 
             <Route path="home" element={<HomePage />}></Route>
         </Route>
         
        {/* Route Của Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="feedback" element={<Feedback />}></Route>
          <Route path="feedbackdetail" element={<FeedbackDetail />}></Route>

          <Route path="emotional" element={<EmotionalCategory />}></Route>

          <Route path="table-type-management" element={<TableTypeManagement />}></Route>
          <Route path="payment-history" element={<PaymentHistoryAdmin />}></Route>

          <Route path="customers" element={<CustomerManagement />}></Route>
          <Route path="customer-creation" element={<CustomerCreation />}></Route>
          <Route path="customer-detail" element={<CustomerDetail />}></Route>

          <Route path="staff" element={<StaffManagement />}></Route>
          <Route path="staff-creation" element={<StaffCreation />}></Route>
          <Route path="staff-detail" element={<StaffDetail />}></Route>

          <Route path="barmanager" element={<BarManagement />}></Route>
          <Route path="barProfile" element={<BarBuddyProfile />}></Route>
          <Route path="addBar" element={<AddBar />}></Route>

          <Route path="managerDrinkCategory" element={<DrinkCategories />}></Route>
          <Route path="managerDrinkCategory/managerDrink" element={<ManagerDrink />}></Route>
          <Route path="managerDrink/DrinkDetail" element={<DrinkDetail />}></Route>
          <Route path="managerDrink/addDrink" element={<AddDrink />}></Route>
          <Route path="emotional/drinkBaseEmo" element={<ManagerDrinkBasedEmotional />}></Route>
        </Route>

        {/* Route Của Staff */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="table-management" element={<TableManagement />}></Route>
          <Route path="table-management/table/:tableTypeId" element={<TableManagementDetail />}></Route>
          <Route path="payment-history" element={<PaymentHistoryStaff />}></Route>
          <Route path="table-registrations" element={<BookingList />}></Route>
          <Route path="table-registration-detail/:bookingId" element={<BookingDetail />}></Route>
        </Route>

        {/* Route Của Customer */}
        <Route path="/" element={<CustomerLayout />}>
          <Route path="bookingtable" element={<BookingTable/>}></Route>
          <Route path="bookingdrink" element={<BookingDrink/>}></Route>
          <Route path="bar-detail" element={<BarDetail />}></Route>
          <Route path="profile/:accountId" element={<ProfilePage />} />
          <Route path="booking-history/:accountId" element={<BookingHistory />} />
          <Route path="booking-detail/:bookingId" element={<BookingDetailPage />} />
          <Route path="payment-history/:accountId" element={<CustomerPaymentHistory />} />
          <Route path="drinkList" element={<DrinkList />}></Route>
          <Route path="drinkDetail" element={<DrinkDetailCustomer />}></Route>
          <Route path="customer" element={<BookingTable />}></Route>
          <Route path="payment" element={<PaymentPage />}></Route>
          <Route path="payment-detail" element={<PaymentDetail />}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode >
);