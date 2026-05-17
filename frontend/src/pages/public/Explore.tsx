import { useState } from 'react';
import {
  Search, MapPin, Star, Mountain, Waves, TreePine,
  Compass, ChevronRight, Filter, X
} from 'lucide-react';

const DESTINATIONS = [
  { id: 1, name: 'Volcán de Santa Ana', category: 'Volcanes', department: 'Santa Ana', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Playa El Tunco', category: 'Playas', department: 'La Libertad', rating: 4.7, reviews: 521 },
  { id: 3, name: 'Suchitoto', category: 'Pueblos', department: 'Cuscatlán', rating: 4.9, reviews: 189 },
  { id: 4, name: 'Parque El Imposible', category: 'Bosques', department: 'Ahuachapán', rating: 4.6, reviews: 156 },
  { id: 5, name: 'Ruta de las Flores', category: 'Aventura', department: 'Sonsonate', rating: 4.8, reviews: 412 },
  { id: 6, name: 'Playa El Zonte', category: 'Playas', department: 'La Libertad', rating: 4.5, reviews: 298 },
  { id: 7, name: 'Lago de Coatepeque', category: 'Aventura', department: 'Santa Ana', rating: 4.7, reviews: 367 },
  { id: 8, name: 'Joya de Cerén', category: 'Ruinas', department: 'La Libertad', rating: 4.4, reviews: 143 },
  { id: 9, name: 'Volcán de Izalco', category: 'Volcanes', department: 'Sonsonate', rating: 4.6, reviews: 201 },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Volcanes: Mountain,
  Playas: Waves,
  Pueblos: MapPin,
  Bosques: TreePine,
  Aventura: Compass,
  Ruinas: Star,
};

const CATEGORIES = ['Todos', 'Playas', 'Volcanes', 'Bosques', 'Pueblos', 'Aventura', 'Ruinas'];

export const Explore = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = DESTINATIONS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.department.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Todos' || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="explore-page">
      <section className="explore-hero">
        <div className="section-container">
          <h1 className="explore-title">Explorar Destinos</h1>
          <p className="explore-subtitle">
            Descubre los lugares más impresionantes de El Salvador
          </p>

          <div className="explore-search-bar">
            <Search size={18} className="explore-search-icon" />
            <input
              type="text"
              placeholder="Buscar destinos, departamentos..."
              className="explore-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="explore-search-clear" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
            <button className="explore-search-btn">
              <Filter size={16} />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </section>

      <section className="explore-content">
        <div className="section-container">
          <div className="explore-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`explore-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="explore-results-info">
            <span>{filtered.length} destinos encontrados</span>
          </div>

          {filtered.length === 0 ? (
            <div className="explore-empty">
              <MapPin size={48} />
              <h3>No se encontraron destinos</h3>
              <p>Intenta con otros filtros o términos de búsqueda</p>
            </div>
          ) : (
            <div className="explore-grid">
              {filtered.map(dest => {
                const IconComp = CATEGORY_ICONS[dest.category] || MapPin;
                return (
                  <div key={dest.id} className="destination-card">
                    <div className="destination-image-placeholder">
                      <IconComp size={32} />
                    </div>
                    <div className="destination-body">
                      <span className="destination-category">{dest.category}</span>
                      <h3 className="destination-name">{dest.name}</h3>
                      <div className="destination-meta">
                        <div className="destination-location">
                          <MapPin size={13} />
                          <span>{dest.department}</span>
                        </div>
                        <div className="destination-rating">
                          <Star size={13} fill="currentColor" />
                          <span>{dest.rating}</span>
                          <span className="destination-reviews">({dest.reviews})</span>
                        </div>
                      </div>
                      <button className="destination-cta">
                        <span>Ver Detalles</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
