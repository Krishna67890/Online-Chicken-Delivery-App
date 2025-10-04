import { useCallback } from 'react';

const useNotification = () => {
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const showNotification = useCallback(async (title, options = {}) => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const hasPermission = await requestPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return false;
    }

    const notification = new Notification(title, {
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  }, [requestPermission]);

  return {
    showNotification,
    requestPermission,
    isSupported: 'Notification' in window,
    permission: Notification?.permission,
  };
};

export default useNotification;