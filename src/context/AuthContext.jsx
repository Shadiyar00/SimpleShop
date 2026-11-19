import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../lib/firebase';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [error, setError] = useState('');
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, value => { setUser(value); setLoading(false); }, () => { setError('Could not restore your session. Please sign in again.'); setLoading(false); });
  }, []);
  async function run(operation) {
    setError('');
    if (!auth) throw new Error('Firebase is not configured. Contact the site owner.');
    try { await setPersistence(auth, browserLocalPersistence); return await operation(); }
    catch (e) {
      const messages = {
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Use at least 6 characters for your password.',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        'auth/popup-blocked': 'Allow popups and try Google sign-in again.',
        'auth/unauthorized-domain': 'This domain is not authorized in Firebase.',
        'auth/operation-not-allowed': 'This sign-in provider is not enabled.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };
      const message = messages[e.code] || 'Authentication failed. Please try again.';
      setError(message); throw new Error(message);
    }
  }
  return <AuthContext.Provider value={{ user, loading, error,
    login: (email, password) => run(() => signInWithEmailAndPassword(auth, email, password)),
    signup: (email, password) => run(() => createUserWithEmailAndPassword(auth, email, password)),
    googleLogin: () => run(() => signInWithPopup(auth, new GoogleAuthProvider())),
    logout: () => run(() => signOut(auth)),
  }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
