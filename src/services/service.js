// All API requests are in this file.
const API = 'https://dummyjson.com/products';

async function request(url, signal) {
  const response = await fetch(url, { signal, credentials: 'omit' });
  if (!response.ok) {
    const message = response.status === 404 ? 'Product not found.'
      : response.status === 503 ? 'No saved data is available for this request. Reconnect and try again.'
      : 'Could not load products.';
    throw Object.assign(new Error(message), { status: response.status });
  }
  const data = await response.json();
  return { data, cached: response.headers.get('X-SimpleShop-Source') === 'offline-cache' };
}

export async function getProducts(signal) {
  // limit=0 requests the full available products dataset.
  const result = await request(`${API}?limit=0`, signal);
  return { ...result, data: result.data.products };
}

export async function getProductById(id, signal) {
  return request(`${API}/${id}`, signal);
}
