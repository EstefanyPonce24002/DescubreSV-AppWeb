import { useState } from 'react';
import {
  Search, Filter, Plus, Users, Globe, Activity, DollarSign,
  MoreHorizontal, User, ChevronDown, ChevronLeft, ChevronRight,
  X, UserCheck, UserX, Eye, Pencil, Trash2, Download
} from 'lucide-react';
import { CreateUser } from './CreateUser';

const INITIAL_USERS = [
  { id: 1, nombre: 'Daniel Ramirez', correo: 'daniel.ramirez@example.com', nacionalidad: 'El Salvador', presupuesto_estimado: 0, rol: 'ADMIN', activo: true, createdAt: '2026-05-10', password_hash: '' },
  { id: 2, nombre: 'Sarah Johnson', correo: 'sarah.j@gmail.com', nacionalidad: 'Estados Unidos', presupuesto_estimado: 1200, rol: 'TURISTA', activo: true, createdAt: '2026-05-14', password_hash: '' }
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const UsersManager = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingUser, setEditingUser] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === 'TODOS' || user.rol === filterRol;
    const matchesEstado = filterEstado === 'TODOS' ||
      (filterEstado === 'ACTIVO' && user.activo) ||
      (filterEstado === 'INACTIVO' && !user.activo);
    return matchesSearch && matchesRol && matchesEstado;
  });

  const totalUsuarios = users.length;
  const turistasActivos = users.filter(u => u.rol === 'TURISTA' && u.activo).length;
  const nacionalidades = new Set(users.map(u => u.nacionalidad).filter(Boolean)).size;
  const presupuestoPromedio = Math.round(
    users.filter(u => Number(u.presupuesto_estimado) > 0).reduce((sum, u) => sum + Number(u.presupuesto_estimado), 0) /
    (users.filter(u => Number(u.presupuesto_estimado) > 0).length || 1)
  );

  const handleSaveUser = (data: any) => {
    if (view === 'edit' && editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data, presupuesto_estimado: Number(data.presupuesto_estimado || 0) } : u));
    } else {
      setUsers([{
        id: Date.now(),
        ...data,
        presupuesto_estimado: Number(data.presupuesto_estimado || 0),
        createdAt: new Date().toISOString()
      }, ...users]);
    }
    setView('list');
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
      setSelectedUsers(selectedUsers.filter(selectedId => selectedId !== id));
      setOpenMenuId(null);
    }
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
    setOpenMenuId(null);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const activeFilterCount = [filterRol !== 'TODOS', filterEstado !== 'TODOS'].filter(Boolean).length;

  const clearFilters = () => {
    setFilterRol('TODOS');
    setFilterEstado('TODOS');
    setSearchTerm('');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <CreateUser
        userToEdit={editingUser}
        onSave={handleSaveUser}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Administra los usuarios turistas y administradores de la plataforma</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-outline" onClick={() => ({})}>
            <Download size={16} />
            <span>Exportar</span>
          </button>
          <button className="btn-primary" onClick={() => { setEditingUser(null); setView('create'); }}>
            <Plus size={16} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Usuarios</span>
            <div className="stat-icon stat-icon-primary">
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{totalUsuarios.toLocaleString()}</div>
          <div className="stat-subtitle">Registrados en el sistema</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Turistas Activos</span>
            <div className="stat-icon stat-icon-success">
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-value">{turistasActivos.toLocaleString()}</div>
          <div className="stat-subtitle">Con cuenta habilitada</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Nacionalidades</span>
            <div className="stat-icon stat-icon-info">
              <Globe size={18} />
            </div>
          </div>
          <div className="stat-value">{nacionalidades}</div>
          <div className="stat-subtitle">Países de origen distintos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Presupuesto Prom.</span>
            <div className="stat-icon stat-icon-warning">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(presupuestoPromedio)}</div>
          <div className="stat-subtitle">Estimado por turista</div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="toolbar-left">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            {activeFilterCount > 0 && (
              <button className="btn-ghost" onClick={clearFilters}>
                <X size={14} />
                <span>Limpiar filtros</span>
              </button>
            )}
            <button
              className={`btn-outline filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
              <ChevronDown size={14} className={`filter-chevron ${showFilters ? 'rotated' : ''}`} />
            </button>

            {selectedUsers.length > 0 && (
              <div className="bulk-actions">
                <span className="bulk-count">{selectedUsers.length} seleccionados</span>
                <button className="btn-outline btn-danger-outline">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label className="filter-label">Rol</label>
              <div className="filter-chips">
                {['TODOS', 'ADMIN', 'TURISTA'].map(rol => (
                  <button
                    key={rol}
                    className={`filter-chip ${filterRol === rol ? 'active' : ''}`}
                    onClick={() => setFilterRol(rol)}
                  >
                    {rol === 'TODOS' && <Users size={13} />}
                    {rol === 'ADMIN' && <UserCheck size={13} />}
                    {rol === 'TURISTA' && <Globe size={13} />}
                    <span>{rol === 'TODOS' ? 'Todos' : rol === 'ADMIN' ? 'Admin' : 'Turista'}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-divider" />
            <div className="filter-group">
              <label className="filter-label">Estado</label>
              <div className="filter-chips">
                {['TODOS', 'ACTIVO', 'INACTIVO'].map(estado => (
                  <button
                    key={estado}
                    className={`filter-chip ${filterEstado === estado ? 'active' : ''}`}
                    onClick={() => setFilterEstado(estado)}
                  >
                    {estado === 'TODOS' && <Users size={13} />}
                    {estado === 'ACTIVO' && <UserCheck size={13} />}
                    {estado === 'INACTIVO' && <UserX size={13} />}
                    <span>{estado === 'TODOS' ? 'Todos' : estado === 'ACTIVO' ? 'Activos' : 'Inactivos'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Nacionalidad</th>
                <th>Presupuesto</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th className="th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-state-content">
                      <Users size={40} />
                      <p>No se encontraron usuarios</p>
                      <span>Intenta ajustar los filtros o el término de búsqueda</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? 'row-selected' : ''}>
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-placeholder">
                          <User size={14} />
                        </div>
                        <span className="user-name">{user.nombre}</span>
                      </div>
                    </td>
                    <td className="td-email">{user.correo}</td>
                    <td>{user.nacionalidad}</td>
                    <td className="td-currency">{formatCurrency(user.presupuesto_estimado)}</td>
                    <td>
                      <span className={`badge ${user.rol === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.activo ? 'badge-success' : 'badge-danger'}`}>
                        <span className={`status-dot ${user.activo ? 'dot-success' : 'dot-danger'}`} />
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="td-date">{formatDate(user.createdAt)}</td>
                    <td className="td-actions">
                      <div className="actions-wrapper">
                        <button className="action-btn" title="Ver detalle" onClick={() => { setEditingUser(user); setView('edit'); }}>
                          <Eye size={15} />
                        </button>
                        <button className="action-btn" title="Editar" onClick={() => { setEditingUser(user); setView('edit'); }}>
                          <Pencil size={15} />
                        </button>
                        <button
                          className="action-btn action-more"
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        {openMenuId === user.id && (
                          <div className="dropdown-menu" onMouseLeave={() => setOpenMenuId(null)}>
                            <button className="dropdown-item" onClick={() => handleToggleActive(user.id)}>
                              {user.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{user.activo ? 'Desactivar' : 'Activar'}</span>
                            </button>
                            <button className="dropdown-item dropdown-item-danger" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 size={14} />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="table-footer-info">
            Mostrando <strong>{filteredUsers.length}</strong> de <strong>{totalUsuarios}</strong> usuarios
          </div>
          <div className="table-pagination">
            <button className="pagination-btn" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="pagination-btn pagination-active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">12</button>
            <button className="pagination-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};