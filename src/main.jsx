import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import CustomerLayout from "./components/customerComponents/CustomerLayout";
import ProfilePage from "./pages/customer/customerProfile/CustomerProfile";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Thêm Route Trang vào */}
        <Route path="/" element={<CustomerLayout />}>
          {/* Include accountId as a URL parameter */}
          <Route path="/profile/:accountId" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
