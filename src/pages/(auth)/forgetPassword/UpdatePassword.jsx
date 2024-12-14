import React, { useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { toast } from "react-toastify";
import { updatePassword } from "../../../lib/service/authenService";

function UpdatePassword({ onClose, onSwitchToLogin, email, token }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        email: email,
        uniqueCode: token,
        password: password,
        confirmPassword: confirmPassword
      };

      console.log(data);
      

      const response = await updatePassword(data);
      
      if (response.data.statusCode === 200 && response.data.data === true) {
        toast.success("Cập nhật mật khẩu thành công!");
        handleSwitchToLogin();
      } else {
        setError("Không thể cập nhật mật khẩu. Vui lòng thử lại!");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    onClose();
    onSwitchToLogin();
  };

  return (
    <div className="relative flex flex-col px-7 py-6 w-full max-w-md rounded-xl bg-neutral-800">
      {/* Header */}
      <div className="relative w-full mb-6">
        <div className="text-2xl text-orange-400 font-bold">
          Cập nhật mật khẩu mới
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-200"
        >
          X
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      {/* Password Input */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Mật khẩu mới</div>
        <input
          type="password"
          className="px-5 py-3 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mb-6">
        <div className="text-xs text-gray-400 mb-2">Xác nhận mật khẩu mới</div>
        <input
          type="password"
          className="px-5 py-3 rounded border border-gray-200 text-gray-200 bg-zinc-900 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleUpdatePassword}
        fullWidth
        variant="contained"
        disabled={loading || !password || !confirmPassword}
        sx={{
          backgroundColor: !password || !confirmPassword ? "rgba(255, 140, 0, 0.3)" : "#FF8C00",
          "&:hover": {
            backgroundColor: !password || !confirmPassword ? "rgba(255, 140, 0, 0.3)" : "#FF7000",
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
        {loading ? <CircularProgress size={24} /> : "Cập nhật mật khẩu"}
      </Button>
    </div>
  );
}

export default UpdatePassword;