import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Filter, Plus, Users, Globe, Activity, DollarSign,
  MoreHorizontal, User, ChevronDown, ChevronLeft, ChevronRight,
  X, UserCheck, UserX, Eye, Pencil, Trash2, Download
} from 'lucide-react';
import { CreateUser } from './CreateUser';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { useNotification } from '../../context/NotificationContext';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount?: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

export const UsersManager = () => {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<string>('TODOS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await usuarioService.listar(0, 1000);
      if (response.success && response.data) {
        setUsers(response.data.contenido || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.correo || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRol = filterRol === 'TODOS' || user.rol === filterRol;
      const matchesEstado = filterEstado === 'TODOS' ||
        (filterEstado === 'ACTIVO' && user.activo) ||
        (filterEstado === 'INACTIVO' && !user.activo);
      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [users, searchTerm, filterRol, filterEstado]);

  const stats = useMemo(() => {
    const total = users.length;
    const activos = users.filter(u => u.rol === 'TURISTA' && u.activo).length;
    const nacs = new Set(users.map(u => u.nacionalidad).filter(Boolean)).size;
    
    const usersWithBudget = users.filter(u => u.presupuestoEstimado !== undefined && Number(u.presupuestoEstimado) > 0);
    const avg = usersWithBudget.length > 0 
      ? Math.round(usersWithBudget.reduce((sum, u) => sum + Number(u.presupuestoEstimado || 0), 0) / usersWithBudget.length)
      : 0;

    return { total, activos, nacs, avg };
  }, [users]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  }, [filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRol, filterEstado]);

  const handleSaveUser = useCallback(async (data: any) => {
    const payload = {
      nombre: data.nombre,
      correo: data.correo,
      nacionalidad: data.nacionalidad || undefined,
      presupuestoEstimado: data.presupuesto_estimado ? Number(data.presupuesto_estimado) : undefined,
      rol: data.rol,
      activo: data.activo,
      password: data.password || undefined
    };

    if (view === 'edit' && editingUser) {
      await usuarioService.actualizar(editingUser.idUsuario, payload);
    } else {
      await usuarioService.crear(payload);
    }
    await loadUsers();
    setView('list');
  }, [view, editingUser, loadUsers]);

  const handleDeleteUser = useCallback(async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await usuarioService.eliminar(id);
        showNotification('Usuario eliminado correctamente.', 'success');
        await loadUsers();
        setSelectedUsers(prev => prev.filter(selectedId => selectedId !== id));
        setOpenMenuId(null);
      } catch (err: any) {
        showNotification(err.response?.data?.message || err.message || 'Error al eliminar el usuario', 'error');
      }
    }
  }, [loadUsers, showNotification]);

  const handleToggleActive = useCallback(async (id: number) => {
    const userToToggle = users.find(u => u.idUsuario === id);
    if (!userToToggle) return;
    try {
      await usuarioService.actualizar(id, {
        nombre: userToToggle.nombre,
        correo: userToToggle.correo,
        rol: userToToggle.rol,
        activo: !userToToggle.activo,
        nacionalidad: userToToggle.nacionalidad,
        presupuestoEstimado: userToToggle.presupuestoEstimado
      });
      showNotification('Estado del usuario actualizado.', 'success');
      await loadUsers();
      setOpenMenuId(null);
    } catch (err: any) {
      showNotification(err.response?.data?.message || err.message || 'Error al actualizar estado del usuario', 'error');
    }
  }, [users, loadUsers, showNotification]);

  const toggleSelectAll = useCallback(() => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.idUsuario));
    }
  }, [selectedUsers, filteredUsers]);

  const toggleSelectUser = useCallback((id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  }, []);

  const activeFilterCount = useMemo(() => {
    return [filterRol !== 'TODOS', filterEstado !== 'TODOS'].filter(Boolean).length;
  }, [filterRol, filterEstado]);

  const clearFilters = useCallback(() => {
    setFilterRol('TODOS');
    setFilterEstado('TODOS');
    setSearchTerm('');
  }, []);

  if (view === 'create' || view === 'edit') {
    return (
      <CreateUser
        userToEdit={editingUser || undefined}
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
          <div className="stat-value">{stats.total.toLocaleString()}</div>
          <div className="stat-subtitle">Registrados en el sistema</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Turistas Activos</span>
            <div className="stat-icon stat-icon-success">
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-value">{stats.activos.toLocaleString()}</div>
          <div className="stat-subtitle">Con cuenta habilitada</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Nacionalidades</span>
            <div className="stat-icon stat-icon-info">
              <Globe size={18} />
            </div>
          </div>
          <div className="stat-value">{stats.nacs}</div>
          <div className="stat-subtitle">Países de origen distintos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Presupuesto Prom.</span>
            <div className="stat-icon stat-icon-warning">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.avg)}</div>
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
              {loading ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-state-content">
                      <div className="btn-spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto 1rem' }} />
                      <p>Cargando usuarios...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
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
                paginatedUsers.map(user => (
                  <tr key={user.idUsuario} className={selectedUsers.includes(user.idUsuario) ? 'row-selected' : ''}>
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedUsers.includes(user.idUsuario)}
                        onChange={() => toggleSelectUser(user.idUsuario)}
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
                    <td>{user.nacionalidad || '-'}</td>
                    <td className="td-currency">{formatCurrency(user.presupuestoEstimado)}</td>
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
                          onClick={() => setOpenMenuId(openMenuId === user.idUsuario ? null : user.idUsuario)}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        {openMenuId === user.idUsuario && (
                          <div className="dropdown-menu" onMouseLeave={() => setOpenMenuId(null)}>
                            <button className="dropdown-item" onClick={() => handleToggleActive(user.idUsuario)}>
                              {user.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                              <span>{user.activo ? 'Desactivar' : 'Activar'}</span>
                            </button>
                            <button className="dropdown-item dropdown-item-danger" onClick={() => handleDeleteUser(user.idUsuario)}>
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
            Mostrando <strong>{paginatedUsers.length}</strong> de <strong>{filteredUsers.length}</strong> usuarios
          </div>
          <div className="table-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'pagination-active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};