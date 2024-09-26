import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
const AdminHeader = ({ className }) => {
  return (
    <header className={`flex justify-between items-center p-4 ${className}`}>
      <h1 className="text-2xl font-bold text-sky-900">Dashboard</h1>
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