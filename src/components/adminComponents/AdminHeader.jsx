import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useLocation } from "react-router-dom";
import headerTitle from "src/lib";
const getTitlePath = (pathName) => {
  switch (pathName) {
    case "/dashboard":
      return headerTitle.dasboard;

    case "/barmanager":
      return headerTitle.managerBarBranch;

    case "/admin/table-type-management":
      return headerTitle.tableType;

    case "/customers":
      return headerTitle.customer;

    case "/staff":
      return headerTitle.staff;

    case "/emotional":
      return headerTitle.emotional;

    case "/managerDrink":
      return headerTitle.drink;

    case "/feedback":
      return headerTitle.feedback;

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
