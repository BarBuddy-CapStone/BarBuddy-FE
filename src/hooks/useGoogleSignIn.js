import { useEffect, useCallback } from 'react';

export const useGoogleSignIn = (buttonId, callback) => {
  // Tách hàm initialize ra khỏi useEffect để tránh tạo lại mỗi lần re-render
  const initializeGoogleButton = useCallback(async () => {
    if (!window.google || !document.getElementById(buttonId)) return;

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_LOGIN_API,
        callback: callback
      });

      window.google.accounts.id.renderButton(
        document.getElementById(buttonId),
        {
          theme: "filled_black",
          size: "large",
          width: "100%",
          text: buttonId.includes('login') ? "signin_with" : "signup_with",
          shape: "pill",
        }
      );
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  }, [buttonId, callback]);

  useEffect(() => {
    let isSubscribed = true;

    const loadGoogleScript = () => {
      return new Promise((resolve) => {
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    const initialize = async () => {
      await loadGoogleScript();
      if (isSubscribed) {
        // Thêm một small delay để đảm bảo DOM đã được render
        setTimeout(() => {
          if (isSubscribed) {
            initializeGoogleButton();
          }
        }, 100);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      isSubscribed = false;
      // Chỉ xóa button khi component thực sự unmount
      const oldButton = document.querySelector(`#${buttonId} div[role="button"]`);
      if (oldButton) {
        oldButton.remove();
      }
    };
  }, [buttonId, initializeGoogleButton]); // Chỉ phụ thuộc vào buttonId và initializeGoogleButton
}; 