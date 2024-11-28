import { useEffect } from 'react';

const usePreventScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      // Lưu lại vị trí scroll hiện tại
      const scrollPosition = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      // Khôi phục lại scroll
      const scrollPosition = document.body.style.top;
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
    };
  }, [isOpen]);
};

export default usePreventScroll; 