import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Compass, ChevronRight, Filter, X,
  Clock, DollarSign, Calendar, Car, Bus, Trash2, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { destinoService, type DestinoResponse } from '../../services/destinoService';
import { categoriaService, type CategoriaResponse } from '../../services/categoriaService';
import { resenaService, type ResenaResponse } from '../../services/resenaService';
import { favoritoService, type FavoritoResponse } from '../../services/favoritoService';

const DEPARTAMENTOS = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
];

export const Explore = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();

  const [destinations, setDestinations] = useState<DestinoResponse[]>([]);
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedDepto, setSelectedDepto] = useState<string>('TODOS');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDestino, setSelectedDestino] = useState<DestinoResponse | null>(null);
  const [reviews, setReviews] = useState<ResenaResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [favorites, setFavorites] = useState<FavoritoResponse[]>([]);

  const fetchFavorites = useCallback(async () => {
    if (isAuthenticated && user?.rol === 'TURISTA') {
      try {
        const response = await favoritoService.listarMisFavoritos(0, 100);
        if (response.success && response.data) {
          setFavorites(response.data.contenido);
        }
      } catch {}
    }
  }, [isAuthenticated, user]);

  const handleToggleFavorite = async (idDestino: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.rol !== 'TURISTA') return;

    const existingFav = favorites.find(f => f.idDestino === idDestino);
    try {
      if (existingFav) {
        await favoritoService.eliminar(existingFav.idFavorito);
        showNotification('Eliminado de tus favoritos.', 'info');
      } else {
        await favoritoService.agregar({ idDestino });
        showNotification('¡Agregado a tus favoritos!', 'success');
      }
      fetchFavorites();
    } catch {
      showNotification('Error al actualizar favorito.', 'error');
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriaService.listarActivasSinPaginar();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch {
    }
  }, []);

  const fetchDestinations = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (searchTerm.trim() !== '') {
        response = await destinoService.buscarPorNombre(searchTerm, currentPage, pageSize);
      } else if (selectedCategory !== 'TODAS') {
        response = await destinoService.listarPorCategoria(Number(selectedCategory), currentPage, pageSize);
      } else if (selectedDepto !== 'TODOS') {
        response = await destinoService.listarPorDepartamento(selectedDepto, currentPage, pageSize);
      } else {
        response = await destinoService.listarPublicos(currentPage, pageSize);
      }

      if (response && response.success && response.data) {
        setDestinations(response.data.contenido);
        setTotalElements(response.data.totalElementos);
        setTotalPages(response.data.totalPaginas);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, selectedCategory, selectedDepto]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCurrentPage(0);
      fetchDestinations();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSelectedCategory('TODAS');
    setSelectedDepto('TODOS');
    setSearchTerm('');
    setCurrentPage(0);
  };

  const fetchReviews = async (id: number) => {
    setReviewsLoading(true);
    try {
      const response = await resenaService.listarPorDestino(id, 0, 100);
      if (response.success && response.data) {
        setReviews(response.data.contenido);
      }
    } catch {
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleViewDetails = (destino: DestinoResponse) => {
    setSelectedDestino(destino);
    setReviewComment('');
    setReviewRating(5);
    setReviewError(null);
    setReviewSuccess(false);
    fetchReviews(destino.idDestino);
  };

  const handleCloseDetails = () => {
    setSelectedDestino(null);
    fetchDestinations();
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (!selectedDestino) return;

    if (!reviewComment.trim()) {
      setReviewError('Por favor escribe un comentario sobre tu experiencia.');
      return;
    }

    try {
      const response = await resenaService.crear({
        idDestino: selectedDestino.idDestino,
        calificacion: reviewRating,
        comentario: reviewComment
      });

      if (response.success) {
        setReviewComment('');
        setReviewRating(5);
        setReviewSuccess(true);
        fetchReviews(selectedDestino.idDestino);
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Error al publicar la reseña.');
    }
  };

  const handleDeleteReview = async (idResena: number) => {
    if (!selectedDestino) return;
    if (window.confirm('¿Seguro que deseas eliminar tu reseña?')) {
      try {
        await resenaService.eliminar(idResena);
        showNotification('Reseña eliminada correctamente.', 'success');
        fetchReviews(selectedDestino.idDestino);
      } catch {
        showNotification('No se pudo eliminar la reseña.', 'error');
      }
    }
  };

  const activeFiltersCount = useMemo(() => {
    return [
      selectedCategory !== 'TODAS',
      selectedDepto !== 'TODOS'
    ].filter(Boolean).length;
  }, [selectedCategory, selectedDepto]);

  return (
    <div className="explore-page" style={{ paddingBottom: '4rem' }}>
      <section className="explore-hero">
        <div className="section-container">
          <h1 className="explore-title">Descubre El Salvador</h1>
          <p className="explore-subtitle">
            Busca, filtra y explora los destinos más asombrosos del país.
          </p>

          <div className="explore-search-bar" style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} className="explore-search-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Presiona Enter para buscar por nombre..."
                className="explore-search-input"
                style={{ width: '100%', paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', border: 'none', background: 'none' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline ${showFilters ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Filter size={16} />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count" style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem', backgroundColor: 'var(--card-bg)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                <label className="filter-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(0); }}
                  className="search-input"
                  style={{ width: '200px', backgroundColor: 'var(--app-bg)', padding: '0.4rem 0.75rem' }}
                >
                  <option value="TODAS">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombreCategoria}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                <label className="filter-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Departamento</label>
                <select
                  value={selectedDepto}
                  onChange={(e) => { setSelectedDepto(e.target.value); setCurrentPage(0); }}
                  className="search-input"
                  style={{ width: '200px', backgroundColor: 'var(--app-bg)', padding: '0.4rem 0.75rem' }}
                >
                  <option value="TODOS">Todos los departamentos</option>
                  {DEPARTAMENTOS.map((depto) => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={handleClearFilters} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-danger-text)' }}>
                    <X size={14} />
                    <span>Limpiar filtros</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="explore-content" style={{ marginTop: '2rem' }}>
        <div className="section-container">
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '4rem 0' }}>
              <div className="login-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', borderColor: 'var(--primary-color) transparent transparent transparent' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Buscando destinos...</p>
            </div>
          ) : destinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>No se encontraron destinos</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Intenta ajustar tus filtros o busca otros términos.</p>
            </div>
          ) : (
            <>
              <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {destinations.map((dest) => (
                  <div key={dest.idDestino} className="destination-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ height: '200px', width: '100%', position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                      {dest.imagenUrl ? (
                        <img
                          src={dest.imagenUrl}
                          alt={dest.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--app-bg)' }}>
                          <Compass size={40} style={{ margin: 'auto' }} />
                        </div>
                      )}
                      <span className="badge badge-info" style={{ position: 'absolute', top: '1rem', left: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                        {dest.nombreCategoria}
                      </span>
                      {isAuthenticated && user?.rol === 'TURISTA' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(dest.idDestino);
                          }}
                          style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'rgba(5, 7, 12, 0.65)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '50%',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: favorites.some(f => f.idDestino === dest.idDestino) ? '#ef4444' : '#fff',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                            zIndex: 10
                          }}
                          title={favorites.some(f => f.idDestino === dest.idDestino) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          <Heart size={16} fill={favorites.some(f => f.idDestino === dest.idDestino) ? '#ef4444' : 'none'} />
                        </button>
                      )}
                    </div>

                    <div className="destination-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 className="destination-name" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{dest.nombre}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineBreak: 'anywhere', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                        {dest.descripcion || 'Sin descripción disponible.'}
                      </p>

                      <div className="destination-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div className="destination-location" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                          <MapPin size={14} />
                          <span style={{ fontSize: '0.75rem' }}>{dest.departamento}</span>
                        </div>
                        <div className="destination-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.875rem' }}>
                          <Star size={14} fill="currentColor" />
                          <span style={{ fontWeight: 600 }}>{dest.calificacionPromedio ? dest.calificacionPromedio.toFixed(1) : '0.0'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(dest)}
                        className="destination-cta"
                        style={{ marginTop: '1.25rem', width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-glow)', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: '1px solid rgba(99, 102, 241, 0.2)', transition: 'all 0.2s' }}
                      >
                        <span>Ver Detalles y Reseñas</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="table-footer" style={{ marginTop: '3rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Mostrando <strong>{destinations.length}</strong> de <strong>{totalElements}</strong> destinos
                </div>
                <div className="table-pagination" style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`pagination-btn ${currentPage === i ? 'pagination-active' : ''}`}
                      onClick={() => setCurrentPage(i)}
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
      </section>

      {selectedDestino && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 7, 12, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '850px', maxHeight: '90vh', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedDestino.nombre}</h2>
                {isAuthenticated && user?.rol === 'TURISTA' && (
                  <button
                    onClick={() => handleToggleFavorite(selectedDestino.idDestino)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: favorites.some(f => f.idDestino === selectedDestino.idDestino) ? '#ef4444' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={favorites.some(f => f.idDestino === selectedDestino.idDestino) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart size={20} fill={favorites.some(f => f.idDestino === selectedDestino.idDestino) ? '#ef4444' : 'none'} />
                  </button>
                )}
              </div>
              <button onClick={handleCloseDetails} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', width: '100%' }} className="responsive-modal-grid">
                {selectedDestino.imagenUrl && (
                  <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '250px' }}>
                    <img src={selectedDestino.imagenUrl} alt={selectedDestino.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="badge badge-info">{selectedDestino.nombreCategoria}</span>
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} />
                      {selectedDestino.departamento}
                    </span>
                    <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={12} fill="currentColor" />
                      {selectedDestino.calificacionPromedio ? selectedDestino.calificacionPromedio.toFixed(1) : '0.0'}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>{selectedDestino.descripcion || 'Sin descripción disponible.'}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: 'var(--app-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <DollarSign size={16} style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Entrada</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedDestino.precioEntrada === 0 ? 'Gratis' : `$${selectedDestino.precioEntrada.toFixed(2)}`}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <Clock size={16} style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Horario</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedDestino.horario || 'No especificado'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <Calendar size={16} style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Mejor época</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedDestino.mejorEpoca || 'Todo el año'}</div>
                      </div>
                    </div>
                  </div>

                  {(selectedDestino.comoLlegarVehiculo || selectedDestino.comoLlegarBus) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>¿Cómo llegar?</h4>
                      {selectedDestino.comoLlegarVehiculo && (
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          <Car size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>En Vehículo:</strong> {selectedDestino.comoLlegarVehiculo}
                          </div>
                        </div>
                      )}
                      {selectedDestino.comoLlegarBus && (
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          <Bus size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>En Bus:</strong> {selectedDestino.comoLlegarBus}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Comentarios y Reseñas</h3>

                {isAuthenticated && user?.rol === 'TURISTA' ? (
                  <form onSubmit={handlePostReview} style={{ backgroundColor: 'var(--app-bg)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Deja tu reseña</h4>

                    {reviewError && (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-text)', color: 'var(--status-danger-text)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        {reviewError}
                      </div>
                    )}

                    {reviewSuccess && (
                      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--status-success-bg)', border: '1px solid var(--status-success-text)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        ¡Tu reseña se ha publicado con éxito!
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Calificación:</span>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="search-input"
                        style={{ width: '150px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={1}>⭐</option>
                      </select>
                    </div>

                    <textarea
                      placeholder="Comparte tu experiencia en este lugar turistico..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', height: '80px', padding: '0.5rem', fontSize: '0.8125rem', resize: 'none', marginBottom: '0.75rem' }}
                    />

                    <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                      Enviar Reseña
                    </button>
                  </form>
                ) : !isAuthenticated ? (
                  <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-lg)', color: 'var(--status-warning-text)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span>Debes iniciar sesión como turista para publicar una reseña.</span>
                    <button onClick={() => { setSelectedDestino(null); navigate('/login'); }} style={{ color: 'var(--primary-color)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Inicia sesión aquí
                    </button>
                  </div>
                ) : null}

                {reviewsLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cargando opiniones...</p>
                ) : reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>Este destino aún no tiene opiniones. ¡Sé el primero en calificarlo!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map((r) => (
                      <div key={r.idResena} style={{ backgroundColor: 'var(--app-bg)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.nombreUsuario}</div>
                            <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                              {'★'.repeat(r.calificacion)}
                              {'☆'.repeat(5 - r.calificacion)}
                            </div>
                          </div>
                          {isAuthenticated && user && user.idUsuario === r.idUsuario && (
                            <button onClick={() => handleDeleteReview(r.idResena)} style={{ color: 'var(--status-danger-text)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} title="Eliminar reseña">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.5rem', lineHeight: '1.4' }}>{r.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
              <button onClick={handleCloseDetails} className="btn-outline">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
