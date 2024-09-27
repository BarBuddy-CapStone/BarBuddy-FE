import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useLocation } from "react-router-dom";
import { headerConstants } from "src/lib";
const getTitlePath = (pathName) => {
  switch (pathName) {
    case "/admin/dashboard":
      return headerConstants.dasboard;

    case "/admin/barmanager":
      return headerConstants.managerBarBranch;
    case "/admin/addbar":
      return headerConstants.managerBarBranch;
    case "/admin/barProfile":
      return headerConstants.managerBarBranch;

    case "/admin/table-type-management":
      return headerConstants.tableType;

    case "/admin/customers":
      return headerConstants.customer;
    case "/admin/customer-creation":
      return headerConstants.customer;
    case "/admin/customer-detail":
      return headerConstants.customer;

    case "/admin/staff":
      return headerConstants.staff;
    case "/admin/staff-creation":
      return headerConstants.staff;
    case "/admin/staff-detail":
      return headerConstants.staff;

    case "/admin/emotional":
      return headerConstants.emotional;

    case "/admin/managerDrinkCategory":
      return headerConstants.drink;

    case "/admin/feedback":
      return headerConstants.feedback;

    case "/admin/feedbackdetail":
      return headerConstants.feedback;

    default:
      return "Admin";
  }
};
const AdminHeader = ({ className }) => {
  const location = useLocation();
  const title = getTitlePath(location.pathname);

  return (
    <header className={`flex justify-between items-center p-4 ${className}`}>
      <h1 className="text-2xl font-bold text-sky-900">{title}</h1>
      <div className="flex items-center space-x-4">
        <button aria-label="Notifications" className="p-1">
          <NotificationsNoneIcon fontSize="large" />
        </button>
        <button aria-label="User Profile" className="p-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee42c39217971cc8672566b2d83730278f98f741e79a31ff46c5a171ac28ebac?placeholderIfAbsent=true&apiKey=4feecec204b34295838b9ecac0a1a4f6"
            alt=""
            className="w-8 h-8 rounded-full"
          />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
