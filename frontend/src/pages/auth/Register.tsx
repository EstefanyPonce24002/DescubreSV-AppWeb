import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Globe, DollarSign, Compass, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NACIONALIDADES = [
  'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica',
  'Panamá', 'México', 'Estados Unidos', 'Canadá', 'España', 'Otro'
];

export const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nacionalidad, setNacionalidad] = useState('El Salvador');
  const [presupuestoEstimado, setPresupuestoEstimado] = useState('');
  const [preferencias, setPreferencias] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const errors: string[] = [];

    if (nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      errors.push('El formato del correo electrónico no es válido.');
    }
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres.');
    }
    if (presupuestoEstimado && Number(presupuestoEstimado) < 0) {
      errors.push('El presupuesto estimado no puede ser negativo.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        nombre,
        correo,
        password,
        nacionalidad,
        presupuestoEstimado: presupuestoEstimado ? Number(presupuestoEstimado) : undefined,
        preferencias: preferencias.trim() || undefined
      });
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <div className="login-container" style={{ maxWidth: '480px' }}>
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo" style={{ backgroundColor: 'var(--primary-glow)' }}>
              <Compass size={22} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h1 className="login-title">Registrarse</h1>
            <p className="login-subtitle">Crea tu cuenta de Turista en DescubreSV</p>
          </div>

          {validationErrors.length > 0 && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-text)', color: 'var(--status-danger-text)', fontSize: '0.8125rem' }}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {validationErrors.map((err, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {apiError && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-text)', color: 'var(--status-danger-text)', fontSize: '0.8125rem', textAlign: 'center' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Nombre Completo</label>
              <div className="login-input-wrapper">
                <User size={16} className="login-input-icon" />
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="login-input"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Correo Electrónico</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="login-input"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="login-field">
                <label className="login-label">Nacionalidad</label>
                <div className="login-input-wrapper">
                  <Globe size={16} className="login-input-icon" />
                  <select
                    value={nacionalidad}
                    onChange={(e) => setNacionalidad(e.target.value)}
                    className="login-input"
                    style={{ paddingLeft: '2.5rem', appearance: 'none', background: 'var(--app-bg)' }}
                  >
                    {NACIONALIDADES.map((nac) => (
                      <option key={nac} value={nac} style={{ background: 'var(--card-bg)' }}>{nac}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Presupuesto ($)</label>
                <div className="login-input-wrapper">
                  <DollarSign size={16} className="login-input-icon" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={presupuestoEstimado}
                    onChange={(e) => setPresupuestoEstimado(e.target.value)}
                    className="login-input"
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Preferencias de Viaje</label>
              <div className="login-input-wrapper">
                <Compass size={16} className="login-input-icon" />
                <input
                  type="text"
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                  className="login-input"
                  placeholder="Ej: Playas, Caminata, Arqueología"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`login-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              style={{ marginTop: '1.5rem' }}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>¿Ya tienes cuenta? </span>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Inicia sesión aquí
            </button>
          </div>

          <div className="login-footer">
            <span>Explora El Salvador</span>
            <span className="login-footer-dot" />
            <span>DescubreSV © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
