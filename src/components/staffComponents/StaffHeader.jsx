import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useParams } from "react-router-dom";
import { headerConstants } from "src/lib";

const getTitlePath = (pathName, params) => {
  // Tách đường dẫn thành các phần
  const pathParts = pathName.split('/').filter(Boolean);

  switch (pathParts[1]) {
    case "table-management":
      if (pathParts[2] === "table" && params.tableTypeId) {
        return `${headerConstants.headerStaff.table}`;
      }
      return headerConstants.headerStaff.table;

    case "table-registrations":
      return headerConstants.headerStaff.table_booking_list;

    case "payment-history":
      return headerConstants.headerStaff.payment_history;

    case "table-registration-detail":
      if (params.bookingId) {
        return `${headerConstants.headerStaff.table_booking_detail}`;
      }
      return headerConstants.headerStaff.table_booking_list;

    default:
      return "Staff";
  }
};

const StaffHeader = ({ className, onMenuClick, isSidebarOpen }) => {
  const location = useLocation();
  const params = useParams();
  const title = getTitlePath(location.pathname, params);

  return (
    <header className={`flex justify-between items-center p-4 ${className}`}>
      <div className="flex items-center">
        <button 
          className="mr-4 md:hidden" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <h1 className="text-2xl font-bold text-sky-900 px-2">{title}</h1>
      </div>
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

export default StaffHeader;
