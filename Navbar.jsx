import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/aastu-logo.png';
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="AASTU Logo" style={{ height: '40px', marginRight: '12px' }} className="rounded-full" />
          <Link to="/" className="text-lg font-bold">AASTU ONLINE REGISTRATION</Link>
        </div>

        <button 
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-gray-300 transition-colors"
        >
          ☰
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center`}>
          <ul className="md:flex md:items-center md:space-x-6 mt-3 md:mt-0">
            <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to={getDashboardLink()} className="hover:text-gray-300 transition-colors">Dashboard</Link></li>
                {currentUser && (currentUser.role === 'student' || currentUser.role === 'admin') && (
                  <li><Link to="/profile" className="hover:text-gray-300 transition-colors">Profile</Link></li>
                )}
                <li className="md:ml-4">
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
