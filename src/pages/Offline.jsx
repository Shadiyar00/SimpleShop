import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Offline() {
  const [status, setStatus] = useState('');
  const [checking, setChecking] = useState(false);

  async function retry() {
    setChecking(true);
    setStatus('');
    try {
      const response = await fetch('/connection.json', {
        cache: 'no-store',
        signal: AbortSignal.timeout(4500),
      });
      if (!response.ok || !(await response.json()).online) throw new Error('Offline');
      setStatus('Connection restored. You can now browse the catalog.');
    } catch {
      setStatus('Still offline. Check your connection and try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="panel offline-panel">
      <h1>Browse SimpleShop offline</h1>
      <p>Previously loaded products are available on this device. Reconnect to load new products and sign in.</p>
      <div className="actions">
        <button type="button" className="button" disabled={checking} onClick={retry}>
          {checking ? 'Checking connection...' : 'Retry Connection'}
        </button>
        <Link className="button button-outline" to="/products">Browse saved products</Link>
      </div>
      <p role="status">{status}</p>
    </section>
  );
}
