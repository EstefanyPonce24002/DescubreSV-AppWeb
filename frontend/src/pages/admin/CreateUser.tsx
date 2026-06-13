import { useState } from 'react';
import {
  ArrowLeft, User, Mail, Lock, Eye, EyeOff, Globe, Shield,
  DollarSign, Save, X, UserPlus, Camera, MapPin,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PAISES = [
  'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica',
  'Panamá', 'México', 'Estados Unidos', 'Colombia', 'España',
  'Argentina', 'Chile', 'Perú', 'Brasil', 'Canadá', 'Otro'
];

interface UserData {
  nombre?: string;
  correo?: string;
  nacionalidad?: string;
  presupuestoEstimado?: number;
  rol?: string;
  activo?: boolean;
}

interface FormData {
  nombre: string;
  correo: string;
  nacionalidad: string;
  presupuesto_estimado: string;
  rol: string;
  password: string;
  confirmPassword: string;
  activo: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const CreateUser = ({
  userToEdit,
  onSave,
  onCancel
}: {
  userToEdit?: UserData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const { user: currentUser } = useAuth();
  const isCurrentUserAdmin = currentUser?.rol === 'ADMIN';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    nombre: userToEdit?.nombre || '',
    correo: userToEdit?.correo || '',
    nacionalidad: userToEdit?.nacionalidad || '',
    presupuesto_estimado: userToEdit?.presupuestoEstimado?.toString() || '',
    rol: userToEdit?.rol || 'TURISTA',
    password: '',
    confirmPassword: '',
    activo: userToEdit?.activo ?? true
  });

  const isEditing = !!userToEdit;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }
    if (!isEditing && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors(prev => {
      const next = { ...prev };
      delete next.submit;
      return next;
    });

    try {
      await onSave(formData);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      const msg = err.response?.data?.message || err.message || 'Error al guardar el usuario';
      setErrors(prev => ({ ...prev, submit: msg }));
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 1) return { level: 1, label: 'Débil', color: 'var(--status-danger-text)' };
    if (score <= 2) return { level: 2, label: 'Regular', color: 'var(--status-warning-text)' };
    if (score <= 3) return { level: 3, label: 'Buena', color: 'var(--status-info-text)' };
    return { level: 4, label: 'Fuerte', color: 'var(--status-success-text)' };
  };

  const passwordStrength = getPasswordStrength();

  if (showSuccess) {
    return (
      <div className="create-user-page">
        <div className="create-user-success">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} />
          </div>
          <h2>{isEditing ? '¡Usuario Actualizado Exitosamente!' : '¡Usuario Creado Exitosamente!'}</h2>
          <p>El usuario {formData.nombre} ha sido {isEditing ? 'actualizado' : 'registrado'} en el sistema.</p>
          <span className="success-email-note">
            <Mail size={14} />
            Cuenta registrada con {formData.correo}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="create-user-page">
      <div className="create-user-header">
        <div className="create-user-header-left">
          <button className="btn-back" onClick={onCancel}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h1>
            <p className="page-subtitle">{isEditing ? 'Modifica los datos del usuario seleccionado' : 'Registra un nuevo usuario en la plataforma DescubreSV'}</p>
          </div>
        </div>
        <div className="create-user-header-actions">
          <button className="btn-outline" onClick={onCancel}>
            <X size={16} />
            <span>Cancelar</span>
          </button>
          <button
            className={`btn-primary btn-save ${isSubmitting ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="btn-spinner" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="create-user-layout">
        <div className="create-user-nav">
          <div className="section-nav-card preview-card" style={{ position: 'sticky', top: '100px' }}>
            <div className="preview-avatar-wrapper">
              <div className="preview-avatar-large">
                {formData.nombre ? (
                  <span>{formData.nombre[0].toUpperCase()}</span>
                ) : (
                  <Camera size={24} />
                )}
              </div>
              {formData.nombre && (
                <div className="preview-status-dot" />
              )}
            </div>
            <div className="preview-name">
              {formData.nombre || 'Nuevo Usuario'}
            </div>
            <div className="preview-role-badge">
              <span className={`badge ${formData.rol === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                {formData.rol}
              </span>
            </div>
            {formData.correo && (
              <div className="preview-detail">
                <Mail size={13} />
                <span>{formData.correo}</span>
              </div>
            )}
            {formData.nacionalidad && (
              <div className="preview-detail">
                <MapPin size={13} />
                <span>{formData.nacionalidad}</span>
              </div>
            )}
            {formData.presupuesto_estimado && (
              <div className="preview-detail">
                <DollarSign size={13} />
                <span>${Number(formData.presupuesto_estimado).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
        </div>

        <form className="create-user-form" onSubmit={handleSubmit}>
          
          <div className="form-section-header">
            <div className="form-section-icon">
              <User size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Información Personal</h2>
              <p className="form-section-subtitle">Datos básicos de identificación del usuario</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Nombre Completo <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <User size={16} className="form-input-icon" />
                <input
                  type="text"
                  className={`form-input form-input-with-icon ${errors.nombre ? 'form-input-error' : ''}`}
                  placeholder="Ej: Daniel Ramírez"
                  maxLength={100}
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                />
              </div>
              {errors.nombre && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {errors.nombre}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                Correo Electrónico <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <Mail size={16} className="form-input-icon" />
                <input
                  type="email"
                  className={`form-input form-input-with-icon ${errors.correo ? 'form-input-error' : ''}`}
                  placeholder="usuario@ejemplo.com"
                  maxLength={150}
                  value={formData.correo}
                  onChange={(e) => updateField('correo', e.target.value)}
                />
              </div>
              {errors.correo && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {errors.correo}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Nacionalidad</label>
              <div className="form-input-wrapper">
                <Globe size={16} className="form-input-icon" />
                <select
                  className="form-input form-input-with-icon form-select"
                  value={formData.nacionalidad}
                  onChange={(e) => updateField('nacionalidad', e.target.value)}
                >
                  <option value="">Seleccionar país</option>
                  {PAISES.map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Presupuesto Estimado (USD)</label>
              <div className="form-input-wrapper">
                <DollarSign size={16} className="form-input-icon" />
                <input
                  type="number"
                  className="form-input form-input-with-icon"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.presupuesto_estimado}
                  onChange={(e) => updateField('presupuesto_estimado', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="filter-divider" style={{ margin: '1rem 0', opacity: 0.1 }} />

          <div className="form-section-header">
            <div className="form-section-icon">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Cuenta y Acceso</h2>
              <p className="form-section-subtitle">Configuración de credenciales y permisos</p>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Rol del Usuario</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${formData.rol === 'TURISTA' ? 'active' : ''}`}
                onClick={() => updateField('rol', 'TURISTA')}
              >
                <Globe size={20} />
                <div className="role-option-text">
                  <span className="role-option-name">Turista</span>
                  <span className="role-option-desc">Acceso a explorar destinos y recursos</span>
                </div>
              </button>
              {isCurrentUserAdmin && (
                <button
                  type="button"
                  className={`role-option ${formData.rol === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => updateField('rol', 'ADMIN')}
                >
                  <Shield size={20} />
                  <div className="role-option-text">
                    <span className="role-option-name">Administrador</span>
                    <span className="role-option-desc">Gestión completa de la plataforma</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Contraseña {!isEditing && <span className="form-required">*</span>}
                {isEditing && <span className="form-label-hint" style={{marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-secondary)'}}>(Dejar en blanco para mantener actual)</span>}
              </label>
              <div className="form-input-wrapper">
                <Lock size={16} className="form-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input form-input-with-icon form-input-password ${errors.password ? 'form-input-error' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="password-strength-segment"
                        style={{
                          backgroundColor: level <= passwordStrength.level
                            ? passwordStrength.color
                            : 'rgba(255,255,255,0.06)'
                        }}
                      />
                    ))}
                  </div>
                  <span className="password-strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                Confirmar Contraseña {!isEditing && <span className="form-required">*</span>}
              </label>
              <div className="form-input-wrapper">
                <Lock size={16} className="form-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input form-input-with-icon form-input-password ${errors.confirmPassword ? 'form-input-error' : ''}`}
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <div className="form-toggles">
            <label className="form-toggle">
              <div className="form-toggle-info">
                <span className="form-toggle-label">Cuenta Activa</span>
                <span className="form-toggle-desc">El usuario podrá iniciar sesión inmediatamente</span>
              </div>
              <div
                className={`toggle-switch ${formData.activo ? 'active' : ''}`}
                onClick={() => updateField('activo', !formData.activo)}
              >
                <div className="toggle-switch-thumb" />
              </div>
            </label>
          </div>

          {errors.submit && (
            <div className="form-error submit-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-danger-text)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="form-footer">
            <div className="form-footer-left">
              <span className="form-footer-hint">
                <AlertCircle size={14} />
                Los campos marcados con <span className="form-required">*</span> son obligatorios
              </span>
            </div>
            <div className="form-footer-actions">
              <button type="button" className="btn-outline" onClick={onCancel}>
                <X size={16} />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className={`btn-primary btn-save ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>{isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};