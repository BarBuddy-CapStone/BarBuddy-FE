import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material"; // Import MUI Button, CircularProgress, and Alert
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { resetPassword } from "../../../lib/service/authenService";

function ForgetPassword({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý gửi yêu cầu reset password
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
        toast.success("Vui lòng kiểm tra email để lấy lại mật khẩu!");
        handleSwitchToLogin(); // Sử dụng hàm mới
      }
    } catch (error) {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm mới để xử lý chuyển đổi
  const handleSwitchToLogin = () => {
    onClose(); // Đóng ForgetPassword trước
    onSwitchToLogin(); // Sau đó mở Login
  };

  return (
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

      {/* Back to Login - Cập nhật onClick */}
      <div className="text-center">
        <button
          onClick={handleSwitchToLogin}
          className="text-orange-400 hover:text-orange-500 text-sm"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}

export default ForgetPassword;
