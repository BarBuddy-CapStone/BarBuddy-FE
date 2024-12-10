import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PersonalInfo from "./PersonalInfoComponent";
import BookingHistory from "./RecentBookingComponent";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { toast } from "react-toastify";
import AccountService from "../../../lib/service/accountService";

function ProfilePage() {
  const { accountId } = useParams();
  const location = useLocation();
  const returnPath = location.state?.returnPath;
  const returnState = location.state?.returnState;
  const [loading, setLoading] = useState(true);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const response = await AccountService.getCustomerProfile(accountId);
        setCustomerData(response.data);
        
        // Kiểm tra số điện thoại từ dữ liệu API
        if (!response.data.phone) {
          setShowPhoneWarning(true);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchCustomerProfile();
    }
  }, [accountId]);

  const handleUpdateSuccess = (message, data) => {
    setTimeout(() => {
      toast.success(message || "Cập nhật thông tin thành công!", {
        position: "top-right",
        autoClose: 2000
      });
      
      // Cập nhật lại customerData khi có thay đổi
      setCustomerData(data);
      // Nếu đã thêm số điện thoại, đóng warning popup
      if (data.phone) {
        setShowPhoneWarning(false);
      }
    }, 100);
  };

  const handleCloseWarning = () => {
    setShowPhoneWarning(false);
  };

  const handleNavigateToProfile = () => {
    setShowPhoneWarning(false);
    navigate(`/profile/${accountId}`, { 
      state: { 
        showPhoneUpdate: true,
        returnPath,
        returnState 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress style={{ color: '#FFBF00' }} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 px-8">
        <PersonalInfo 
          accountId={accountId} 
          onUpdateSuccess={handleUpdateSuccess}
          customerData={customerData} 
        />
        <BookingHistory accountId={accountId} />
      </div>

      {/* Phone Warning Dialog */}
      <Dialog
        open={showPhoneWarning}
        onClose={handleCloseWarning}
        PaperProps={{
          style: {
            backgroundColor: '#262626',
            borderRadius: '12px',
            border: '1px solid #404040',
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        <div className="p-6">
          <div className="flex flex-col items-center mb-4">
            <WarningAmberIcon className="text-amber-400 mb-2" sx={{ fontSize: 40 }} />
            <DialogTitle className="text-amber-400 font-medium text-center p-0">
              Thông báo bổ sung thông tin
            </DialogTitle>
          </div>
          
          <DialogContent className="text-gray-300 text-center p-0 mb-6">
            Vui lòng cập nhật số điện thoại của bạn để có thể sử dụng đầy đủ các tính năng của BarBuddy.
          </DialogContent>

          <DialogActions className="p-0 flex justify-center gap-3">
            <Button
              onClick={handleCloseWarning}
              className="px-5 py-2 bg-neutral-700 text-gray-300 rounded-full hover:bg-neutral-600 transition duration-200 min-w-[100px] text-sm font-medium normal-case"
            >
              Để sau
            </Button>
            <Button
              onClick={handleNavigateToProfile}
              className="px-5 py-2 bg-amber-400 text-neutral-900 rounded-full hover:bg-amber-500 transition duration-200 min-w-[100px] text-sm font-medium normal-case"
            >
              Cập nhật ngay
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}

export default ProfilePage;