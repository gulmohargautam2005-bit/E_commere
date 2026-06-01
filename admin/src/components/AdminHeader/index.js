import { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
  FaUserCircle,
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaChevronDown
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ onToggleSidebar, isSidebarOpen, className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', !isDarkMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`admin-header ${className}`}>
      <div className="header-left">
        <button className="hamburger-menu" onClick={onToggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search here..." />
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        {/* Profile with dropdown */}
        {/* Replace your user-profile div with this */}
        <div className="user-profile" ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="user-avatar" >
          {user?.name?.charAt(0)}
          </span>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Admin'}</div>
            <div className="user-handle">@{user?.email?.split('@')[0] || 'admin'}</div>
          </div>
          <FaChevronDown className={`profile-chevron ${dropdownOpen ? 'open' : ''}`} />

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <FaUserCircle className="dropdown-avatar" />
                <div>
                  <div className="dropdown-name">{user?.name || 'Admin'}</div>
                  <div className="dropdown-email">{user?.email || ''}</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                <FaUser className="dropdown-icon" /> Account Details
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/reset-password'); setDropdownOpen(false); }}>
                <FaKey className="dropdown-icon" /> Reset Password
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;