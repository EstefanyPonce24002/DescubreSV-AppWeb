import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { itinerarioService, type ItinerarioRequest, type ItinerarioResponse } from '../../services/itinerarioService';
import { useNotification } from '../../context/NotificationContext';

interface CreateItinerarioProps {
  itinerarioToEdit?: ItinerarioResponse;
  onSave: () => void;
  onCancel: () => void;
}

export function CreateItinerario({ itinerarioToEdit, onSave, onCancel }: CreateItinerarioProps) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState<ItinerarioRequest>({
    idUsuario: 1, // Nota: Idealmente obtener del AuthContext
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
    duracion: 1,
    presupuestoCategoria: 'Moderado',
    tipoExperiencia: 'Aventura',
    tipoGrupo: 'Pareja',
    modoPlanificacion: 'Manual',
    activo: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itinerarioToEdit) {
      setFormData({
        idUsuario: itinerarioToEdit.usuarioId,
        nombre: itinerarioToEdit.nombre,
        fechaInicio: itinerarioToEdit.fechaInicio || '',
        fechaFin: itinerarioToEdit.fechaFin || '',
        duracion: itinerarioToEdit.duracion || 1,
        presupuestoCategoria: itinerarioToEdit.presupuestoCategoria || 'Moderado',
        tipoExperiencia: itinerarioToEdit.tipoExperiencia || '',
        tipoGrupo: itinerarioToEdit.tipoGrupo || '',
        modoPlanificacion: itinerarioToEdit.modoPlanificacion || 'Manual',
        activo: itinerarioToEdit.activo
      });
    }
  }, [itinerarioToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (itinerarioToEdit) {
        await itinerarioService.actualizar(itinerarioToEdit.idItinerario, formData);
        showNotification('Itinerario actualizado exitosamente.', 'success');
      } else {
        await itinerarioService.crear(formData);
        showNotification('Itinerario creado exitosamente.', 'success');
      }
      onSave();
    } catch (error) {
      showNotification('Error al guardar el itinerario. Verifique los datos.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-ghost" onClick={onCancel} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">{itinerarioToEdit ? 'Editar Itinerario' : 'Nuevo Itinerario'}</h1>
            <p className="page-subtitle">Paso 1: Defina los datos base del viaje</p>
          </div>
        </div>
      </div>

      <div className="create-form-container" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nombre del Viaje *</label>
              <input type="text" className="form-input" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Inicio</label>
              <input type="date" className="form-input" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Fin</label>
              <input type="date" className="form-input" value={formData.fechaFin} onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría Presupuesto</label>
              <select className="form-input form-select" value={formData.presupuestoCategoria} onChange={(e) => setFormData({ ...formData, presupuestoCategoria: e.target.value })}>
                <option value="Económico">Económico</option>
                <option value="Moderado">Moderado</option>
                <option value="Lujo">Lujo</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Experiencia</label>
              <input type="text" className="form-input" placeholder="Ej. Aventura, Relax, Cultural" value={formData.tipoExperiencia} onChange={(e) => setFormData({ ...formData, tipoExperiencia: e.target.value })} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <input type="checkbox" id="activo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />
              <label htmlFor="activo" className="form-label" style={{ marginBottom: 0 }}>Marcar como Activo</label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : <><Save size={16} /><span>Guardar Itinerario</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}