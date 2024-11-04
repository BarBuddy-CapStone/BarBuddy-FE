import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedCustomerRoute = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = () => {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.accessToken) {
        setUserRole("GUEST");
        return;
      }

      try {
        const decodedToken = jwtDecode(userInfo.accessToken);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setUserRole("GUEST");
      }
    };

    checkUserRole();
  }, []);

  if (userRole === null) {
    return <div>Đang tải...</div>;
  }

  if (userRole === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === "STAFF") {
    return <Navigate to="/staff/table-management" replace />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedCustomerRoute;
