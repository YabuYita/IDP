import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./i.css";

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';

    switch (currentUser.role) {
      case 'student':
        return '/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav className="navbar bg-gray-800 text-white px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">Course Portal</Link>

        <button 
          onClick={toggleMenu}
          className="md:hidden text-white"
        >
          ☰
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center`}>
          <ul className="md:flex md:space-x-6 mt-3 md:mt-0">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to={getDashboardLink()} className="hover:underline">Dashboard</Link></li>
                <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:underline text-red-400"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:underline">Login</Link></li>
                <li><Link to="/register" className="hover:underline">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
