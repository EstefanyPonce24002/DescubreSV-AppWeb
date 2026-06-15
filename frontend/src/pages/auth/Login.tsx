import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    try {
      const authData = await login({ correo, password });
      if (authData.rol === 'ADMIN') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Credenciales inválidas');
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

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Shield size={22} />
            </div>
            <h1 className="login-title">DescubreSV</h1>
            <p className="login-subtitle">Ingresa a tu cuenta de DescubreSV</p>
          </div>

          {localError && (
            <div className="mb-4 p-3 rounded bg-red-950/40 border border-red-800 text-red-200 text-sm text-center">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
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
                  placeholder="admin@descubresv.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Contraseña</label>
                <button type="button" className="login-forgot">¿Olvidaste tu contraseña?</button>
              </div>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>¿No tienes cuenta? </span>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Regístrate aquí
            </button>
          </div>

          <div className="login-footer">
            <span>Sistema de gestión</span>
            <span className="login-footer-dot" />
            <span>DescubreSV © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
