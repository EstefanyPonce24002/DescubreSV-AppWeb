import { Bell, ChevronDown } from 'lucide-react';

export const AdminTopbar = () => {
  return (
    <header className="admin-topbar">
      <div className="topbar-title">
        <h2>Panel de Administración</h2>
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <div className="user-profile-menu">
          <div className="avatar">AD</div>
          <div className="user-profile-info">
            <span className="user-profile-name">Admin Principal</span>
            <span className="user-profile-role">Administrador</span>
          </div>
          <ChevronDown size={14} className="user-profile-chevron" />
        </div>
      </div>
    </header>
  );
};