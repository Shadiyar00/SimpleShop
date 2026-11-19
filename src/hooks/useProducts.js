import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/service';
import { invalidateProducts } from '../lib/queryClient';
export default function useProducts() {
 const query = useQuery({ queryKey: ['products', 'list'], queryFn: ({ signal }) => getProducts(signal) });
 return {
   products: query.data?.data ?? [],
   cached: query.data?.cached || query.isRefetchError,
   loading: query.isPending,
   error: query.data ? '' : query.error?.message || '',
   refreshing: query.isFetching,
   refresh: invalidateProducts,
 };
}
