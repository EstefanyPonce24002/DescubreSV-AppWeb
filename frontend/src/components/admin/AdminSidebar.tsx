import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, LogOut, Shield, Menu, X, Layers, Compass, Map } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Botón hamburger — solo visible en mobile */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Overlay oscuro al abrir en mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Botón cerrar — solo visible en mobile */}
        <button
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>

        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Shield size={18} />
          </div>
          <div className="sidebar-brand-text">DescubreSV</div>
        </div>

        <div className="sidebar-nav-wrapper">
          <div className="sidebar-nav-group">
            <div className="sidebar-nav-title">Administración</div>
            <Link
              to="/admin/users"
              className={`sidebar-nav-item ${isActive('/admin/users') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Users size={18} />
              <span>Gestión de Usuarios</span>
            </Link>
            <Link
              to="/admin/categories"
              className={`sidebar-nav-item ${isActive('/admin/categories') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Layers size={18} />
              <span>Categorías</span>
            </Link>
            <Link
              to="/admin/destinations"
              className={`sidebar-nav-item ${isActive('/admin/destinations') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Compass size={18} />
              <span>Destinos</span>
            </Link>
          
            <Link
              to="/admin/itinerarios"
              className={`sidebar-nav-item ${isActive('/admin/itinerarios') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Map size={18} />
              <span>Itinerarios</span>
            </Link>

          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};