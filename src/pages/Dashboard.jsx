import { useState } from 'react';
import { Link } from 'react-router-dom';
import CachedDataNotice from '../components/CachedDataNotice';
import useProducts from '../hooks/useProducts';

export default function Dashboard() {
  const { products, cached, loading, error, refreshing, refresh } = useProducts();
  const [category, setCategory] = useState('all');
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const filtered = category === 'all' ? products : products.filter((p) => p.category === category);
  const total = filtered.length;
  const average = total ? filtered.reduce((sum, p) => sum + p.price, 0) / total : 0;
  const topRated = total ? filtered.reduce((best, p) => p.rating > best.rating ? p : best) : null;
  const stockCount = filtered.filter((p) => p.stock > 0).length;

  // Breakdown 1: products in each category.
  const categoryCounts = {};
  filtered.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });
  // Breakdown 2: stock status.
  const stockBreakdown = { 'In stock': stockCount, 'Out of stock': total - stockCount };

  return <>
    <div className="page-header"><span className="eyebrow">OVERVIEW</span><h1>Product Dashboard</h1><p>All numbers come from the products API.</p></div>
    <button className="button button-outline" disabled={refreshing} onClick={() => refresh()}>{refreshing ? 'Refreshing...' : 'Refresh products'}</button>
    {loading && <p className="message">Loading statistics...</p>}
    {error && <p className="message error" role="alert">{error}</p>}
      <CachedDataNotice cached={cached} hasData={products.length > 0} />
    {!loading && !error && <>
      <div className="dashboard-filter"><label>Filter statistics by category <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label></div>
      <div className="stats">
        <div><span>Total products</span><strong>{total}</strong></div>
        <div><span>Average price</span><strong>${average.toFixed(2)}</strong></div>
        <div><span>In stock</span><strong>{stockCount}</strong></div>
        <div><span>Highest rating</span><strong>{topRated ? topRated.rating : '—'}</strong></div>
      </div>
      <div className="breakdowns">
        <section className="panel"><h2>Products by category</h2>{Object.entries(categoryCounts).map(([name, count]) => <div className="bar-row" key={name}><span>{name} ({count})</span><div className="bar-track"><div style={{ width: `${total ? count / total * 100 : 0}%` }} /></div></div>)}</section>
        <section className="panel"><h2>Availability</h2>{Object.entries(stockBreakdown).map(([name, count]) => <div className="bar-row" key={name}><span>{name} ({count})</span><div className="bar-track"><div style={{ width: `${total ? count / total * 100 : 0}%` }} /></div></div>)}<p className="dashboard-link"><Link to="/products">Explore all products</Link></p>{topRated && <p className="dashboard-link"><Link to={`/products/${topRated.id}`}>See top-rated product</Link></p>}</section>
      </div>
    </>}
  </>;
}