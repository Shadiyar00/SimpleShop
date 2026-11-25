import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PersonalInventory from '../components/PersonalInventory';
export default function Profile() {
 const { user, logout } = useAuth(); const [busy,setBusy] = useState(false); const [error,setError] = useState('');
 async function leave() { setBusy(true); setError(''); try { await logout(); } catch(e) { setError(e.message); } finally { setBusy(false); } }
 return <>
   <section className="panel"><h1>Profile</h1><p>{user.displayName || 'Welcome to SimpleShop'}</p><dl className="details-list"><dt>Email</dt><dd>{user.email}</dd><dt>UID</dt><dd style={{overflowWrap:'anywhere'}}>{user.uid}</dd></dl>{error && <p role="alert" className="error">{error}</p>}<button className="button" disabled={busy} onClick={leave}>{busy ? 'Signing out...' : 'Logout'}</button></section>
   <PersonalInventory key={user.uid} uid={user.uid} />
 </>;
}
