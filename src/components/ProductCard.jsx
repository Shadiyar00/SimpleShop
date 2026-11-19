import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="badge">{product.category}</span>
        <h3>{product.title}</h3>
        <p className="small">⭐ {product.rating} · {product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
        <div className="card-bottom">
          <strong>${product.price}</strong>
          <Link className="button small-button" to={`/products/${product.id}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}