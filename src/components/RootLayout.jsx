import { Link, Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import usePwa from '../hooks/usePwa';

export default function RootLayout() {
  const { online, update, installPrompt, install } = usePwa();
  return (
    <>
      <NavBar />
      <div className="container pwa-status">
        <div className="connection-status" role="status">
          <span className={online ? 'connection-online' : 'connection-offline'}>
            {online ? 'Online' : 'Offline'}
          </span>
          {!online && <Link to="/offline">Offline help</Link>}
        </div>
        {installPrompt && <button className="button button-outline" type="button" onClick={install}>Install app</button>}
        {update && (
          <div className="pwa-update">
            <span role="status">A new version is available.</span>
            <button className="button" type="button" onClick={() => update.postMessage({ type: 'ACTIVATE_UPDATE' })}>
              Update app
            </button>
          </div>
        )}
      </div>
      <main className="container"><Outlet context={{ online }} /></main>
      <footer className="footer">SimpleShop · Product Catalog</footer>
    </>
  );
}
