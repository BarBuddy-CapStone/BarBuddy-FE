import { useParams } from "react-router-dom";
import PersonalInfo from "./PersonalInfoComponent";
import { ToastContainer } from "react-toastify"; // For showing notifications
import BookingHistory from "./RecentBookingComponent";
function ProfilePage() {
  const { accountId } = useParams(); // Extract accountId from URL

  return (
    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-8">
      <PersonalInfo accountId={accountId} />
      <BookingHistory accountId={accountId} />
    </div>
  );
}

export default ProfilePage;
