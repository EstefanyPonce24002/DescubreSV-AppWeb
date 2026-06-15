import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass, Calendar, MapPin, DollarSign, Plus, Trash2, Edit, Save,
  X, Briefcase, Heart, User, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { itinerarioService, type ItinerarioResponse } from '../../services/itinerarioService';
import { presupuestoService, type PresupuestoResponse } from '../../services/presupuestoService';
import { itinerarioDestinoService, type ItinerarioDestinoResponse } from '../../services/itinerarioDestinoService';
import { destinoService, type DestinoResponse } from '../../services/destinoService';
import { favoritoService, type FavoritoResponse } from '../../services/favoritoService';

export const MyTrips = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState<'itinerarios' | 'favorites' | 'profile'>('itinerarios');
  
  const [itinerarios, setItinerarios] = useState<ItinerarioResponse[]>([]);
  const [favorites, setFavorites] = useState<FavoritoResponse[]>([]);
  const [destinations, setDestinations] = useState<DestinoResponse[]>([]);
  
  const [itinerariosLoading, setItinerariosLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  
  const [totalItinerarios, setTotalItinerarios] = useState(0);
  const [totalPagesItinerarios, setTotalPagesItinerarios] = useState(0);
  const [currentPageItinerarios, setCurrentPageItinerarios] = useState(0);
  const [pageSize] = useState(6);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItinerario, setEditingItinerario] = useState<ItinerarioResponse | null>(null);
  
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [duracion, setDuracion] = useState(1);
  const [presupuestoCategoria, setPresupuestoCategoria] = useState('MEDIO');
  const [tipoExperiencia, setTipoExperiencia] = useState('AVENTURA');
  const [tipoGrupo, setTipoGrupo] = useState('SOLO');
  const [modoPlanificacion, setModoPlanificacion] = useState('MANUAL');
  const [formError, setFormError] = useState<string | null>(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedItinerarioId, setSelectedItinerarioId] = useState<number | null>(null);
  const [budget, setBudget] = useState<PresupuestoResponse | null>(null);
  const [costoTransporte, setCostoTransporte] = useState('0');
  const [costoAlimentacion, setCostoAlimentacion] = useState('0');
  const [costoEntrada, setCostoEntrada] = useState('0');
  const [costoOtros, setCostoOtros] = useState('0');
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [budgetSuccess, setBudgetSuccess] = useState(false);

  const [showStopsModal, setShowStopsModal] = useState(false);
  const [stops, setStops] = useState<ItinerarioDestinoResponse[]>([]);
  const [stopsLoading, setStopsLoading] = useState(false);
  const [newStopDestinoId, setNewStopDestinoId] = useState<string>('');
  const [newStopDia, setNewStopDia] = useState(1);
  const [newStopOrden, setNewStopOrden] = useState(1);
  const [newStopNotas, setNewStopNotas] = useState('');
  const [stopsError, setStopsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || (user && user.rol !== 'TURISTA')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const loadItinerarios = useCallback(async () => {
    setItinerariosLoading(true);
    try {
      const response = await itinerarioService.listarTodos(currentPageItinerarios, pageSize);
      if (response.success && response.data) {
        setItinerarios(response.data.contenido);
        setTotalItinerarios(response.data.totalElementos);
        setTotalPagesItinerarios(response.data.totalPaginas);
      }
    } catch {
    } finally {
      setItinerariosLoading(false);
    }
  }, [currentPageItinerarios, pageSize]);

  const loadFavorites = useCallback(async () => {
    setFavoritesLoading(true);
    try {
      const response = await favoritoService.listarMisFavoritos(0, 100);
      if (response.success && response.data) {
        setFavorites(response.data.contenido);
      }
    } catch {
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const loadDestinations = useCallback(async () => {
    try {
      const response = await destinoService.listarPublicos(0, 100);
      if (response.success && response.data) {
        setDestinations(response.data.contenido);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.rol === 'TURISTA') {
      loadItinerarios();
      loadFavorites();
      loadDestinations();
    }
  }, [isAuthenticated, user, loadItinerarios, loadFavorites, loadDestinations]);

  const handleOpenCreateModal = (it?: ItinerarioResponse) => {
    setFormError(null);
    if (it) {
      setEditingItinerario(it);
      setNombre(it.nombre);
      setFechaInicio(it.fechaInicio || '');
      setFechaFin(it.fechaFin || '');
      setDuracion(it.duracion || 1);
      setPresupuestoCategoria(it.presupuestoCategoria || 'MEDIO');
      setTipoExperiencia(it.tipoExperiencia || 'AVENTURA');
      setTipoGrupo(it.tipoGrupo || 'SOLO');
      setModoPlanificacion(it.modoPlanificacion || 'MANUAL');
    } else {
      setEditingItinerario(null);
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
      setDuracion(1);
      setPresupuestoCategoria('MEDIO');
      setTipoExperiencia('AVENTURA');
      setTipoGrupo('SOLO');
      setModoPlanificacion('MANUAL');
    }
    setShowCreateModal(true);
  };

  const handleSaveItinerario = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nombre.trim()) {
      setFormError('El nombre del viaje es obligatorio.');
      return;
    }

    const requestData = {
      idUsuario: user?.idUsuario || 0,
      nombre: nombre.trim(),
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      duracion: Number(duracion),
      presupuestoCategoria,
      tipoExperiencia,
      tipoGrupo,
      modoPlanificacion
    };

    try {
      let response;
      if (editingItinerario) {
        response = await itinerarioService.actualizar(editingItinerario.idItinerario, requestData);
      } else {
        response = await itinerarioService.crear(requestData);
      }

      if (response.success) {
        setShowCreateModal(false);
        loadItinerarios();
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error al guardar el itinerario.');
    }
  };

  const handleDeleteItinerario = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este itinerario?')) {
      try {
        await itinerarioService.eliminar(id);
        showNotification('Itinerario eliminado correctamente.', 'success');
        loadItinerarios();
      } catch {
        showNotification('No se pudo eliminar el itinerario.', 'error');
      }
    }
  };

  const handleOpenBudget = async (idItinerario: number) => {
    setSelectedItinerarioId(idItinerario);
    setBudgetError(null);
    setBudgetSuccess(false);
    try {
      const response = await presupuestoService.obtenerPorItinerario(idItinerario);
      if (response.success && response.data) {
        setBudget(response.data);
        setCostoTransporte(response.data.costoTransporte.toString());
        setCostoAlimentacion(response.data.costoAlimentacion.toString());
        setCostoEntrada(response.data.costoEntrada.toString());
        setCostoOtros(response.data.costoOtros.toString());
      } else {
        setBudget(null);
        setCostoTransporte('0');
        setCostoAlimentacion('0');
        setCostoEntrada('0');
        setCostoOtros('0');
      }
    } catch {
      setBudget(null);
      setCostoTransporte('0');
      setCostoAlimentacion('0');
      setCostoEntrada('0');
      setCostoOtros('0');
    }
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setBudgetError(null);
    setBudgetSuccess(false);

    if (!selectedItinerarioId) return;

    const reqData = {
      idItinerario: selectedItinerarioId,
      costoTransporte: Number(costoTransporte) || 0,
      costoAlimentacion: Number(costoAlimentacion) || 0,
      costoEntrada: Number(costoEntrada) || 0,
      costoOtros: Number(costoOtros) || 0,
      moneda: 'USD'
    };

    try {
      let response;
      if (budget) {
        response = await presupuestoService.actualizar(budget.idPresupuesto, reqData);
      } else {
        response = await presupuestoService.guardar(reqData);
      }

      if (response.success) {
        setBudget(response.data);
        setBudgetSuccess(true);
      }
    } catch (err: any) {
      setBudgetError(err.response?.data?.message || 'Error al guardar el presupuesto.');
    }
  };

  const totalCalculated = useMemo(() => {
    return (
      (Number(costoTransporte) || 0) +
      (Number(costoAlimentacion) || 0) +
      (Number(costoEntrada) || 0) +
      (Number(costoOtros) || 0)
    );
  }, [costoTransporte, costoAlimentacion, costoEntrada, costoOtros]);

  const budgetPercentages = useMemo(() => {
    if (totalCalculated === 0) return { trans: 0, alim: 0, entr: 0, otr: 0 };
    return {
      trans: Math.round(((Number(costoTransporte) || 0) / totalCalculated) * 100),
      alim: Math.round(((Number(costoAlimentacion) || 0) / totalCalculated) * 100),
      entr: Math.round(((Number(costoEntrada) || 0) / totalCalculated) * 100),
      otr: Math.round(((Number(costoOtros) || 0) / totalCalculated) * 100),
    };
  }, [costoTransporte, costoAlimentacion, costoEntrada, costoOtros, totalCalculated]);

  const handleOpenStops = async (idItinerario: number) => {
    setSelectedItinerarioId(idItinerario);
    setStopsError(null);
    setNewStopDestinoId('');
    setNewStopDia(1);
    setNewStopOrden(1);
    setNewStopNotas('');
    setStopsLoading(true);
    try {
      const response = await itinerarioDestinoService.obtenerPorItinerario(idItinerario);
      if (response.success && response.data) {
        setStops(response.data);
      }
    } catch {
      setStops([]);
    } finally {
      setStopsLoading(false);
    }
    setShowStopsModal(true);
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    setStopsError(null);

    if (!selectedItinerarioId) return;
    if (!newStopDestinoId) {
      setStopsError('Debes seleccionar un destino.');
      return;
    }

    try {
      const response = await itinerarioDestinoService.agregarDestino({
        idItinerario: selectedItinerarioId,
        idDestino: Number(newStopDestinoId),
        diaNumero: Number(newStopDia),
        orden: Number(newStopOrden),
        notas: newStopNotas.trim() || undefined
      });

      if (response.success) {
        setNewStopDestinoId('');
        setNewStopNotas('');
        const refresh = await itinerarioDestinoService.obtenerPorItinerario(selectedItinerarioId);
        if (refresh.success && refresh.data) {
          setStops(refresh.data);
        }
      }
    } catch (err: any) {
      setStopsError(err.response?.data?.message || 'Error al agregar el destino al itinerario.');
    }
  };

  const handleRemoveStop = async (idDestino: number) => {
    if (!selectedItinerarioId) return;
    if (window.confirm('¿Deseas quitar esta parada de tu itinerario?')) {
      try {
        await itinerarioDestinoService.eliminarDestino(selectedItinerarioId, idDestino);
        const refresh = await itinerarioDestinoService.obtenerPorItinerario(selectedItinerarioId);
        if (refresh.success && refresh.data) {
          setStops(refresh.data);
        }
      } catch {
        setStopsError('No se pudo eliminar el destino del itinerario.');
      }
    }
  };

  const handleRemoveFavorite = async (idFavorito: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este destino de tus favoritos?')) {
      try {
        await favoritoService.eliminar(idFavorito);
        showNotification('Destino quitado de favoritos.', 'info');
        loadFavorites();
      } catch {
        showNotification('No se pudo quitar el favorito.', 'error');
      }
    }
  };

  return (
    <div className="tourist-dashboard" style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="section-container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-color)', fontWeight: 600 }}>Portal de Turista</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>¡Hola, {user?.nombre}!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Planifica tus viajes, gestiona tus presupuestos y organiza tus favoritos en El Salvador.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('itinerarios')}
              className={`btn-outline ${activeTab === 'itinerarios' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <Briefcase size={16} />
              <span>Itinerarios</span>
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`btn-outline ${activeTab === 'favorites' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <Heart size={16} />
              <span>Favoritos</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`btn-outline ${activeTab === 'profile' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <User size={16} />
              <span>Mi Perfil</span>
            </button>
          </div>
        </div>

        {activeTab === 'itinerarios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Mis Viajes y Rutas</h2>
              <button onClick={() => handleOpenCreateModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} />
                <span>Crear Viaje</span>
              </button>
            </div>

            {itinerariosLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
                <Loader2 size={32} className="login-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Cargando tus itinerarios...</p>
              </div>
            ) : itinerarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>¿A dónde viajas hoy?</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.5rem', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Aún no has creado ningún itinerario. Diseña tu primera ruta personalizada para explorar las maravillas salvadoreñas.
                </p>
                <button onClick={() => handleOpenCreateModal()} className="btn-primary">
                  Crear Mi Primer Viaje
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                  {itinerarios.map((it) => (
                    <div key={it.idItinerario} style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{it.nombre}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            <Calendar size={12} />
                            <span>{it.fechaInicio ? new Date(it.fechaInicio).toLocaleDateString() : 'Flexible'} - {it.fechaFin ? new Date(it.fechaFin).toLocaleDateString() : 'Flexible'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button onClick={() => handleOpenCreateModal(it)} style={{ padding: '0.375rem', color: 'var(--text-secondary)' }} title="Editar detalles">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteItinerario(it.idItinerario)} style={{ padding: '0.375rem', color: 'var(--status-danger-text)' }} title="Eliminar viaje">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.25rem 0', backgroundColor: 'var(--app-bg)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Duración:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{it.duracion} {it.duracion === 1 ? 'Día' : 'Días'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Presupuesto:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{it.presupuestoCategoria}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Experiencia:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{it.tipoExperiencia}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', display: 'block' }}>Planificación:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{it.modoPlanificacion}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => handleOpenBudget(it.idItinerario)}
                          className="btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        >
                          <DollarSign size={12} />
                          <span>Presupuesto</span>
                        </button>
                        <button
                          onClick={() => handleOpenStops(it.idItinerario)}
                          className="btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        >
                          <MapPin size={12} />
                          <span>Gestionar Paradas</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="table-footer" style={{ marginTop: '2rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Total de <strong>{totalItinerarios}</strong> itinerarios
                  </div>
                  <div className="table-pagination" style={{ display: 'flex', gap: '0.25rem' }}>
                    {Array.from({ length: totalPagesItinerarios }, (_, i) => (
                      <button
                        key={i}
                        className={`pagination-btn ${currentPageItinerarios === i ? 'pagination-active' : ''}`}
                        onClick={() => setCurrentPageItinerarios(i)}
                        style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)' }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Mis Destinos Favoritos</h2>

            {favoritesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
                <Loader2 size={32} className="login-spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Cargando tus favoritos...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
                <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Guarda tus destinos favoritos</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.5rem', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Explora destinos salvadoreños en el buscador y presiona el ícono de corazón o estrella para agregarlos a tu panel.
                </p>
                <button onClick={() => navigate('/explore')} className="btn-primary">
                  Explorar Destinos
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {favorites.map((fav) => (
                  <div key={fav.idFavorito} style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: 'var(--primary-glow)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                        <MapPin size={20} style={{ color: 'var(--primary-color)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fav.nombreDestino}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agregado: {new Date(fav.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(fav.idFavorito)}
                      style={{ color: 'var(--status-danger-text)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                      title="Eliminar de favoritos"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: '600px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                <span style={{ margin: 'auto' }}>{user?.nombre ? user.nombre[0].toUpperCase() : 'U'}</span>
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.nombre}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Rol: Turista Autenticado</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo Electrónico</span>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.125rem' }}>{user?.correo}</p>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nacionalidad</span>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.125rem' }}>{user?.nacionalidad || 'No especificada'}</p>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Presupuesto Estimado general</span>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.125rem' }}>{user?.presupuestoEstimado ? `$${user.presupuestoEstimado.toFixed(2)}` : 'No especificado'}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preferencias de Viaje</span>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.125rem' }}>{user?.preferencias || 'Ninguna preferencia registrada.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 7, 12, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{editingItinerario ? 'Editar Itinerario' : 'Crear Nuevo Itinerario'}</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItinerario} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-text)', color: 'var(--status-danger-text)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                  {formError}
                </div>
              )}

              <div className="login-field">
                <label className="login-label">Nombre del Viaje</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="login-input"
                  placeholder="Ej: Fin de semana en El Tunco"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="login-field">
                  <label className="login-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="login-field">
                  <label className="login-label">Fecha de Fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="login-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="login-field">
                  <label className="login-label">Duración (Días)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={duracion}
                    onChange={(e) => setDuracion(Number(e.target.value))}
                    className="login-input"
                  />
                </div>
                <div className="login-field">
                  <label className="login-label">Nivel de Presupuesto</label>
                  <select
                    value={presupuestoCategoria}
                    onChange={(e) => setPresupuestoCategoria(e.target.value)}
                    className="login-input"
                    style={{ appearance: 'none', background: 'var(--app-bg)' }}
                  >
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="ALTO">Alto</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="login-field">
                  <label className="login-label">Tipo Experiencia</label>
                  <select
                    value={tipoExperiencia}
                    onChange={(e) => setTipoExperiencia(e.target.value)}
                    className="login-input"
                    style={{ appearance: 'none', background: 'var(--app-bg)' }}
                  >
                    <option value="AVENTURA">Aventura</option>
                    <option value="RELAX">Relax</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="GASTRONOMICO">Gastronómico</option>
                  </select>
                </div>
                <div className="login-field">
                  <label className="login-label">Tipo de Grupo</label>
                  <select
                    value={tipoGrupo}
                    onChange={(e) => setTipoGrupo(e.target.value)}
                    className="login-input"
                    style={{ appearance: 'none', background: 'var(--app-bg)' }}
                  >
                    <option value="SOLO">Solo</option>
                    <option value="PAREJA">Pareja</option>
                    <option value="FAMILIA">Familia</option>
                    <option value="AMIGOS">Amigos</option>
                  </select>
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Modo Planificación</label>
                <select
                  value={modoPlanificacion}
                  onChange={(e) => setModoPlanificacion(e.target.value)}
                  className="login-input"
                  style={{ appearance: 'none', background: 'var(--app-bg)' }}
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATICO">Automático</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Viaje</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBudgetModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 7, 12, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Desglose de Costos de Presupuesto</h2>
              <button onClick={() => setShowBudgetModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <form onSubmit={handleSaveBudget} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="login-field">
                  <label className="login-label">Costos Transporte ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costoTransporte}
                    onChange={(e) => setCostoTransporte(e.target.value)}
                    className="login-input"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Costos Alimentación ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costoAlimentacion}
                    onChange={(e) => setCostoAlimentacion(e.target.value)}
                    className="login-input"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Costos Entrada ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costoEntrada}
                    onChange={(e) => setCostoEntrada(e.target.value)}
                    className="login-input"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">Otros Costos ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costoOtros}
                    onChange={(e) => setCostoOtros(e.target.value)}
                    className="login-input"
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {budgetError && <span style={{ color: 'var(--status-danger-text)', fontSize: '0.75rem' }}>{budgetError}</span>}
                  {budgetSuccess && <span style={{ color: 'var(--status-success-text)', fontSize: '0.75rem' }}>¡Presupuesto actualizado con éxito!</span>}
                  <button type="submit" className="btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Save size={14} />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Costo Total Acumulado:</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-color)' }}>${totalCalculated.toFixed(2)} USD</span>
                </div>

                <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--app-bg)', marginBottom: '1rem' }}>
                  <div style={{ width: `${budgetPercentages.trans}%`, backgroundColor: '#3b82f6', height: '100%' }} title={`Transporte: ${budgetPercentages.trans}%`} />
                  <div style={{ width: `${budgetPercentages.alim}%`, backgroundColor: '#10b981', height: '100%' }} title={`Alimentación: ${budgetPercentages.alim}%`} />
                  <div style={{ width: `${budgetPercentages.entr}%`, backgroundColor: '#f59e0b', height: '100%' }} title={`Entradas: ${budgetPercentages.entr}%`} />
                  <div style={{ width: `${budgetPercentages.otr}%`, backgroundColor: '#8b5cf6', height: '100%' }} title={`Otros: ${budgetPercentages.otr}%`} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', marginRight: '4px' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Trans ({budgetPercentages.trans}%)</span>
                  </div>
                  <div>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginRight: '4px' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Alim ({budgetPercentages.alim}%)</span>
                  </div>
                  <div>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', marginRight: '4px' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Entr ({budgetPercentages.entr}%)</span>
                  </div>
                  <div>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6', marginRight: '4px' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Otros ({budgetPercentages.otr}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStopsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 7, 12, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '750px', maxHeight: '90vh', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Gestionar Paradas del Itinerario</h2>
              <button onClick={() => setShowStopsModal(false)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <form onSubmit={handleAddStop} style={{ backgroundColor: 'var(--app-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Seleccionar Destino</label>
                  <select
                    value={newStopDestinoId}
                    onChange={(e) => setNewStopDestinoId(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }}
                  >
                    <option value="">Selecciona un lugar...</option>
                    {destinations.map((d) => (
                      <option key={d.idDestino} value={d.idDestino}>{d.nombre} ({d.departamento})</option>
                    ))}
                  </select>
                </div>

                <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Día #</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStopDia}
                    onChange={(e) => setNewStopDia(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Orden</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStopOrden}
                    onChange={(e) => setNewStopOrden(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notas</label>
                  <input
                    type="text"
                    placeholder="Ej: Tomar fotos al atardecer"
                    value={newStopNotas}
                    onChange={(e) => setNewStopNotas(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', padding: '0.4rem 0.5rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}>
                  Agregar
                </button>

                {stopsError && <div style={{ width: '100%', color: 'var(--status-danger-text)', fontSize: '0.75rem' }}>{stopsError}</div>}
              </form>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Paradas en la ruta</h3>

                {stopsLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Cargando paradas...</p>
                ) : stops.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>No hay destinos agregados a este itinerario aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stops.map((stop) => (
                      <div key={stop.idDestino} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--app-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-color)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                            <span style={{ margin: 'auto' }}>{stop.diaNumero}</span>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stop.destino?.nombre}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Prioridad: {stop.orden} {stop.notas ? `| Notas: ${stop.notas}` : ''}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStop(stop.idDestino)}
                          style={{ color: 'var(--status-danger-text)', padding: '0.25rem' }}
                          title="Eliminar parada"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowStopsModal(false)} className="btn-outline">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
