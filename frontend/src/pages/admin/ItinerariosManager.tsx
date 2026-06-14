import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X, Calendar, DollarSign, Map, MapPin } from 'lucide-react';
import { itinerarioService, ItinerarioResponse } from '../../services/itinerarioService';
import { CreateItinerario } from './CreateItinerario';
import { PresupuestoModal } from '../../components/admin/PresupuestoModal';
import { DestinosItinerarioModal } from '../../components/admin/DestinosItinerarioModal';

export function ItinerariosManager() {
  const [itinerarios, setItinerarios] = useState<ItinerarioResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItinerario, setEditingItinerario] = useState<ItinerarioResponse | null>(null);

  // Estados de Modales Secundarios
  const [isPresupuestoOpen, setIsPresupuestoOpen] = useState(false);
  const [isDestinosOpen, setIsDestinosOpen] = useState(false);
  const [selectedItinerarioId, setSelectedItinerarioId] = useState<number | null>(null);
  const [selectedItinerarioName, setSelectedItinerarioName] = useState<string>('');

  const fetchItinerarios = async () => {
    setIsLoading(true);
    try {
      const response = await itinerarioService.listarTodos(currentPage, pageSize);
      if (response && response.success && response.data) {
        setItinerarios(response.data.contenido);
        setTotalElements(response.data.totalElementos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch (err) {
      console.error("Error al cargar itinerarios", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerarios();
  }, [currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    if (confirm('Al eliminar este itinerario, también se borrará su presupuesto y rutas (Cascade). ¿Continuar?')) {
      try {
        await itinerarioService.eliminar(id);
        fetchItinerarios();
      } catch (err: any) {
        alert('Error al eliminar el itinerario.');
      }
    }
  };

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
            <Plus size={16} /><span>Nuevo Viaje</span>
          </button>
        </div>
      </div>

      <div className="data-table-container">
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
                  <td colSpan={6} className="empty-state"><div className="login-spinner" /></td>
                </tr>
              ) : itinerarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <Map size={40} />
                    <p>No se encontraron itinerarios</p>
                  </td>
                </tr>
              ) : (
                itinerarios.map(it => (
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
                        {/* 1. Ruta / Destinos */}
                        <button className="action-btn" title="Armar Ruta (Destinos)" onClick={() => { setSelectedItinerarioId(it.idItinerario); setSelectedItinerarioName(it.nombre); setIsDestinosOpen(true); }}>
                          <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                        </button>
                        {/* 2. Presupuesto */}
                        <button className="action-btn" title="Desglose de Presupuesto" onClick={() => { setSelectedItinerarioId(it.idItinerario); setSelectedItinerarioName(it.nombre); setIsPresupuestoOpen(true); }}>
                          <DollarSign size={15} style={{ color: 'var(--color-success)' }} />
                        </button>
                        {/* 3. Datos Base */}
                        <button className="action-btn" title="Editar Datos Base" onClick={() => { setEditingItinerario(it); setView('edit'); }}>
                          <Pencil size={15} />
                        </button>
                        <button className="action-btn" title="Eliminar Viaje Completo" onClick={() => handleDelete(it.idItinerario)}>
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
      </div>

      {/* Renderizado Condicional de los Modales (Solo se abren si hay un ID seleccionado) */}
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