import React, { useState } from 'react';

const InputField = ({ label, placeholder, isTextarea = false, value, onChange }) => {
  const inputClasses = "self-stretch px-5 py-2.5 text-sm whitespace-nowrap rounded border border-black border-solid max-md:pr-5 max-md:max-w-full";
  const textareaClasses = "self-stretch px-5 pt-2.5 pb-3 mt-1.5 mb-1.5 text-sm rounded border border-black border-solid max-md:pr-5 max-md:mr-1 max-md:max-w-full";

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
    </>
  );
};

const Button = ({ children, type, variant, onClick }) => {
  const baseClasses = "gap-2.5 self-stretch min-h-[56px] w-[100px] rounded-[64px] text-white";
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

const UpdDrinkCategoryForm = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleSubmit} className="flex flex-col items-start px-12 pt-10 pb-20 text-black bg-white rounded-xl max-w-[530px] max-md:px-5">
        <h1 className="text-2xl text-blue-900">Chỉnh sửa danh mục đồ uống</h1>
        <InputField
          label="Tên danh mục"
          placeholder="Trà"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <InputField
          label="Mô tả"
          placeholder="Trà ngọt thanh"
          isTextarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-5 justify-between mt-14 w-full text-xl leading-none whitespace-nowrap max-md:mt-10">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdDrinkCategoryForm