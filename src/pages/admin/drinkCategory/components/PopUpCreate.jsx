import React, { useState } from 'react';
import { addDrinkCate } from 'src/lib/service/drinkCateService';
import { message } from 'antd';
import ClipLoader from "react-spinners/ClipLoader";

const InputField = ({ label, placeholder, value, onChange, error }) => (
  <>
    <label className="mt-3.5 text-base" htmlFor={label}>{label}</label>
    <input
      type="text"
      id={label}
      placeholder={placeholder}
      className={`self-stretch px-5 py-2.5 text-sm rounded border ${error ? 'border-red-500' : 'border-black'} max-md:pr-5 max-md:max-w-full`}
      value={value}
      onChange={onChange}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </>
);

const Button = ({ children, variant, disabled, ...props }) => (
  <button 
    disabled={disabled}
    className={`gap-2.5 self-stretch min-h-[45px] w-[100px] rounded-[64px] text-white 
    ${variant === 'primary' ? 'bg-blue-900 hover:bg-blue-800' : 'bg-neutral-500 hover:bg-neutral-600'} 
    transition-all focus:outline-none flex justify-center items-center`} 
    {...props}
  >
    {children}
  </button>
);

const PopUpCreate = ({ onClose, setLoading }) => {
  const [formData, setFormData] = useState({ categoryName: '', description: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Tên danh mục không được để trống!';
    } else if (formData.categoryName.trim().length < 7) {
      newErrors.categoryName = 'Tên thể loại đồ uống phải từ 7 đến 200 kí tự!';
    } else if (formData.categoryName.trim().length > 200) {
      newErrors.categoryName = 'Tên thể loại đồ uống phải từ 7 đến 200 kí tự!';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLoading(true);
    try {
      const response = await addDrinkCate({
        drinksCategoryName: formData.categoryName.trim(),
        description: formData.description.trim()
      });
      if (response.status === 200) {
        message.success(response.data.message || "Created Successfully");
        onClose();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response?.data?.errors?.Description) {
          setErrors({
            ...errors,
            description: error.response.data.errors.Description[0]
          });
        } else if (error.response?.data?.message) {
          setErrors({
            ...errors,
            categoryName: error.response.data.message
          });
        }
      } else {
        message.error(error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục.");
      }
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="flex flex-col items-start px-12 pt-6 pb-12 bg-white rounded-xl max-w-[530px] max-md:px-5">
        <h1 className="text-2xl text-blue-900 mb-4">Tạo danh mục đồ uống</h1>
        
        <InputField
          label="Tên danh mục"
          placeholder="Trà"
          value={formData.categoryName}
          onChange={(e) => {
            setFormData({ ...formData, categoryName: e.target.value });
            if (errors.categoryName) {
              setErrors({ ...errors, categoryName: '' });
            }
          }}
          error={errors.categoryName}
        />
        <InputField
          label="Mô tả"
          placeholder="Trà ngọt thanh"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) {
              setErrors({ ...errors, description: '' });
            }
          }}
          error={errors.description}
        />
        <div className="flex gap-5 justify-between mt-7 w-full">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : "Tạo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PopUpCreate;
