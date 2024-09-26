import React from 'react';

const AdminHeader = ({ className, text }) => {
  return (
    <header className={`flex justify-between items-center p-4 ${className}`}>
      <h1 className="text-2xl font-bold text-sky-900">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button aria-label="Notifications" className="p-1">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c34835f58c1179a603170a4818c15626bcd875bc8fda99919b8ec07d2fa1753a?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-6 h-6" />
        </button>
        <button aria-label="User Profile" className="p-1">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8e19980153730dfe9760688834a12cb497b5d07d1a906fdcbc4c2084f9e6116f?placeholderIfAbsent=true&apiKey=51ebf0c031414fe7a365d6657293527e" alt="" className="w-10 h-10 rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;