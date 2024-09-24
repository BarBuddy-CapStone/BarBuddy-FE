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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/feedback" element={<Feedback />}></Route>
          <Route path="/feedbackdetail" element={<FeedbackDetail />}></Route>
          <Route path="/emotional" element={<EmotionalCategory />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
