import { useSearchParams } from 'react-router-dom';
import CachedDataNotice from '../components/CachedDataNotice';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const PAGE_SIZE = 12;

export default function Products() {
  const { products, cached, loading, error, refreshing, refresh } = useProducts();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || 'all';
  const stock = params.get('stock') || 'all';
  const sort = params.get('sort') || 'default';
  const requestedPage = Number(params.get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  function updateParam(name, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'default') next.delete(name);
    else next.set(name, value);
    if (name !== 'page') next.delete('page');
    setParams(next);
  }

  const categories = [...new Set(products.map((p) => p.category))].sort();
  let result = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'all' || p.category === category) &&
    (stock === 'all' || (stock === 'yes' ? p.stock > 0 : p.stock === 0))
  );

  if (sort === 'cheap') result = [...result].sort((a, b) => a.price - b.price);
  if (sort === 'expensive') result = [...result].sort((a, b) => b.price - a.price);
  if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

  const totalPages = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = result.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="page-header"><span className="eyebrow">THE CATALOG</span><h1>Explore Products</h1><p>Search, filter and sort products using the controls below.</p></div>
      <div className="filters">
        <label>Search<input type="search" value={search} onChange={(e) => updateParam('search', e.target.value)} placeholder="Search products..." /></label>
        <label>Category<select value={category} onChange={(e) => updateParam('category', e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label>Availability<select value={stock} onChange={(e) => updateParam('stock', e.target.value)}><option value="all">All products</option><option value="yes">In stock</option><option value="no">Out of stock</option></select></label>
        <label>Sort<select value={sort} onChange={(e) => updateParam('sort', e.target.value)}><option value="default">Default</option><option value="cheap">Price: low to high</option><option value="expensive">Price: high to low</option><option value="rating">Highest rating</option></select></label>
      </div>
      <button className="button button-outline" disabled={refreshing} onClick={() => refresh()}>{refreshing ? 'Refreshing...' : 'Refresh products'}</button>
    {loading && <p className="message">Loading products...</p>}
      {error && <p className="message error" role="alert">{error}</p>}
      <CachedDataNotice cached={cached} hasData={products.length > 0} />
      {!loading && !error && <>
        <p className="count">{result.length} products found</p>
        {visible.length ? <div className="grid">{visible.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="message">No products found. Try other filters.</div>}
        {result.length > PAGE_SIZE && <div className="pagination"><button disabled={currentPage === 1} onClick={() => updateParam('page', String(currentPage - 1))}>Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => updateParam('page', String(currentPage + 1))}>Next</button></div>}
      </>}
    </>
  );
}
