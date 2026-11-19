import CachedDataNotice from '../components/CachedDataNotice';
import useProduct from '../hooks/useProduct';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, cached, loading, error, retry, refreshing } = useProduct(id);

  return <>
    <div className="back-links"><button className="text-button" onClick={() => navigate(-1)}>Back</button><Link to="/products">All Products</Link></div>
    {loading && <p className="message">Loading product...</p>}
    {error && <p className="message error" role="alert">{error}</p>}
    {error && !error.includes('Invalid') && <button className="button" disabled={refreshing} onClick={() => retry()}>Try again</button>}
    <CachedDataNotice cached={cached} hasData={Boolean(product)} />
    {!loading && !error && product && <div className="detail">
      <div className="detail-image"><img src={product.thumbnail} alt={product.title}/></div>
      <div><span className="eyebrow">{product.category}</span><h1>{product.title}</h1><p>{product.description}</p>
        <strong className="detail-price">${product.price}</strong>
        <dl className="details-list">
          <dt>Brand</dt><dd>{product.brand || 'Not specified'}</dd>
          <dt>Rating</dt><dd>{product.rating}</dd>
          <dt>Stock</dt><dd>{product.stock}</dd>
          <dt>Availability</dt><dd>{product.availabilityStatus || (product.stock > 0 ? 'In stock' : 'Out of stock')}</dd>
          <dt>Discount</dt><dd>{product.discountPercentage}%</dd>
          <dt>SKU</dt><dd>{product.sku || 'Not specified'}</dd>
          <dt>Warranty</dt><dd>{product.warrantyInformation || 'Not specified'}</dd>
          <dt>Shipping</dt><dd>{product.shippingInformation || 'Not specified'}</dd>
        </dl>
      </div>
    </div>}
  </>;
}
