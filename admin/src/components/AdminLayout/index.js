import { useState } from 'react';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={isSidebarOpen} />
      <AdminHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} className={!isSidebarOpen ? 'sidebar-collapsed' : ''} />
      <main className={`admin-main-content ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

