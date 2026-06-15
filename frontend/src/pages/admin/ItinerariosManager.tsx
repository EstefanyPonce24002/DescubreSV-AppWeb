import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Calendar, DollarSign, Map, MapPin, X } from 'lucide-react';
import { itinerarioService, type ItinerarioResponse } from '../../services/itinerarioService';
import { CreateItinerario } from './CreateItinerario';
import { PresupuestoModal } from '../../components/admin/PresupuestoModal';
import { DestinosItinerarioModal } from '../../components/admin/DestinosItinerarioModal';
import { useNotification } from '../../context/NotificationContext';

export function ItinerariosManager() {
  const { showNotification } = useNotification();
  const [itinerarios, setItinerarios] = useState<ItinerarioResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItinerario, setEditingItinerario] = useState<ItinerarioResponse | null>(null);

  const [isPresupuestoOpen, setIsPresupuestoOpen] = useState(false);
  const [isDestinosOpen, setIsDestinosOpen] = useState(false);
  const [selectedItinerarioId, setSelectedItinerarioId] = useState<number | null>(null);
  const [selectedItinerarioName, setSelectedItinerarioName] = useState<string>('');

  const fetchItinerarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await itinerarioService.listarTodos(currentPage, pageSize);
      if (response && response.success && response.data) {
        setItinerarios(response.data.contenido);
        setTotalElements(response.data.totalElementos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchItinerarios();
  }, [fetchItinerarios]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Al eliminar este itinerario, también se borrará su presupuesto y rutas (Cascade). ¿Continuar?')) {
      try {
        await itinerarioService.eliminar(id);
        showNotification('Itinerario eliminado correctamente.', 'success');
        fetchItinerarios();
      } catch (err: any) {
        showNotification('Error al eliminar el itinerario.', 'error');
      }
    }
  }, [fetchItinerarios, showNotification]);

  const filteredItinerarios = useMemo(() => {
    if (!searchTerm) return itinerarios;
    return itinerarios.filter(it =>
      (it.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (it.nombreUsuario || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [itinerarios, searchTerm]);

  if (view === 'create' || view === 'edit') {
    return (
      <CreateItinerario
        itinerarioToEdit={editingItinerario || undefined}
        onSave={() => { setView('list'); setCurrentPage(0); fetchItinerarios(); }}
        onCancel={() => { setView('list'); setEditingItinerario(null); }}
      />
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Itinerarios</h1>
          <p className="page-subtitle">Panel general de planes de viaje</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => { setEditingItinerario(null); setView('create'); }}>
            <Plus size={16} />
            <span>Nuevo Viaje</span>
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="toolbar-left">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre o creador..."
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
                <th style={{ width: '60px' }}>ID</th>
                <th>Nombre del Plan</th>
                <th>Usuario</th>
                <th>Fechas</th>
                <th>Estado</th>
                <th className="th-actions">Acciones de Gestión</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="btn-spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto 1rem' }} />
                    <p>Cargando itinerarios...</p>
                  </td>
                </tr>
              ) : filteredItinerarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <Map size={40} />
                    <p>No se encontraron itinerarios</p>
                  </td>
                </tr>
              ) : (
                filteredItinerarios.map(it => (
                  <tr key={it.idItinerario}>
                    <td>#{it.idItinerario}</td>
                    <td><strong>{it.nombre}</strong></td>
                    <td>{it.nombreUsuario || `Usr #${it.usuarioId}`}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} className="text-muted" />
                        <span>{it.fechaInicio || 'S/F'} - {it.fechaFin || 'S/F'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${it.activo ? 'badge-success' : 'badge-danger'}`}>
                        {it.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="td-actions">
                      <div className="actions-wrapper">
                        <button
                          className="action-btn"
                          title="Armar Ruta (Destinos)"
                          onClick={() => {
                            setSelectedItinerarioId(it.idItinerario);
                            setSelectedItinerarioName(it.nombre);
                            setIsDestinosOpen(true);
                          }}
                        >
                          <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                        </button>
                        <button
                          className="action-btn"
                          title="Desglose de Presupuesto"
                          onClick={() => {
                            setSelectedItinerarioId(it.idItinerario);
                            setSelectedItinerarioName(it.nombre);
                            setIsPresupuestoOpen(true);
                          }}
                        >
                          <DollarSign size={15} style={{ color: 'var(--color-success)' }} />
                        </button>
                        <button
                          className="action-btn"
                          title="Editar Datos Base"
                          onClick={() => {
                            setEditingItinerario(it);
                            setView('edit');
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="action-btn"
                          title="Eliminar Viaje Completo"
                          onClick={() => handleDelete(it.idItinerario)}
                        >
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
            Mostrando <strong>{filteredItinerarios.length}</strong> de <strong>{totalElements}</strong> itinerarios
          </div>
          <div className="table-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i).map(pageNum => (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'pagination-active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {isPresupuestoOpen && selectedItinerarioId && (
        <PresupuestoModal
          idItinerario={selectedItinerarioId}
          nombreItinerario={selectedItinerarioName}
          onClose={() => { setIsPresupuestoOpen(false); setSelectedItinerarioId(null); }}
        />
      )}

      {isDestinosOpen && selectedItinerarioId && (
        <DestinosItinerarioModal
          idItinerario={selectedItinerarioId}
          nombreItinerario={selectedItinerarioName}
          onClose={() => { setIsDestinosOpen(false); setSelectedItinerarioId(null); }}
        />
      )}
    </div>
  );
}