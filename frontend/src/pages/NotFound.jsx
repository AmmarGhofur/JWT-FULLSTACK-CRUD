import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="form-card">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    </div>
  );
}
