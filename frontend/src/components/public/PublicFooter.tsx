import { Link } from 'react-router-dom';
import { Shield, MapPin, Mail, ExternalLink } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <Shield size={16} />
              </div>
              <span>DescubreSV</span>
            </div>
            <p className="footer-brand-desc">
              La plataforma definitiva para descubrir los destinos más
              impresionantes de El Salvador. Planifica tu aventura con
              herramientas inteligentes.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Navegación</h4>
            <Link to="/" className="footer-link">Inicio</Link>
            <Link to="/explore" className="footer-link">Explorar Destinos</Link>
            <Link to="/auth/login" className="footer-link">Iniciar Sesión</Link>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Destinos</h4>
            <span className="footer-link">Playas</span>
            <span className="footer-link">Volcanes</span>
            <span className="footer-link">Pueblos</span>
            <span className="footer-link">Ruinas</span>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Contacto</h4>
            <div className="footer-contact-item">
              <MapPin size={14} />
              <span>San Salvador, El Salvador</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} />
              <span>info@descubresv.com</span>
            </div>
            <div className="footer-contact-item">
              <ExternalLink size={14} />
              <span>github.com/descubresv</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} DescubreSV. Todos los derechos reservados.</span>
          <div className="footer-bottom-links">
            <span>Privacidad</span>
            <span className="footer-dot" />
            <span>Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
