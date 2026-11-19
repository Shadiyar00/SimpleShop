import { Link, useOutletContext } from 'react-router-dom';

export default function CachedDataNotice({ cached, hasData }) {
  const { online } = useOutletContext();
  if (!hasData || (!cached && online)) return null;

  return <p className="cache-notice" role="status">Showing saved product data. <Link to="/offline">Offline help</Link></p>;
}
