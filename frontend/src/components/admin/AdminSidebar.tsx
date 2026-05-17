import { Link, useLocation } from 'react-router-dom';
import { Users, LogOut, Shield } from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Shield size={18} />
        </div>
        <div className="sidebar-brand-text">DescubreSV</div>
      </div>

      <div className="sidebar-nav-wrapper">
        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">Administración</div>
          <Link to="/admin/users" className={sidebar-nav-item ${isActive('/admin/users') ? 'active' : ''}}>
            <Users size={18} />
            <span>Gestión de Usuarios</span>
          </Link>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-nav-item">
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};