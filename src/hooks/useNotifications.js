import { useNotifications as useNotificationContext } from '../Contexts/NotificationContext';

export const useNotifications = () => {
  return useNotificationContext();
};

export default useNotifications;
