import { useOrders as useOrderContext } from '../Contexts/OrderContext';

export const useOrders = () => {
  return useOrderContext();
};

export default useOrders;
