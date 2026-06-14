import { Link } from 'react-router-dom';
import {
  ArrowRight, MapPin, Compass, Shield, Globe, Users,
  Star, ChevronRight, Sparkles, Mountain, Waves, TreePine
} from 'lucide-react';

// IMPORTAMOS COMPONENTE DE RESEÑAS REALES
import { SeccionResenas } from '../../components/SeccionResenas';

const STATS = [
  { value: '200+', label: 'Destinos', icon: MapPin },
  { value: '50K+', label: 'Turistas', icon: Users },
  { value: '14', label: 'Departamentos', icon: Globe },
  { value: '4.9', label: 'Calificación', icon: Star },
];

const FEATURES = [
  {
    icon: Compass,
    title: 'Exploración Inteligente',
    description: 'Encuentra destinos según tus preferencias, presupuesto y estilo de viaje con recommendations personalizadas.',
  },
  {
    icon: Shield,
    title: 'Información Verificada',
    description: 'Cada destino es verificado por nuestro equipo para garantizar datos precisos y experiencias auténticas.',
  },
  {
    icon: Globe,
    title: 'Acceso Global',
    description: 'Planifica tu viaje desde cualquier lugar del mundo con nuestra plataforma multilingüe y accesible.',
  },
  {
    icon: Sparkles,
    title: 'Experiencias Únicas',
    description: 'Descubre rutas ocultas, gastronomía local y actividades exclusivas que no encontrarás en otras guías.',
  },
];

const CATEGORIES = [
  { icon: Waves, name: 'Playas', count: 45 },
  { icon: Mountain, name: 'Volcanes', count: 23 },
  { icon: TreePine, name: 'Bosques', count: 38 },
  { icon: MapPin, name: 'Pueblos', count: 67 },
  { icon: Star, name: 'Ruinas', count: 15 },
  { icon: Compass, name: 'Aventura', count: 52 },
];

const TESTIMONIALS = [
  {
    name: 'María Fernández',
    origin: 'Guatemala',
    text: 'DescubreSV transformó mi viaje. Encontré lugares increíbles que jamás habría descubierto por mi cuenta.',
    rating: 5,
  },
  {
    name: 'James Thompson',
    origin: 'Estados Unidos',
    text: 'La mejor plataforma para planificar un viaje a El Salvador. Información precisa y destinos espectaculares.',
    rating: 5,
  },
  {
    name: 'Ana Lucía Reyes',
    origin: 'México',
    text: 'Me encanta la facilidad de uso. Pude organizar todo mi itinerario en minutos y disfrutar cada momento.',
    rating: 5,
  },
];

export const Home = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-background">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>La plataforma #1 de turismo salvadoreño</span>
          </div>
          <h1 className="hero-title">
            Descubre la magia de
            <span className="hero-title-gradient"> El Salvador</span>
          </h1>
          <p className="hero-subtitle">
            Explora volcanes majestuosos, playas paradisíacas y pueblos con siglos de
            history. Tu próxima aventura comienza aquí.
          </p>
          <div className="hero-actions">
            <Link to="/explore" className="btn-hero-primary">
              <span>Explorar Destinos</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/#features" className="btn-hero-secondary">
              <span>Conocer Más</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-container">
          <div className="stats-row">
            {STATS.map((stat) => (
              <div key={stat.label} className="landing-stat">
                <div className="landing-stat-icon">
                  <stat.icon size={20} />
                </div>
                <div className="landing-stat-value">{stat.value}</div>
                <div className="landing-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section" id="explore">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Categorías</span>
            <h2 className="section-title">Explora por tipo de destino</h2>
            <p className="section-description">
              Desde playas de arena volcánica hasta bosques nubosos, encuentra
              exactamente lo que buscas.
            </p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link to="/explore" key={cat.name} className="category-card">
                <div className="category-icon">
                  <cat.icon size={24} />
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-count">{cat.count} destinos</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Características</span>
            <h2 className="section-title">Todo lo que necesitas para tu viaje</h2>
            <p className="section-description">
              Herramientas diseñadas para hacer tu experiencia de viaje
              inolvidadle desde la planificación hasta el regreso.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={22} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section" id="about">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros viajeros</h2>
            <p className="section-description">
              Miles de turistas han confiado en DescubreSV para vivir
              experiencias únicas en El Salvador.
            </p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-origin">{t.origin}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECCIÓN DE COMENTARIOS VIVOS LIMPIA Y DINÁMICA */}
          <div style={{ marginTop: '50px' }}>
            <SeccionResenas />
          </div>

        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-orb" />
            <h2 className="cta-title">¿Listo para tu próxima aventura?</h2>
            <p className="cta-description">
              Únete a miles de viajeros que ya descubrieron lo mejor de
              El Salvador con nuestra plataforma.
            </p>
            <div className="cta-actions">
              <Link to="/explore" className="btn-hero-primary">
                <span>Comenzar Ahora</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};