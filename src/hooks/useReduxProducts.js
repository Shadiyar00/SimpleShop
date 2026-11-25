import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCatalog, selectCatalog } from '../features/catalog.js';
import { fetchDetails, selectDetails, validProductId } from '../features/details.js';

export function useProducts() {
  const dispatch = useDispatch();
  const { products, receivedAt, cached, requestId, error } = useSelector(selectCatalog);

  useEffect(() => {
    dispatch(fetchCatalog());
    const reconnect = () => dispatch(fetchCatalog(true));
    window.addEventListener('online', reconnect);
    window.addEventListener('simpleshop:worker-ready', reconnect);
    return () => {
      window.removeEventListener('online', reconnect);
      window.removeEventListener('simpleshop:worker-ready', reconnect);
    };
  }, [dispatch]);

  return {
    products,
    cached: cached || Boolean(receivedAt && error),
    loading: !receivedAt && (!error || Boolean(requestId)),
    error: receivedAt ? '' : error,
    refreshing: Boolean(requestId),
    refresh: () => dispatch(fetchCatalog(true)),
  };
}

export function useProduct(id) {
  const dispatch = useDispatch();
  const valid = validProductId(id);
  const { product, error, cached, requestId } = useSelector((state) => selectDetails(state, id));

  useEffect(() => {
    if (!valid) return;
    dispatch(fetchDetails({ id }));
    const reconnect = () => dispatch(fetchDetails({ id, force: true }));
    window.addEventListener('online', reconnect);
    window.addEventListener('simpleshop:worker-ready', reconnect);
    return () => {
      window.removeEventListener('online', reconnect);
      window.removeEventListener('simpleshop:worker-ready', reconnect);
    };
  }, [dispatch, id, valid]);

  return {
    product,
    cached: cached || Boolean(product && error),
    loading: valid && !product && (!error || Boolean(requestId)),
    error: valid ? (product || requestId ? '' : error) : 'Invalid product ID.',
    refreshing: Boolean(requestId),
    retry: () => dispatch(fetchDetails({ id, force: true })),
  };
}
