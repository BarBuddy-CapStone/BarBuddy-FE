import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import ProtectedStaffRoute from "./components/ProtectedRoute/ProtectedStaffRoute";
import ProtectedManagerRoute from "./components/ProtectedRoute/ProtectedManagerRoute";
import ProtectedAdminRoute from "./components/ProtectedRoute/ProtectedAdminRoute";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import FeedbackAdmin from "./pages/admin/feedback/FeedbackAdmin";
import FeedbackDetailAdmin from "./pages/admin/feedback/FeedbackDetailAdmin";
import EmotionalCategory from "./pages/admin/emotionalCategory/EmotionalCategory";
import TableTypeManagement from "./pages/manager/table-type-management/TableTypeManagement";
import PaymentHistoryAdmin from "./pages/admin/payment-history/PaymentHistoryAdmin";
import PaymentHistoryStaff from "./pages/staff/payment-history/PaymentHistoryStaff";
import TableManagementStaff from "./pages/staff/table-management/TableManagementStaff";
import StaffManagement from "./pages/manager/staffManager/StaffManagement";
import StaffCreation from "./pages/manager/staffManager/StaffCreation";
import StaffDetail from "./pages/manager/staffManager/StaffDetail";
import CustomerManagement from "./pages/admin/customerManagerment/CustomerManagement";
import CustomerCreation from "./pages/admin/customerManagerment/CustomerCreation";
import CustomerDetail from "./pages/admin/customerManagerment/CustomerDetail";
import BookingListStaff from "./pages/staff/table-registration/BookingListStaff";
import BarManagement from "./pages/admin/barManager/BarManagement";
import BarProfile from "./pages/admin/barManager/BarProfile";
import DrinkCategoriesAdmin from "./pages/admin/drinkCategory/DrinkCategoriesAdmin";
import DrinkDetail from "./pages/manager/ManagerDrinkBasedCate/DrinkDetail";
import ManagerDrinkBasedEmotional from "./pages/manager/ManagerDrinkBasedCate/ManagerDrinkBasedEmotion";
import AdminLayout from "./components/adminComponents/AdminLayout";
import StaffLayout from "./components/staffComponents/StaffLayout";
import AddBar from "./pages/admin/barManager/AddBar";
import AddDrink from "./pages/manager/ManagerDrinkBasedCate/AddDrink";
import BookingDetailStaff from "./pages/staff/table-registration/BookingDetailStaff";
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
import EventManagement from "./pages/manager/event-management/EventManagement";
import AddEvent from "./pages/manager/event-management/AddEvent";
import ManagerLayout from "./components/managerComponents/ManagerLayout";
import ManagerDrink from "./pages/manager/ManagerDrinkBasedCate/ManagerDrink";
import FeedbackManager from "./pages/manager/feedback/FeedbackManager";
import FeedbackDetailManager from "./pages/manager/feedback/FeedbackDetailManager";
import PaymentHistoryManager from "./pages/manager/payment-history/PaymentHistoryManager";
import BookingDetailManager from "./pages/manager/table-registration/BookingDetailManager";
import BookingListManager from "./pages/manager/table-registration/BookingListManager";
import ManagerDetail from "./pages/admin/managerManagement/ManagerDetail";
import ManagerCreation from "./pages/admin/managerManagement/ManagerCreation";
import ManagerManagement from "./pages/admin/managerManagement/ManagerManagement";
import TableManagementManager from "./pages/manager/table-management/TableManagementManager";
import ProtectedCustomerRoute from "./components/ProtectedRoute/ProtectedCustomerRoute";
import DrinkCategories from "./pages/manager/managerDrinkCate/DrinkCategories";
import EventDetail from "./pages/manager/event-management/EventDetail";
import Event from "./pages/customer/event/Event";
import EventDetailCustomer from "./pages/customer/event/EventDetailCustomer";
import BarBranch from "./pages/customer/barBranch/BarBranch";
import AboutUs from "./pages/customer/aboutUs/AboutUs";
import BookingListAdmin from "./pages/admin/table-registration/BookingListAdmin";
import BookingDetailAdmin from "./pages/admin/table-registration/BookingDetailAdmin";
import DashBoardManager from "./pages/manager/dashboard/DashBoardManager";
import { ExtraDrinkStaff } from "./pages";
import TermsAndPolicies from "./pages/customer/termsAndPolicies/TermsAndPolicies";
import ScrollToTop from "./components/commonComponents/scrollToTop/ScrollToTop";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* Route Của Admin */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/feedback" element={<FeedbackAdmin />}/> 
          <Route path="admin/feedback/detail/:feedbackId" element={<FeedbackDetailAdmin />}/> 
          <Route path="admin/customers" element={<CustomerManagement />}/> 
          <Route path="admin/customer-creation" element={<CustomerCreation />}/> 
          <Route path="admin/customer-detail/:accountId" element={<CustomerDetail />}/> 
          <Route path="admin/managers" element={<ManagerManagement />}/> 
          <Route path="admin/manager-creation" element={<ManagerCreation />}/> 
          <Route path="admin/manager-detail/:accountId" element={<ManagerDetail />}/> 
          <Route path="admin/payment-history" element={<PaymentHistoryAdmin />}/> 
          <Route path="admin/barmanager" element={<BarManagement />}/> 
          <Route path="admin/barProfile/:barId" element={<BarProfile />}/> 
          <Route path="admin/addBar" element={<AddBar />}/> 
          <Route path="admin/event-management" element={<EventManagement />}/>
          <Route path="admin/event-management/add-event" element={<AddEvent />} />
          <Route path="admin/drink-categories" element={<DrinkCategoriesAdmin />}/>
          <Route path="admin/table-registrations" element={<BookingListAdmin />}/> 
          <Route path="admin/table-registration-detail/:bookingId" element={<BookingDetailAdmin />}/> 

          {/* Emotional */}
        <Route path="admin/emotional" element={<EmotionalCategory />}/>
        </Route>
      </Route>

      {/* Route Của Manager */}
      <Route element={<ProtectedManagerRoute />}>
        <Route path="/" element={<ManagerLayout />}>
        <Route path="manager/dashboard" element={<DashBoardManager />} />
        {/* Thức uống */}
        <Route path="manager/managerDrinkCategory" element={<DrinkCategories />}/>  
        <Route path="manager/managerDrinkCategory/managerDrink/:cateId" element={<ManagerDrink />}/>
        <Route path="manager/managerDrink/DrinkDetail/:drinkId" element={<DrinkDetail />}/>
        <Route path="manager/managerDrink/addDrink" element={<AddDrink />}/>
        <Route path="manager/emotional/drinkBaseEmo" element={<ManagerDrinkBasedEmotional />}/> 
        
        {/* Feedback */}
        <Route path="manager/feedback" element={<FeedbackManager />}/> 
        <Route path="manager/feedback/detail/:feedbackId" element={<FeedbackDetailManager />}/> 

        {/* quan li Staff */}
        <Route path="manager/staff" element={<StaffManagement />}/> 
        <Route path="manager/staff-creation" element={<StaffCreation />}/> 
        <Route path="manager/staff-detail/:id" element={<StaffDetail />}/> 
        
        {/* quan li loaij bàn */}
        <Route path="manager/table-type-management" element={<TableTypeManagement />}/> 
        <Route path="manager/table-management" element={<TableManagementManager />}/> 
        
        <Route path="manager/table-registrations" element={<BookingListManager />}/> 
        <Route path="manager/table-registration-detail/:bookingId" element={<BookingDetailManager />}/> 

        {/* quan li payment history */}
        <Route path="manager/payment-history" element={<PaymentHistoryManager />}/> 

        {/* quan li event */}
        <Route path="manager/event-management" element={<EventManagement />}/> 
        <Route path="manager/event-management/add-event" element={<AddEvent />}/> 
        <Route path="manager/event-management/event-detail/:eventId" element={<EventDetail />}/>
        </Route>
      </Route>

      {/* Route Của Staff */}
      <Route element={<ProtectedStaffRoute />}>
        <Route path="/" element={<StaffLayout />}>
          <Route path="staff/table-management" element={<TableManagementStaff />}/> 
          <Route path="staff/payment-history" element={<PaymentHistoryStaff />}/> 
          <Route path="staff/table-registrations" element={<BookingListStaff />}/> 
          <Route path="staff/table-registration-detail/:bookingId" element={<BookingDetailStaff />}/> 
          <Route path="staff/extra-drinks/:bookingId" element={<ExtraDrinkStaff />}/>
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
          <Route path="drink-list" element={<DrinkList />} /> 
          <Route path="drink-detail" element={<DrinkDetailCustomer />}/> 
          <Route path="customer" element={<BookingTable />}/> 
          <Route path="payment" element={<PaymentPage />}/> 
          <Route path="payment-detail" element={<PaymentDetail />}/> 
          <Route path="event" element={<Event />}/> 
          <Route path="event/:eventId" element={<EventDetailCustomer />}/> 
          <Route path="bar-branch" element={<BarBranch />}/>

          {/* Route Trang Home */}
         <Route path="about-us" element={<AboutUs />}/>
          <Route path="terms-and-policies" element={<TermsAndPolicies />}/>

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
);
