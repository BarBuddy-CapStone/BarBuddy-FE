import React, { useState, useEffect } from 'react';
import { updDrinkCate } from 'src/lib/service/drinkCateService';

const InputField = ({ label, placeholder, isTextarea = false, value, onChange, error }) => {
  const inputClasses = "self-stretch px-5 py-2.5 text-sm whitespace-nowrap rounded border " + (error ? 'border-red-500' : 'border-black') + " border-solid max-md:pr-5 max-md:max-w-full";
  const textareaClasses = "self-stretch px-5 pt-2.5 pb-3 mt-1.5 mb-1.5 text-sm rounded border " + (error ? 'border-red-500' : 'border-black') + " border-solid max-md:pr-5 max-md:mr-1 max-md:max-w-full";

  return (
    <>
      <label className="mt-3.5 text-base" htmlFor={label}>
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={label}
          placeholder={placeholder}
          className={textareaClasses}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          id={label}
          placeholder={placeholder}
          className={inputClasses}
          value={value}
          onChange={onChange}
        />
      )}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  );
};

const Button = ({ children, type, variant, onClick }) => {
  const baseClasses = "gap-2.5 self-stretch min-h-[45px] w-[100px] rounded-[64px] text-white";
  const variantClasses = {
    primary: "bg-blue-900",
    secondary: "bg-neutral-500"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const UpdDrinkCategoryForm = ({ onClose, data, setLoading }) => {
  const [formData, setFormData] = useState({
    drinksCategoryName: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      drinksCategoryName: data.drinksCategoryName,
      description: data.description
    });
  }, [data]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.drinksCategoryName.trim()) {
      newErrors.drinksCategoryName = 'Tên danh mục không được để trống';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateHandleClick = async () => {
    if (!validateForm()) return;

    setLoading(true);
    onClose();
    try {
      const response = await updDrinkCate(data.drinksCategoryId, formData);
      if (response.status === 200) {
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form className="flex flex-col items-start px-12 pt-6 pb-12 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
        <h1 className="text-2xl text-blue-900">Chỉnh sửa danh mục đồ uống</h1>
        <InputField
          label="Tên danh mục"
          placeholder="Trà"
          value={formData.drinksCategoryName}
          onChange={(e) => setFormData({ ...formData, drinksCategoryName: e.target.value })}
          error={errors.drinksCategoryName}
        />
        <InputField
          label="Mô tả"
          placeholder="Trà ngọt thanh"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
        />
        <div className="flex gap-5 justify-between mt-7 w-full text-lg leading-none whitespace-nowrap max-md:mt-10">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={updateHandleClick} type="button" variant="primary">
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdDrinkCategoryForm;
