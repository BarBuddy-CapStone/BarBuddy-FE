import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-sky-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sky-900 text-lg font-semibold">Đang tải...</p>
      </div>
    </motion.div>
  );
};

export default Loading; 