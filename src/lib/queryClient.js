import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({ defaultOptions: { queries: {
 staleTime: 5 * 60 * 1000,
 gcTime: 30 * 60 * 1000,
 networkMode: 'always',
 refetchOnReconnect: 'always',
 retry: false,
} } });
export const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: ['products'] });
