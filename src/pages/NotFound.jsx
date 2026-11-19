import { Link } from 'react-router-dom';
export default function NotFound() {
  return <section className="not-found"><span>404</span><h1>Page not found</h1><p>Sorry, this page does not exist.</p><Link className="button" to="/">Go Home</Link></section>;
}