import { Link, useLocation } from 'react-router-dom';
import Cart from '../Cart/Cart.jsx';
import './Header.css';

const Header = () => {
  const location = useLocation();

  // Genera el breadcrumb basado en la ruta actual
  const getBreadcrumbs = () => {
    const path = location.pathname;

    if (path === '/') {
      return [{ label: 'Home', path: '/' }];
    }

    if (path.startsWith('/product/')) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Product Details', path: path },
      ];
    }

    return [{ label: 'Home', path: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <svg
            className="header-logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="5"
              y="2"
              width="14"
              height="20"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
            <line
              x1="9"
              y1="5"
              x2="15"
              y2="5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="header-logo-text">MOBILESTORE</span>
        </Link>

        <nav className="header-breadcrumbs" aria-label="Breadcrumb">
          <ol className="breadcrumbs-list">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="breadcrumb-item">
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="breadcrumb-current">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Cart />
      </div>
    </header>
  );
};

export default Header;
