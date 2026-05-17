import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/users');
    }, 800);
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
            <p className="login-subtitle">Ingresa a tu cuenta de administrador</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Correo Electrónico</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  required
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
