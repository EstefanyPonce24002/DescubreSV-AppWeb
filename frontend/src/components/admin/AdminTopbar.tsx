import { Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const AdminTopbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="admin-topbar">
      <div className="topbar-title">
        <h2>Panel de Administración</h2>
      </div>

      <div className="topbar-actions">
        {/* Toggle tema claro/oscuro */}
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

        <div className="user-profile-menu">
          <div className="avatar">AD</div>
          {/* Nombre y rol ocultos en mobile */}
          <div className="user-profile-info user-profile-info--desktop">
            <span className="user-profile-name">Admin Principal</span>
            <span className="user-profile-role">Administrador</span>
          </div>
          <ChevronDown size={14} className="user-profile-chevron" />
        </div>
      </div>
    </header>
  );
};