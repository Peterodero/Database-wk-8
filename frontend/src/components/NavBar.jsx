// src/components/Navbar.js
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Product Order System</h2>
      </div>
      <div className="navbar-links">
        <Link 
          to="/products" 
          className={location.pathname === '/products' ? 'active' : ''}
        >
          Products
        </Link>
        <Link 
          to="/orders" 
          className={location.pathname === '/orders' ? 'active' : ''}
        >
          Orders
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;