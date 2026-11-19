import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authConfigured } from '../lib/firebase';
export default function Login({ signup = false }) {
 const { user, loading, login, signup: register, googleLogin } = useAuth();
 const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
 const [confirm, setConfirm] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
 const location = useLocation();
 const from = location.state?.from;
 const target = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !['/login','/signup'].includes(from) ? from : '/profile';
 if (loading) return <p className="message">Restoring session...</p>;
 if (user) return <Navigate to={target} replace />;
 async function perform(operation) {
  setError(''); setBusy(true);
  try { await operation(); } catch(e) { setError(e.message); } finally { setBusy(false); }
 }
 function submit(e) {
  e.preventDefault();
  if (signup && password !== confirm) { setError('Passwords do not match.'); return; }
  perform(() => signup ? register(email.trim(), password) : login(email.trim(), password));
 }
 return <section className="login-box"><span className="eyebrow">YOUR ACCOUNT</span><h1>{signup ? 'Sign up' : 'Login'}</h1>
 {!authConfigured && <p role="alert" className="error">Sign-in is unavailable until Firebase is configured.</p>}
 {error && <p role="alert" className="error">{error}</p>}
 <form onSubmit={submit}><label>Email<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
 <label>Password<input required type="password" minLength={6} autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={e=>setPassword(e.target.value)} /></label>
 {signup && <label>Confirm password<input required type="password" minLength={6} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} /></label>}
 <button className="button" disabled={busy || !authConfigured}>{busy ? 'Please wait...' : signup ? 'Create account' : 'Log in'}</button></form>
 <p><button className="button button-outline" disabled={busy || !authConfigured} onClick={()=>perform(googleLogin)}>Continue with Google</button></p>
 <Link to={signup ? '/login' : '/signup'} state={location.state}>{signup ? 'Already registered? Log in' : 'Create an account'}</Link></section>;
}
