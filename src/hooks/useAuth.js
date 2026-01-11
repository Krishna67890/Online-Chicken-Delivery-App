import { useAuth as useAuthContext } from '../Contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
