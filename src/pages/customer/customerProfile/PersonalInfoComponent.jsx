import React, { useState, useEffect, useRef } from "react";
import AccountService from "../../../lib/service/accountService";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

function PersonalInfo({ accountId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    image: "",
  });
  const [initialData, setInitialData] = useState({}); // Lưu trữ dữ liệu ban đầu
  const [uploading, setUploading] = useState(false); // Trạng thái uploading cho ảnh
  const fileInputRef = useRef(null); // Tham chiếu đến input file
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // Store validation errors

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const data = await AccountService.getCustomerProfile(accountId);
        setFormData({
          fullName: data.fullname,
          birthDate: data.dob.split("T")[0],
          phoneNumber: data.phone,
          email: data.email,
          image: data.image,
        });
        setInitialData({
          fullName: data.fullname,
          birthDate: data.dob.split("T")[0],
          phoneNumber: data.phone,
          email: data.email,
          image: data.image,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccountDetails();
    }
  }, [accountId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async () => {
    setValidationErrors({}); // Reset errors
    try {
      const data = {
        fullname: formData.fullName,
        phone: formData.phoneNumber,
        dob: formData.birthDate,
      };
      await AccountService.updateCustomerProfile(accountId, data);
      setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa khi thành công

      // Cập nhật lại dữ liệu ban đầu sau khi lưu thành công
      setInitialData(formData);

      toast.success("Cập nhật thông tin thành công!", {
        position: "top-right",
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    // Khôi phục lại dữ liệu ban đầu
    setFormData(initialData);
    setIsEditing(false);
    setValidationErrors({});
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true); // Bắt đầu hiệu ứng loading
      const formData = new FormData();
      formData.append("Image", file); // Gửi file với tên 'Image'

      try {
        const response = await AccountService.updateCustomerAvatar(
          accountId,
          formData
        );
        // Cập nhật URL avatar mới từ response.data.url
        setFormData((prevData) => ({
          ...prevData,
          image: response.url, // Cập nhật URL ảnh từ response
        }));
        toast.success("Cập nhật ảnh đại diện thành công!", {
          position: "top-right",
        });
      } catch (err) {
        toast.error("Cập nhật ảnh đại diện thất bại!", {
          position: "top-right",
        });
      } finally {
        setUploading(false); // Kết thúc hiệu ứng loading
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <CircularProgress style={{ color: '#FFBF00' }} />
      </div>
    );
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <section className="flex flex-col px-8 py-8 mx-auto w-full rounded-md bg-neutral-800 shadow-md max-md:px-5 max-md:mt-10 max-md:max-w-full mr-6">
      <div className="flex gap-2.5 self-start ml-3 text-xl leading-snug text-amber-400 max-md:ml-2.5">
        <h2 className="basis-auto">Thông tin cá nhân</h2>
      </div>
      <div className="border-t border-amber-500 mb-6 mt-8" />

      <div className="relative flex justify-center">
        <div className="w-24 h-24 mt-10 rounded-full border-2 border-gray-400 flex justify-center items-center bg-gray-700 relative">
          {uploading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-black rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <img
              loading="lazy"
              src={
                formData.image === "default"
                  ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  : formData.image
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>

        <button
          className="absolute bottom-0 right-[calc(50%-55px)] bg-black rounded-full p-1 cursor-pointer z-20"
          onClick={handleUploadClick}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b4cf405e0223430868a267a2513536632f6e4c762f7c8400a0a3ff97fb9fbe5?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e"
            alt="Camera icon"
            className="w-6 aspect-square"
          />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <form className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs text-gray-400 mb-1"
          >
            Họ và tên
          </label>
          <input
            id="fullName"
            type="text"
            className={`w-full px-4 py-3 bg-neutral-700 border border-gray-700 rounded-md text-gray-200 text-sm ${
              isEditing ? "" : "cursor-not-allowed"
            }`}
            value={formData.fullName}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          {validationErrors.Fullname && (
            <p className="text-red-500 text-sm">
              {validationErrors.Fullname.join(", ")}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="birthDate"
            className="block text-xs text-gray-400 mb-1"
          >
            Ngày sinh
          </label>
          <input
            id="birthDate"
            type="date"
            className={`w-full px-4 py-3 bg-neutral-700 border border-gray-700 rounded-md text-gray-200 text-sm ${
              isEditing ? "" : "cursor-not-allowed"
            }`}
            value={formData.birthDate}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          {validationErrors.Dob && (
            <p className="text-red-500 text-sm">
              {validationErrors.Dob.join(", ")}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs text-gray-400 mb-1"
          >
            Số điện thoại
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className={`w-full px-4 py-3 bg-neutral-700 border border-gray-700 rounded-md text-gray-200 text-sm ${
              isEditing ? "" : "cursor-not-allowed"
            }`}
            value={formData.phoneNumber}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          {validationErrors.Phone && (
            <p className="text-red-500 text-sm">
              {validationErrors.Phone.join(", ")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-gray-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-3 bg-neutral-700 border border-gray-700 rounded-md text-gray-200 text-sm ${
              isEditing ? "" : "cursor-not-allowed"
            }`}
            value={formData.email}
            readOnly
          />
        </div>
      </form>

      <div className="border-t border-amber-500 mt-16 mb-2" />

      {isEditing ? (
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-amber-400 text-black rounded-full hover:bg-amber-500"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      ) : (
        <button
          className="mt-6 px-4 py-2 bg-amber-400 text-black rounded-full self-end hover:bg-amber-500"
          onClick={() => setIsEditing(true)}
        >
          Chỉnh sửa thông tin
        </button>
      )}
    </section>
  );
}

export default PersonalInfo;
