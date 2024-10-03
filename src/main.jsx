import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import CustomerLayout from "./components/customerComponents/CustomerLayout";
import ProfilePage from "./pages/customer/customerProfile/CustomerProfile";
import BookingHistory from "./pages/customer/bookingHistory/CustomerBookingHistory";
import BookingDetailPage from "./pages/customer/bookingDetail/BookingDetail"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Thêm Route Trang vào */}
        <Route path="/" element={<CustomerLayout />}>
          {/* Include accountId as a URL parameter */}
          <Route path="/profile/:accountId" element={<ProfilePage />} />
          <Route path="/booking-history/:accountId" element={<BookingHistory />} />
          <Route path="/booking-detail/:bookingId" element={<BookingDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
