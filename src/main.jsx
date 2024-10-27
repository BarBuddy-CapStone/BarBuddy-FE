import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedStaffRoute from "./components/ProtectedStaffRoute";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";
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
import BarProfile from "./pages/admin/barManager/BarProfile";
import DrinkCategories from "./pages/admin/managerDrinkCate/DrinkCategories";
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
import Registration from "./pages/(auth)/registration/Registration";
import Page404 from "./pages/(auth)/error/Page404";
import Login from "./pages/(auth)/login/Login";
import Success from "./pages/(auth)/paymentStatus/Success";
import Failed from "./pages/(auth)/paymentStatus/Failed";
import Error from "./pages/(auth)/paymentStatus/Error";
import EventManagement from "./pages/admin/event-management/EventManagement";
import AddEvent from "./pages/admin/event-management/AddEvent";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route Của Admin */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/feedback" element={<Feedback />}/> 
            <Route path="admin/feedback/detail/:feedbackId" element={<FeedbackDetail />}/> 
            <Route path="admin/emotional" element={<EmotionalCategory />}/> 
            <Route path="admin/table-type-management" element={<TableTypeManagement />}/> 
            <Route path="admin/payment-history" element={<PaymentHistoryAdmin />}/> 
            <Route path="admin/customers" element={<CustomerManagement />}/> 
            <Route path="admin/customer-creation/:id" element={<CustomerCreation />}/> 
            <Route path="admin/customer-detail" element={<CustomerDetail />}/> 
            <Route path="admin/staff" element={<StaffManagement />}/> 
            <Route path="admin/staff-creation" element={<StaffCreation />}/> 
            <Route path="admin/staff-detail/:id" element={<StaffDetail />}/> 
            <Route path="admin/barmanager" element={<BarManagement />}/> 
            <Route path="admin/barProfile/:barId" element={<BarProfile />}/> 
            <Route path="admin/addBar" element={<AddBar />}/> 
            <Route path="admin/managerDrinkCategory" element={<DrinkCategories />}/>
            <Route path="admin/managerDrinkCategory/managerDrink/:cateId" element={<ManagerDrink />}/>
            <Route path="admin/managerDrink/DrinkDetail/:drinkId" element={<DrinkDetail />}/>
            <Route path="admin/managerDrink/addDrink" element={<AddDrink />}/>
            <Route path="admin/emotional/drinkBaseEmo" element={<ManagerDrinkBasedEmotional />}/> 
            <Route path="admin/event-management" element={<EventManagement />}/>
            <Route path="admin/event-management/add-event" element={<AddEvent />} />
          </Route>
        </Route>

        {/* Route Của Staff */}
        <Route element={<ProtectedStaffRoute />}>
          <Route path="/" element={<StaffLayout />}>
            <Route path="staff/table-management" element={<TableManagement />}/> 
            <Route path="staff/table-management/table/:tableTypeId" element={<TableManagementDetail />}/> 
            <Route path="staff/payment-history" element={<PaymentHistoryStaff />}/> 
            <Route path="staff/table-registrations" element={<BookingList />}/> 
            <Route path="staff/table-registration-detail/:bookingId" element={<BookingDetail />}/> 
          </Route>
        </Route>

        {/* Route Của Customer */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} /> 
            <Route path="home" element={<HomePage />} />
            <Route path="bookingtable" element={<BookingTable/>} />
            <Route path="bookingdrink" element={<BookingDrink/>} />
            <Route path="bar-detail/:barId" element={<BarDetail />} />
            <Route path="profile/:accountId" element={<ProfilePage />} />
            <Route path="booking-history/:accountId" element={<BookingHistory />} />
            <Route path="booking-detail/:bookingId" element={<BookingDetailPage />} />
            <Route path="payment-history/:accountId" element={<CustomerPaymentHistory />} />
            <Route path="drinkList" element={<DrinkList />} /> 
            <Route path="drinkDetail" element={<DrinkDetailCustomer />}/> 
            <Route path="customer" element={<BookingTable />}/> 
            <Route path="payment" element={<PaymentPage />}/> 
            <Route path="payment-detail" element={<PaymentDetail />}/> 

            {/* Trạng thái trang khi thanh toán */}
            <Route path="payment-success/:paymentId" element={<Success />}/> 
            <Route path="payment-failed/:paymentId" element={<Failed />}/> 
            <Route path="payment-error/:paymentId" element={<Error />}/> 
          </Route>
        </Route>

        {/* Route Trang Hệ thống và lỗi */}
        <Route path="/404" element={<Page404/>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="login" element={<Login />}/>
        <Route path="register" element={<Registration />}/>
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
