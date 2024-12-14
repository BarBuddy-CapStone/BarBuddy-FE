import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { resetPassword } from "../../../lib/service/authenService";
import OtpPopup from "src/components/popupOtp/OtpPopup";
import UpdatePassword from "./UpdatePassword";

function ForgetPassword({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await resetPassword(email);
      
      if (response.data.statusCode === 200) {
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setShowOtpPopup(true);
      }
    } catch (error) {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    onClose();
    onSwitchToLogin();
  };

  const handleOtpSuccess = (token) => {
    setResetToken(token);
    setShowOtpPopup(false);
    setShowUpdatePassword(true);
  };

  if (showUpdatePassword) {
    return (
      <UpdatePassword
        email={email}
        token={resetToken}
        onClose={onClose}
        onSwitchToLogin={onSwitchToLogin}
      />
    );
  }

  return (
    <>
      {showOtpPopup ? (
        <OtpPopup
          email={email}
          onClose={() => setShowOtpPopup(false)}
          onSuccess={handleOtpSuccess}
          isForgetPassword={true}
        />
      ) : (
        <div className="relative flex flex-col px-7 py-6 w-full max-w-md rounded-xl bg-neutral-800">
          {/* Header */}
          <div className="relative w-full mb-6">
            <div className="text-2xl text-orange-400 font-bold">
              Quên mật khẩu ?
            </div>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-200"
            >
              X
            </button>
          </div>

          {/* Subtitle */}
          <div className="text-sm text-gray-400 mb-6">
            Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu
          </div>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-2">Email</div>
            <input
              type="email"
              className="px-5 py-3 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
              placeholder="nguyenvana@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleResetPassword}
            fullWidth
            variant="contained"
            disabled={loading || !email}
            sx={{
              backgroundColor: !email ? "rgba(255, 140, 0, 0.3)" : "#FF8C00",
              "&:hover": {
                backgroundColor: !email ? "rgba(255, 140, 0, 0.3)" : "#FF7000",
              },
              color: "black",
              height: "48px",
              borderRadius: "64px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "16px"
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Lấy lại mật khẩu"}
          </Button>

          {/* Login Link */}
          <div className="flex justify-center">
            <span className="text-gray-400">Bạn đã có tài khoản?</span>
            <button onClick={handleSwitchToLogin} className="ml-1 text-orange-400">
              Đăng nhập
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ForgetPassword;
