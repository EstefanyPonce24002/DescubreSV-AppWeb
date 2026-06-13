import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

export const AdminTopbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="admin-topbar">
      <div className="topbar-title">
        <h2>Panel de Administración</h2>
      </div>

      <div className="topbar-actions">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <div
          className="user-profile-menu"
          onClick={() => setShowDropdown(prev => !prev)}
          ref={dropdownRef}
          style={{ position: 'relative' }}
        >
          <div className="avatar">
            {user?.nombre ? user.nombre[0].toUpperCase() : 'A'}
          </div>
          <div className="user-profile-info user-profile-info--desktop">
            <span className="user-profile-name">{user?.nombre || 'Administrador'}</span>
            <span className="user-profile-role">{user?.rol === 'ADMIN' ? 'Administrador' : 'Turista'}</span>
          </div>
          <ChevronDown size={14} className="user-profile-chevron" />

          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                <LogOut size={14} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};