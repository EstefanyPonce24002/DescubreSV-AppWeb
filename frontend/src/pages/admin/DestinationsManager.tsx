import { useState, useEffect } from 'react';
import {
  MapPin, Plus, Search, ChevronLeft, ChevronRight, Filter,
  Pencil, Trash2, X, Activity, Compass
} from 'lucide-react';
import { destinoService } from '../../services/destinoService';
import type { DestinoResponse } from '../../services/destinoService';
import { categoriaService } from '../../services/categoriaService';
import type { CategoriaResponse } from '../../services/categoriaService';
import { CreateDestination } from './CreateDestination';

const DEPARTAMENTOS = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
];

export const DestinationsManager = () => {
  const [destinations, setDestinations] = useState<DestinoResponse[]>([]);
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('TODAS');
  const [filterDepto, setFilterDepto] = useState<string>('TODOS');
  const [showFilters, setShowFilters] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingDestination, setEditingDestination] = useState<DestinoResponse | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await categoriaService.listarActivasSinPaginar();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
    }
  };

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchTerm.trim() !== '') {
        response = await destinoService.buscarPorNombre(searchTerm, currentPage, pageSize);
      } else if (filterCategory !== 'TODAS') {
        response = await destinoService.listarPorCategoria(Number(filterCategory), currentPage, pageSize);
      } else if (filterDepto !== 'TODOS') {
        response = await destinoService.listarPorDepartamento(filterDepto, currentPage, pageSize);
      } else {
        response = await destinoService.listarAdmin(currentPage, pageSize);
      }

      if (response && response.success && response.data) {
        setDestinations(response.data.contenido);
        setTotalElements(response.data.totalElementos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [currentPage, pageSize, filterCategory, filterDepto]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCurrentPage(0);
      fetchDestinations();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
    setTimeout(() => {
      fetchDestinations();
    }, 50);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este destino turístico?')) {
      try {
        await destinoService.eliminar(id);
        fetchDestinations();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error al eliminar el destino.');
      }
    }
  };

  const handleToggleActive = async (destino: DestinoResponse) => {
    try {
      await destinoService.actualizar(destino.idDestino, {
        nombre: destino.nombre,
        descripcion: destino.descripcion,
        departamento: destino.departamento,
        precioEntrada: destino.precioEntrada,
        horario: destino.horario,
        mejorEpoca: destino.mejorEpoca,
        tipo: destino.tipo,
        comoLlegarVehiculo: destino.comoLlegarVehiculo,
        comoLlegarBus: destino.comoLlegarBus,
        latitud: destino.latitud,
        longitud: destino.longitud,
        imagenUrl: destino.imagenUrl,
        idCategoria: destino.idCategoria,
        activo: !destino.activo,
      });
      fetchDestinations();
    } catch (err) {
      alert('Error al actualizar el estado del destino.');
    }
  };

  const handleSave = () => {
    setView('list');
    setEditingDestination(null);
    setCurrentPage(0);
    fetchDestinations();
  };

  const activeFiltersCount = [
    filterCategory !== 'TODAS',
    filterDepto !== 'TODOS'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterCategory('TODAS');
    setFilterDepto('TODOS');
    setSearchTerm('');
    setCurrentPage(0);
  };

  if (view === 'create' || view === 'edit') {
    return (
      <CreateDestination
        destinoToEdit={editingDestination || undefined}
        onSave={handleSave}
        onCancel={() => { setView('list'); setEditingDestination(null); }}
      />
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Destinos</h1>
          <p className="page-subtitle">Administra los destinos turísticos nacionales en la plataforma</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => { setEditingDestination(null); setView('create'); }}>
            <Plus size={16} />
            <span>Nuevo Destino</span>
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Destinos</span>
            <div className="stat-icon stat-icon-primary">
              <Compass size={18} />
            </div>
          </div>
          <div className="stat-value">{totalElements}</div>
          <div className="stat-subtitle">Registrados en DescubreSV</div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="toolbar-left">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre (Presiona Enter)..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
              {searchTerm && (
                <button className="search-clear" onClick={handleClearSearch}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            {activeFiltersCount > 0 && (
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
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label className="filter-label">Categoría</label>
              <select
                className="form-input form-select"
                style={{ width: '220px', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.875rem' }}
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(0); }}
              >
                <option value="TODAS">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombreCategoria}</option>
                ))}
              </select>
            </div>
            <div className="filter-divider" />
            <div className="filter-group">
              <label className="filter-label">Departamento</label>
              <select
                className="form-input form-select"
                style={{ width: '220px', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.875rem' }}
                value={filterDepto}
                onChange={(e) => { setFilterDepto(e.target.value); setCurrentPage(0); }}
              >
                <option value="TODOS">Todos los departamentos</option>
                {DEPARTAMENTOS.map(depto => (
                  <option key={depto} value={depto}>{depto}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Destino</th>
                <th>Departamento</th>
                <th>Categoría</th>
                <th>Precio Entrada</th>
                <th>Calificación</th>
                <th>Estado</th>
                <th className="th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <div className="empty-state-content">
                      <div className="login-spinner" style={{ borderColor: 'var(--color-primary) transparent transparent transparent' }} />
                      <p>Cargando destinos...</p>
                    </div>
                  </td>
                </tr>
              ) : destinations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <div className="empty-state-content">
                      <Compass size={40} />
                      <p>No se encontraron destinos</p>
                      <span>Intenta ajustar los filtros o el término de búsqueda</span>
                    </div>
                  </td>
                </tr>
              ) : (
                destinations.map(dest => (
                  <tr key={dest.idDestino}>
                    <td>#{dest.idDestino}</td>
                    <td>
                      <div className="user-cell">
                        {dest.imagenUrl ? (
                          <img
                            src={dest.imagenUrl}
                            alt={dest.nombre}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              backgroundColor: 'var(--bg-card)'
                            }}
                          />
                        ) : (
                          <div className="user-avatar-placeholder" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--color-primary)' }}>
                            <Compass size={14} />
                          </div>
                        )}
                        <span className="user-name" style={{ fontWeight: 600 }}>{dest.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} style={{ color: 'var(--color-muted)' }} />
                        <span>{dest.departamento}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{dest.nombreCategoria || 'Sin Categoría'}</span>
                    </td>
                    <td className="td-currency">
                      {dest.precioEntrada === 0 ? 'Gratis' : `$${dest.precioEntrada.toFixed(2)}`}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span>★</span>
                        <span style={{ fontWeight: 600 }}>{dest.calificacionPromedio ? dest.calificacionPromedio.toFixed(1) : '0.0'}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(dest)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <span className={`badge ${dest.activo ? 'badge-success' : 'badge-danger'}`}>
                          <span className={`status-dot ${dest.activo ? 'dot-success' : 'dot-danger'}`} />
                          {dest.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    </td>
                    <td className="td-actions">
                      <div className="actions-wrapper">
                        <button className="action-btn" title="Editar" onClick={() => { setEditingDestination(dest); setView('edit'); }}>
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn" title="Eliminar" onClick={() => handleDelete(dest.idDestino)}>
                          <Trash2 size={15} style={{ color: 'var(--color-danger)' }} />
                        </button>
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
            Mostrando <strong>{destinations.length}</strong> de <strong>{totalElements}</strong> destinos
          </div>
          <div className="table-pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-btn ${currentPage === i ? 'pagination-active' : ''}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages - 1 || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
