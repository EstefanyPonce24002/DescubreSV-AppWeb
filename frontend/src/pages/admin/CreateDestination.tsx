import { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Compass, MapPin, Grid, DollarSign,
  Calendar, Clock, Info, CheckCircle, AlertCircle, Image
} from 'lucide-react';
import { destinoService } from '../../services/destinoService';
import type { DestinoResponse } from '../../services/destinoService';
import { categoriaService } from '../../services/categoriaService';
import type { CategoriaResponse } from '../../services/categoriaService';

const DEPARTAMENTOS = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad',
  'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador',
  'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'
];

interface CreateDestinationProps {
  destinoToEdit?: DestinoResponse;
  onSave: () => void;
  onCancel: () => void;
}

export const CreateDestination = ({
  destinoToEdit,
  onSave,
  onCancel
}: CreateDestinationProps) => {
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nombre: destinoToEdit?.nombre || '',
    descripcion: destinoToEdit?.descripcion || '',
    departamento: destinoToEdit?.departamento || '',
    precioEntrada: destinoToEdit?.precioEntrada?.toString() || '0',
    horario: destinoToEdit?.horario || '',
    mejorEpoca: destinoToEdit?.mejorEpoca || '',
    tipo: destinoToEdit?.tipo || '',
    comoLlegarVehiculo: destinoToEdit?.comoLlegarVehiculo || '',
    comoLlegarBus: destinoToEdit?.comoLlegarBus || '',
    latitud: destinoToEdit?.latitud?.toString() || '',
    longitud: destinoToEdit?.longitud?.toString() || '',
    imagenUrl: destinoToEdit?.imagenUrl || '',
    idCategoria: destinoToEdit?.idCategoria?.toString() || '',
    activo: destinoToEdit?.activo ?? true
  });

  const isEditing = !!destinoToEdit;

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await categoriaService.listarActivasSinPaginar();
        if (response.success && response.data) {
          setCategories(response.data);
          if (!isEditing && response.data.length > 0) {
            setFormData(prev => ({ ...prev, idCategoria: response.data[0].idCategoria.toString() }));
          }
        }
      } catch (err) {
      }
    };
    fetchCats();
  }, [isEditing]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del destino es obligatorio.';
    }
    if (!formData.departamento) {
      newErrors.departamento = 'El departamento es obligatorio.';
    }
    if (!formData.idCategoria) {
      newErrors.idCategoria = 'La categoría es obligatoria.';
    }

    if (formData.latitud) {
      const latVal = Number(formData.latitud);
      if (isNaN(latVal) || latVal < -90 || latVal > 90) {
        newErrors.latitud = 'La latitud debe ser un número válido entre -90 y 90 (ej. 13.853245).';
      }
    }
    if (formData.longitud) {
      const lngVal = Number(formData.longitud);
      if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
        newErrors.longitud = 'La longitud debe ser un número válido entre -180 y 180 (ej. -89.624325).';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setError('Por favor completa los campos requeridos y corrige los errores.');
      setFieldErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        departamento: formData.departamento,
        precioEntrada: Number(formData.precioEntrada || 0),
        horario: formData.horario,
        mejorEpoca: formData.mejorEpoca,
        tipo: formData.tipo,
        comoLlegarVehiculo: formData.comoLlegarVehiculo,
        comoLlegarBus: formData.comoLlegarBus,
        latitud: formData.latitud ? Number(formData.latitud) : undefined,
        longitud: formData.longitud ? Number(formData.longitud) : undefined,
        imagenUrl: formData.imagenUrl,
        idCategoria: Number(formData.idCategoria),
        activo: formData.activo
      };

      if (isEditing && destinoToEdit) {
        await destinoService.actualizar(destinoToEdit.idDestino, payload);
      } else {
        await destinoService.crear(payload);
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err: any) {
      const responseData = err.response?.data;
      if (responseData && responseData.message === 'Errores de validacion' && responseData.data) {
        setError('Por favor corrige los errores de validación devueltos por el servidor.');
        setFieldErrors(responseData.data);
      } else {
        setError(responseData?.message || 'Error al guardar el destino turístico.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find(
    c => c.idCategoria.toString() === formData.idCategoria
  )?.nombreCategoria || 'Categoría';

  if (showSuccess) {
    return (
      <div className="create-user-page">
        <div className="create-user-success">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} />
          </div>
          <h2>{isEditing ? '¡Destino Actualizado Exitosamente!' : '¡Destino Creado Exitosamente!'}</h2>
          <p>El destino turístico <strong>{formData.nombre}</strong> ha sido guardado en el sistema.</p>
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
            <h1 className="page-title">{isEditing ? 'Editar Destino Turístico' : 'Crear Destino Turístico'}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Modifica los detalles del destino nacional' : 'Registra un nuevo atractivo de El Salvador'}
            </p>
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
                <span>Guardar Destino</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="create-user-layout">
        <div className="create-user-nav">
          <div className="section-nav-card preview-card" style={{ position: 'sticky', top: '100px' }}>
            <div className="preview-avatar-wrapper" style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
              {formData.imagenUrl ? (
                <img
                  src={formData.imagenUrl}
                  alt={formData.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="preview-avatar-large" style={{ width: '100%', height: '100%', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={32} />
                </div>
              )}
            </div>
            <div className="preview-name">{formData.nombre || 'Nombre del Destino'}</div>
            <div className="preview-role-badge">
              <span className="badge badge-info">{selectedCategoryName}</span>
            </div>
            {formData.departamento && (
              <div className="preview-detail">
                <MapPin size={13} />
                <span>{formData.departamento}, El Salvador</span>
              </div>
            )}
            <div className="preview-detail">
              <DollarSign size={13} />
              <span>Entrada: {Number(formData.precioEntrada || 0) === 0 ? 'Gratis' : `$${Number(formData.precioEntrada).toFixed(2)}`}</span>
            </div>
            {formData.tipo && (
              <div className="preview-detail">
                <Grid size={13} />
                <span>{formData.tipo}</span>
              </div>
            )}
          </div>
        </div>

        <form className="create-user-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-danger)',
              color: 'var(--color-danger)',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
              {Object.keys(fieldErrors).length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.825rem', listStyleType: 'disc' }}>
                  {Object.entries(fieldErrors).map(([key, val]) => (
                    <li key={key}>{val}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="form-section-header">
            <div className="form-section-icon">
              <Compass size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Información General</h2>
              <p className="form-section-subtitle">Identidad del destino y clasificación</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Nombre del Destino <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  required
                  className={`form-input ${fieldErrors.nombre ? 'form-input-error' : ''}`}
                  placeholder="Ej: Volcán de Santa Ana"
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                />
              </div>
              {fieldErrors.nombre && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.nombre}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Tipo de Destino</label>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  className={`form-input ${fieldErrors.tipo ? 'form-input-error' : ''}`}
                  placeholder="Ej: Montaña, Playa, Ecoturismo"
                  value={formData.tipo}
                  onChange={(e) => updateField('tipo', e.target.value)}
                />
              </div>
              {fieldErrors.tipo && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.tipo}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Departamento <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <select
                  required
                  className={`form-input form-select ${fieldErrors.departamento ? 'form-input-error' : ''}`}
                  value={formData.departamento}
                  onChange={(e) => updateField('departamento', e.target.value)}
                >
                  <option value="">Seleccionar departamento</option>
                  {DEPARTAMENTOS.map(depto => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.departamento && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.departamento}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                Categoría <span className="form-required">*</span>
              </label>
              <div className="form-input-wrapper">
                <select
                  required
                  className={`form-input form-select ${fieldErrors.idCategoria ? 'form-input-error' : ''}`}
                  value={formData.idCategoria}
                  onChange={(e) => updateField('idCategoria', e.target.value)}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombreCategoria}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.idCategoria && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.idCategoria}
                </span>
              )}
            </div>
          </div>

          <div className="filter-divider" style={{ margin: '1rem 0', opacity: 0.1 }} />

          <div className="form-section-header">
            <div className="form-section-icon">
              <Info size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Detalles del Destino</h2>
              <p className="form-section-subtitle">Horarios, costos de entrada y multimedia</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Precio Entrada (USD)</label>
              <div className="form-input-wrapper">
                <DollarSign size={16} className="form-input-icon" />
                <input
                  type="number"
                  className={`form-input form-input-with-icon ${fieldErrors.precioEntrada ? 'form-input-error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.precioEntrada}
                  onChange={(e) => updateField('precioEntrada', e.target.value)}
                />
              </div>
              {fieldErrors.precioEntrada && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.precioEntrada}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Horario de Atención</label>
              <div className="form-input-wrapper">
                <Clock size={16} className="form-input-icon" />
                <input
                  type="text"
                  className={`form-input form-input-with-icon ${fieldErrors.horario ? 'form-input-error' : ''}`}
                  placeholder="Ej: Lunes a Domingo 8:00 AM - 4:00 PM"
                  value={formData.horario}
                  onChange={(e) => updateField('horario', e.target.value)}
                />
              </div>
              {fieldErrors.horario && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.horario}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Mejor Época para Visitar</label>
              <div className="form-input-wrapper">
                <Calendar size={16} className="form-input-icon" />
                <input
                  type="text"
                  className={`form-input form-input-with-icon ${fieldErrors.mejorEpoca ? 'form-input-error' : ''}`}
                  placeholder="Ej: Noviembre a Febrero (Clima seco)"
                  value={formData.mejorEpoca}
                  onChange={(e) => updateField('mejorEpoca', e.target.value)}
                />
              </div>
              {fieldErrors.mejorEpoca && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.mejorEpoca}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">URL de la Imagen</label>
              <div className="form-input-wrapper">
                <Image size={16} className="form-input-icon" />
                <input
                  type="text"
                  className={`form-input form-input-with-icon ${fieldErrors.imagenUrl ? 'form-input-error' : ''}`}
                  placeholder="Ej: https://imagenes.com/mi-destino.jpg"
                  value={formData.imagenUrl}
                  onChange={(e) => updateField('imagenUrl', e.target.value)}
                />
              </div>
              {fieldErrors.imagenUrl && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.imagenUrl}
                </span>
              )}
            </div>
          </div>

          <div className="filter-divider" style={{ margin: '1rem 0', opacity: 0.1 }} />

          <div className="form-section-header">
            <div className="form-section-icon">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Geolocalización</h2>
              <p className="form-section-subtitle">Coordenadas del destino para el mapa</p>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Latitud</label>
              <div className="form-input-wrapper">
                <input
                  type="number"
                  step="0.0000001"
                  className={`form-input ${fieldErrors.latitud ? 'form-input-error' : ''}`}
                  placeholder="Ej: 13.853245"
                  value={formData.latitud}
                  onChange={(e) => updateField('latitud', e.target.value)}
                />
              </div>
              {fieldErrors.latitud && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.latitud}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Longitud</label>
              <div className="form-input-wrapper">
                <input
                  type="number"
                  step="0.0000001"
                  className={`form-input ${fieldErrors.longitud ? 'form-input-error' : ''}`}
                  placeholder="Ej: -89.624325"
                  value={formData.longitud}
                  onChange={(e) => updateField('longitud', e.target.value)}
                />
              </div>
              {fieldErrors.longitud && (
                <span className="form-error">
                  <AlertCircle size={13} />
                  {fieldErrors.longitud}
                </span>
              )}
            </div>
          </div>

          <div className="filter-divider" style={{ margin: '1rem 0', opacity: 0.1 }} />

          <div className="form-section-header">
            <div className="form-section-icon">
              <Info size={20} />
            </div>
            <div>
              <h2 className="form-section-title">Cómo Llegar y Descripción</h2>
              <p className="form-section-subtitle">Instrucciones de ruta y detalles adicionales</p>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Cómo Llegar en Vehículo</label>
            <div className="form-input-wrapper" style={{ minHeight: '80px' }}>
              <textarea
                className={`form-input ${fieldErrors.comoLlegarVehiculo ? 'form-input-error' : ''}`}
                placeholder="Ruta y estado de calles para llegar en auto propio..."
                style={{ height: '80px', padding: '0.75rem', resize: 'vertical' }}
                value={formData.comoLlegarVehiculo}
                onChange={(e) => updateField('comoLlegarVehiculo', e.target.value)}
              />
            </div>
            {fieldErrors.comoLlegarVehiculo && (
              <span className="form-error">
                <AlertCircle size={13} />
                {fieldErrors.comoLlegarVehiculo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Cómo Llegar en Autobús</label>
            <div className="form-input-wrapper" style={{ minHeight: '80px' }}>
              <textarea
                className={`form-input ${fieldErrors.comoLlegarBus ? 'form-input-error' : ''}`}
                placeholder="Números de rutas de bus, terminales y transbordos..."
                style={{ height: '80px', padding: '0.75rem', resize: 'vertical' }}
                value={formData.comoLlegarBus}
                onChange={(e) => updateField('comoLlegarBus', e.target.value)}
              />
            </div>
            {fieldErrors.comoLlegarBus && (
              <span className="form-error">
                <AlertCircle size={13} />
                {fieldErrors.comoLlegarBus}
              </span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Descripción General</label>
            <div className="form-input-wrapper" style={{ minHeight: '120px' }}>
              <textarea
                className={`form-input ${fieldErrors.descripcion ? 'form-input-error' : ''}`}
                placeholder="Descripción detallada de la belleza, clima e historia del destino..."
                style={{ height: '120px', padding: '0.75rem', resize: 'vertical' }}
                value={formData.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
              />
            </div>
            {fieldErrors.descripcion && (
              <span className="form-error">
                <AlertCircle size={13} />
                {fieldErrors.descripcion}
              </span>
            )}
          </div>

          <div className="form-toggles">
            <label className="form-toggle">
              <div className="form-toggle-info">
                <span className="form-toggle-label">Destino Habilitado</span>
                <span className="form-toggle-desc">El destino estará visible inmediatamente en la app móvil</span>
              </div>
              <div
                className={`toggle-switch ${formData.activo ? 'active' : ''}`}
                onClick={() => updateField('activo', !formData.activo)}
              >
                <div className="toggle-switch-thumb" />
              </div>
            </label>
          </div>

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
                className="btn-primary btn-save"
                disabled={isSubmitting}
              >
                <Save size={16} />
                <span>Guardar Destino</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
