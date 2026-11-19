import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setMenuOpen(false), [location.pathname]);
  async function leave() {
    setBusy(true); setError('');
    try { await logout(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return (
    <header className="header">
      <nav className="nav container" aria-label="Main navigation">
        <NavLink className="logo" to="/">Simple<span>Shop</span></NavLink>
        <button
          className="menu-toggle button button-outline"
          type="button"
          aria-controls="main-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
        <div id="main-menu" className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/about">About</NavLink>
          {user ? <><NavLink to="/profile">Profile</NavLink><button className="text-button" disabled={busy} onClick={leave}>{busy ? 'Signing out...' : 'Logout'}</button></> : <><NavLink to="/login">Login</NavLink><NavLink to="/signup">Signup</NavLink></>}
        </div>
      </nav>
      {error && <p className="container error" role="alert">{error}</p>}
    </header>
  );
}
