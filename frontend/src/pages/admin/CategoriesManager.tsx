import { useState, useEffect } from 'react';
import {
  Layers, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, X, FolderOpen
} from 'lucide-react';
import { categoriaService } from '../../services/categoriaService';
import type { CategoriaResponse } from '../../services/categoriaService';
import { useNotification } from '../../context/NotificationContext';

export const CategoriesManager = () => {
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<CategoriaResponse | null>(null);

  const [formData, setFormData] = useState({
    nombreCategoria: '',
    descripcion: '',
    activo: true,
  });

  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriaService.listarAdmin(currentPage, pageSize);
      if (response.success && response.data) {
        setCategories(response.data.contenido);
        setTotalElements(response.data.totalElementos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch (err: any) {
      setError('Error al cargar las categorías. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingCategory(null);
    setFormData({
      nombreCategoria: '',
      descripcion: '',
      activo: true,
    });
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (category: CategoriaResponse) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormData({
      nombreCategoria: category.nombreCategoria,
      descripcion: category.descripcion || '',
      activo: category.activo,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombreCategoria.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      if (modalMode === 'create') {
        const response = await categoriaService.crear(formData);
        if (response.success) {
          showNotification('Categoría creada exitosamente.', 'success');
          setShowModal(false);
          fetchCategories();
        }
      } else if (modalMode === 'edit' && editingCategory) {
        const response = await categoriaService.actualizar(editingCategory.idCategoria, formData);
        if (response.success) {
          showNotification('Categoría actualizada exitosamente.', 'success');
          setShowModal(false);
          fetchCategories();
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al guardar la categoría.';
      setError(errMsg);
      showNotification(errMsg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta categoría? Esto podría afectar a los destinos asociados.')) {
      try {
        await categoriaService.eliminar(id);
        showNotification('Categoría eliminada exitosamente.', 'success');
        fetchCategories();
      } catch (err: any) {
        showNotification(err.response?.data?.message || 'No se puede eliminar la categoría.', 'error');
      }
    }
  };

  const handleToggleActive = async (category: CategoriaResponse) => {
    try {
      await categoriaService.actualizar(category.idCategoria, {
        nombreCategoria: category.nombreCategoria,
        descripcion: category.descripcion,
        activo: !category.activo,
      });
      showNotification('Estado de la categoría actualizado.', 'success');
      fetchCategories();
    } catch (err: any) {
      showNotification('Error al cambiar el estado de la categoría.', 'error');
    }
  };

  const filteredCategories = categories.filter(c =>
    c.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descripcion && c.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCategoriasCount = totalElements;

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Categorías</h1>
          <p className="page-subtitle">Administra las clasificaciones de los destinos turísticos</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Total Categorías</span>
            <div className="stat-icon stat-icon-primary">
              <Layers size={18} />
            </div>
          </div>
          <div className="stat-value">{totalCategoriasCount}</div>
          <div className="stat-subtitle">Registradas en el sistema</div>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="toolbar-left">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
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
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Nombre de la Categoría</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-state-content">
                      <div className="login-spinner" style={{ borderColor: 'var(--color-primary) transparent transparent transparent' }} />
                      <p>Cargando categorías...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-state-content">
                      <FolderOpen size={40} />
                      <p>No se encontraron categorías</p>
                      <span>Intenta ajustar tu término de búsqueda</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat.idCategoria}>
                    <td>#{cat.idCategoria}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-placeholder" style={{ backgroundColor: 'var(--bg-card-hover)', color: 'var(--color-primary)' }}>
                          <Layers size={14} />
                        </div>
                        <span className="user-name" style={{ fontWeight: 600 }}>{cat.nombreCategoria}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.descripcion || '-'}
                    </td>
                    <td>
                      <button
                          onClick={() => handleToggleActive(cat)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <span className={`badge ${cat.activo ? 'badge-success' : 'badge-danger'}`}>
                          <span className={`status-dot ${cat.activo ? 'dot-success' : 'dot-danger'}`} />
                          {cat.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    </td>
                    <td className="td-actions">
                      <div className="actions-wrapper">
                        <button className="action-btn" title="Editar" onClick={() => handleOpenEdit(cat)}>
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn action-more" title="Eliminar" onClick={() => handleDelete(cat.idCategoria)}>
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
            Mostrando <strong>{filteredCategories.length}</strong> de <strong>{totalElements}</strong> categorías
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

      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="login-card" style={{ width: '450px', padding: '2rem', borderRadius: '16px' }}>
            <div className="login-header" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <div className="login-logo" style={{ margin: '0 auto 1rem auto' }}>
                <Layers size={22} />
              </div>
              <h2 className="login-title" style={{ fontSize: '1.5rem' }}>
                {modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
              </h2>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--color-danger)',
                color: 'var(--color-danger)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label className="login-label">Nombre de la Categoría</label>
                <div className="login-input-wrapper">
                  <input
                    type="text"
                    required
                    className="login-input"
                    placeholder="Ej. Playas, Montaña..."
                    value={formData.nombreCategoria}
                    onChange={(e) => setFormData({ ...formData, nombreCategoria: e.target.value })}
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Descripción</label>
                <div className="login-input-wrapper" style={{ minHeight: '80px' }}>
                  <textarea
                    className="login-input"
                    placeholder="Descripción de la categoría..."
                    style={{ height: '80px', padding: '0.75rem', resize: 'vertical' }}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>
              </div>

              <div className="login-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="activo"
                  className="custom-checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                />
                <label htmlFor="activo" className="login-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                  Categoría Activa (Visible al público)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
