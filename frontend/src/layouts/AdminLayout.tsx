import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminTopbar } from '../components/admin/AdminTopbar';

export const AdminLayout = () => {
  return (
    <div className="layout-admin">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};