import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/explore', label: 'Explorar' },
    { to: '/#features', label: 'Características' },
    { to: '/#about', label: 'Nosotros' },
  ];

  return (
    <nav className={`public-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <Shield size={16} />
          </div>
          <span>DescubreSV</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar-links-cta">
            {isAuthenticated ? (
              <>
                {user?.rol === 'ADMIN' && (
                  <Link to="/admin" className="navbar-link" style={{ display: 'block', margin: '0.5rem 0' }}>
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="navbar-cta"
                  style={{ border: 'none', cursor: 'pointer', width: '100%', display: 'block' }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-cta" style={{ display: 'block' }}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div
              className="user-profile-menu"
              onClick={() => setShowDropdown(prev => !prev)}
              ref={dropdownRef}
              style={{ position: 'relative' }}
            >
              <div
                className="avatar"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {user?.nombre ? user.nombre[0].toUpperCase() : 'U'}
              </div>
              <ChevronDown size={14} className="user-profile-chevron" style={{ color: 'var(--text-secondary)' }} />
              {showDropdown && (
                <div className="dropdown-menu">
                  {user?.rol === 'ADMIN' && (
                    <Link to="/admin" className="dropdown-item">
                      <User size={14} />
                      <span>Panel Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="dropdown-item dropdown-item-danger"
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-cta navbar-cta-desktop">
              Iniciar Sesión
            </Link>
          )}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
