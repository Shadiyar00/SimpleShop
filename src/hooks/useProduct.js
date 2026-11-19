import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/service';

export default function useProduct(id) {
  const valid = /^[1-9]\d*$/.test(id);
  const query = useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: ({ signal }) => getProductById(id, signal),
    enabled: valid,
  });
  const missing = query.error?.status === 404;

  return {
    product: missing ? undefined : query.data?.data,
    cached: query.data?.cached || query.isRefetchError,
    loading: valid && query.isPending,
    error: valid ? ((!query.data || missing) ? query.error?.message || '' : '') : 'Invalid product ID.',
    retry: query.refetch,
    refreshing: query.isFetching,
  };
}
