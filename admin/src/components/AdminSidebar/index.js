import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { 
  MdDashboard 
} from 'react-icons/md';
import { 
  FaAngleRight, 
  FaProductHunt,
  FaShoppingCart,
  FaComments,
  FaBell,
  FaCog,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen = true }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set active tab based on current route
    if (location.pathname.startsWith('/products')) return 1;
    if (location.pathname.startsWith('/dashboard')) return 0;
    return 0;
  });
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(() => {
    // Auto-open submenu if on products page
    return location.pathname.startsWith('/products');
  });

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu);
  };

  const menuItems = [
    { id: 0, icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
    { 
      id: 1, 
      icon: FaProductHunt, 
      label: 'Products', 
      path: '/products',
      submenu: [
        { label: 'Product List', path: '/products/list' },
        { label: 'Product View', path: '/products/view' },
        { label: 'Product Upload', path: '/products/upload' },
        { label: 'category Upload', path: '/category/upload' },
        { label: 'subcategory Upload', path: '/subcategory/upload' }
      ]
    },
 
    { id: 6, icon: FaSignInAlt, label: 'Login', path: '/login' },
    { id: 7, icon: FaUserPlus, label: 'Sign Up', path: '/signup' }
  ];

  return (
    <div className={`admin-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <span className="logo-text">HOTASH</span>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.submenu ? (
              <>
                <Button
                  className={`w-100 ${activeTab === item.id && isToggleSubmenu ? 'active' : ''}`}
                  onClick={() => isOpenSubmenu(item.id)}
                >
                  <span className='icon'><item.icon /></span>
                  {item.label}
                  <span className='arrow'><FaAngleRight /></span>
                </Button>
                <div className={`submenu ${activeTab === item.id && isToggleSubmenu ? 'open' : ''} ${location.pathname.startsWith('/products') ? 'open' : ''}`}>
                  {item.submenu.map((subItem, idx) => (
                    <Link key={idx} to={subItem.path}>
                      <Button className={`w-100 submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}>
                        {subItem.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link to={item.path}>
                <Button
                  className={`w-100 ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className='icon'><item.icon /></span>
                  {item.label}
                </Button>
              </Link>
            )}
          </li>
        ))}
      </ul>
      <div className="logout-section">
        <Button className="logout-btn">LOGOUT</Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

