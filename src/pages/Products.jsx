import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import CachedDataNotice from '../components/CachedDataNotice';
import { useProducts } from '../hooks/useReduxProducts';
import { PAGE_SIZE, selectCatalogPage, selectCategories } from '../features/catalog';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { products, cached, loading, error, refreshing, refresh } = useProducts();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const [draft, setDraft] = useState(null);
  const locationKey = params.toString();
  const inputSearch = draft?.locationKey === locationKey ? draft.value : search;
  const category = params.get('category') || 'all';
  const stock = params.get('stock') || 'all';
  const sort = params.get('sort') || 'default';
  const requestedPage = Number(params.get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const categories = useSelector(selectCategories);
  const { count, totalPages, currentPage, visible } = useSelector(
    (state) => selectCatalogPage(state, search, category, stock, sort, page),
  );

  useEffect(() => {
    if (inputSearch === search) return;
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(locationKey);
      if (inputSearch) next.set('search', inputSearch);
      else next.delete('search');
      next.delete('page');
      setParams(next, { replace: true });
      setDraft(null);
    }, 300);
    return () => clearTimeout(timeout);
  }, [inputSearch, locationKey, search, setParams]);

  function updateParam(name, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'default') next.delete(name);
    else next.set(name, value);
    if (inputSearch !== search) {
      if (inputSearch) next.set('search', inputSearch);
      else next.delete('search');
      next.delete('page');
      setDraft(null);
    }
    if (name !== 'page') next.delete('page');
    setParams(next);
  }

  return (
    <>
      <div className="page-header"><span className="eyebrow">THE CATALOG</span><h1>Explore Products</h1><p>Search, filter and sort products using the controls below.</p></div>
      <div className="filters">
        <label>Search<input type="search" value={inputSearch} onChange={(e) => setDraft({ locationKey, value: e.target.value })} placeholder="Search products..." /></label>
        <label>Category<select value={category} onChange={(e) => updateParam('category', e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label>Availability<select value={stock} onChange={(e) => updateParam('stock', e.target.value)}><option value="all">All products</option><option value="yes">In stock</option><option value="no">Out of stock</option></select></label>
        <label>Sort<select value={sort} onChange={(e) => updateParam('sort', e.target.value)}><option value="default">Default</option><option value="cheap">Price: low to high</option><option value="expensive">Price: high to low</option><option value="rating">Highest rating</option></select></label>
      </div>
      <button className="button button-outline" disabled={refreshing} onClick={() => refresh()}>{refreshing ? 'Refreshing...' : 'Refresh products'}</button>
    {loading && <p className="message">Loading products...</p>}
      {error && <p className="message error" role="alert">{error}</p>}
      <CachedDataNotice cached={cached} hasData={products.length > 0} />
      {!loading && !error && <>
        <p className="count">{count} products found</p>
        {visible.length ? <div className="grid">{visible.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <div className="message">No products found. Try other filters.</div>}
        {count > PAGE_SIZE && <div className="pagination"><button disabled={currentPage === 1} onClick={() => updateParam('page', String(currentPage - 1))}>Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => updateParam('page', String(currentPage + 1))}>Next</button></div>}
      </>}
    </>
  );
}
