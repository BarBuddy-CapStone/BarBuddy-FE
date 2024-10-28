import React, { useState } from 'react';
import { addDrinkCate } from 'src/lib/service/drinkCateService';

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
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </>
);

const Button = ({ children, variant, ...props }) => (
  <button className={`gap-2.5 self-stretch min-h-[45px] w-[100px] rounded-[64px] text-white ${variant === 'primary' ? 'bg-blue-900' : 'bg-neutral-500'}`} {...props}>
    {children}
  </button>
);

const AddDrinkCategoryForm = ({ onClose, setLoading, refreshList }) => {
  const [formData, setFormData] = useState({ drinksCategoryName: '', description: '' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.drinksCategoryName) newErrors.drinksCategoryName = 'Tên danh mục không được để trống';
    if (!formData.description) newErrors.description = 'Mô tả không được để trống';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      const response = await addDrinkCate(formData);
      if (response.status === 200) {
        onClose();
        refreshList();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="flex flex-col items-start px-12 pt-6 pb-12 bg-white rounded-xl max-w-[530px] max-md:px-5">
        <h1 className="text-2xl text-blue-900">Tạo danh mục đồ uống</h1>
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
        <div className="flex gap-5 justify-between mt-7 w-full">
          <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="primary">Tạo</Button>
        </div>
      </form>
    </div>
  );
};

export default AddDrinkCategoryForm;
