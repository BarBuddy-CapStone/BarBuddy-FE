import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Dashboard from "./pages/admin/dashboard/DashBoard";
import AdminLayout from "./components/adminComponents/AdminLayout";
import BarManagement from "./pages/admin/barManager/BarManagement";
import BarBuddyProfile from "./pages/admin/dashboard/BarProfile";
import DrinkCategories from "./pages/admin/managerDrink/ManagerDrink";
import ManagerDrink from "./pages/admin/ManagerDrinkBasedCate/ManagerDrink";
import DrinkDetail from "./pages/admin/ManagerDrinkBasedCate/DrinkDetail";
import ManagerDrinkBasedEmotional from "./pages/admin/ManagerDrinkBasedCate/ManagerDrinkBasedEmotion";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
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
