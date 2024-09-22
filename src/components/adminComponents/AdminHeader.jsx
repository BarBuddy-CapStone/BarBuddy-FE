import React from 'react';

const AdminHeader = ({ className }) => {
  return (
    <header className={`flex justify-between items-center p-4 ${className}`}>
      <h1 className="text-2xl font-bold text-sky-900">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button aria-label="Notifications" className="p-1">
          <img src="http://b.io/ext_23-" alt="" className="w-6 h-6" />
        </button>
        <button aria-label="User Profile" className="p-1">
          <img src="http://b.io/ext_24-" alt="" className="w-10 h-10 rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;