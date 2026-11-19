import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">WELCOME TO SIMPLESHOP</p>
          <h1>Discover products <em>you will love.</em></h1>
          <p>Explore products, compare prices and check simple statistics in one place.</p>
          <div className="actions">
            <Link to="/products" className="button">Browse Products</Link>
            <Link to="/about" className="button button-outline">About Project</Link>
          </div>
        </div>
        <img src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp" alt="Featured cosmetic product" />
      </section>
      <section className="feature-row">
        <div><strong>01</strong><h3>Find products</h3><p>Search and filter our catalog.</p></div>
        <div><strong>02</strong><h3>Explore details</h3><p>Read about each product.</p></div>
        <div><strong>03</strong><h3>View statistics</h3><p>See how products compare.</p></div>
      </section>
    </>
  );
}