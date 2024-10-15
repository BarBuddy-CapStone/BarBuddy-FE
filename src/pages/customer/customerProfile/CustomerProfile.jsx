import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PersonalInfo from "./PersonalInfoComponent";
import BookingHistory from "./RecentBookingComponent";
import CircularProgress from '@mui/material/CircularProgress';

function ProfilePage() {
  const { accountId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress style={{ color: '#FFBF00' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-8">
      <PersonalInfo accountId={accountId} />
      <BookingHistory accountId={accountId} />
    </div>
  );
}

export default ProfilePage;
