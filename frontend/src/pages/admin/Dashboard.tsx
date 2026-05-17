import { LayoutDashboard, Users, MapPin, Activity } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <LayoutDashboard size={20} color="var(--primary-color)" />
            </div>
            <h1 className="page-title">Dashboard General</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Resumen de actividad y métricas del sistema</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Total Usuarios</span>
            <Users size={20} color="var(--primary-color)" />
          </div>
          <div className="stat-value">1,204</div>
          <div className="stat-subtitle">Usuarios registrados</div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Destinos Activos</span>
            <MapPin size={20} color="var(--status-success-text)" />
          </div>
          <div className="stat-value">45</div>
          <div className="stat-subtitle">Lugares publicados</div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stat-title">Visitas Hoy</span>
            <Activity size={20} color="var(--status-info-text)" />
          </div>
          <div className="stat-value">3,892</div>
          <div className="stat-subtitle">Sesiones iniciadas</div>
        </div>
      </div>
    </div>
  );
};