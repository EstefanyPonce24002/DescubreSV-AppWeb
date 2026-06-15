import { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin } from 'lucide-react';
import { itinerarioDestinoService, type ItinerarioDestinoResponse, type ItinerarioDestinoRequest } from '../../services/itinerarioDestinoService';
import { destinoService, type DestinoResponse } from '../../services/destinoService';
import { useNotification } from '../../context/NotificationContext';

interface DestinosItinerarioModalProps {
  idItinerario: number;
  nombreItinerario: string;
  onClose: () => void;
}

export function DestinosItinerarioModal({ idItinerario, nombreItinerario, onClose }: DestinosItinerarioModalProps) {
  const { showNotification } = useNotification();
  const [destinosAsignados, setDestinosAsignados] = useState<ItinerarioDestinoResponse[]>([]);
  const [destinosDisponibles, setDestinosDisponibles] = useState<DestinoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ItinerarioDestinoRequest>({
    idItinerario,
    idDestino: 0,
    diaNumero: 1,
    orden: 1,
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [idItinerario]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [asignadosRes, disponiblesRes] = await Promise.all([
        itinerarioDestinoService.obtenerPorItinerario(idItinerario),
        destinoService.listarAdmin(0, 100) // Traemos destinos para el Select
      ]);

      if (asignadosRes.success && asignadosRes.data) {
        // Ordenamos por día y luego por orden de visita
        const ordenados = asignadosRes.data.sort((a, b) => a.diaNumero - b.diaNumero || a.orden - b.orden);
        setDestinosAsignados(ordenados);
      }
      if (disponiblesRes.success && disponiblesRes.data) {
        setDestinosDisponibles(disponiblesRes.data.contenido);
        if (disponiblesRes.data.contenido.length > 0) {
          setFormData(prev => ({ ...prev, idDestino: disponiblesRes.data.contenido[0].idDestino }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idDestino === 0) return;
    setIsSubmitting(true);
    try {
      await itinerarioDestinoService.agregarDestino(formData);
      showNotification('Destino agregado a la ruta con éxito.', 'success');
      await cargarDatos();
      setFormData(prev => ({ ...prev, orden: prev.orden + 1, notas: '' }));
    } catch (error) {
      showNotification('Error al vincular el destino. Recuerde que no puede agregar el mismo destino dos veces.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (idDestino: number) => {
    if (confirm('¿Quitar este destino de la ruta?')) {
      try {
        await itinerarioDestinoService.eliminarDestino(idItinerario, idDestino);
        showNotification('Destino quitado de la ruta.', 'info');
        cargarDatos();
      } catch (err) {
        showNotification('Error al eliminar el destino de la ruta.', 'error');
      }
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} className="text-primary" />
            Ruta: {nombreItinerario}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={20} /></button>
        </div>

        <div style={{ background: 'var(--bg-body)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Agregar Parada al Viaje</h3>
          <form onSubmit={handleAgregar} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Destino Turístico</label>
              <select className="form-input form-select" value={formData.idDestino} onChange={e => setFormData({...formData, idDestino: Number(e.target.value)})}>
                {destinosDisponibles.map(d => (
                  <option key={d.idDestino} value={d.idDestino}>{d.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Día del Viaje</label>
              <input type="number" min="1" className="form-input" value={formData.diaNumero} onChange={e => setFormData({...formData, diaNumero: Number(e.target.value)})} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Orden</label>
              <input type="number" min="1" className="form-input" value={formData.orden} onChange={e => setFormData({...formData, orden: Number(e.target.value)})} />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '0.6rem 1rem', height: '100%' }}>
              <Plus size={18} />
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="login-spinner" style={{ margin: '2rem auto' }} />
        ) : destinosAsignados.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 0' }}>
            <MapPin size={30} style={{ color: 'var(--color-muted)', marginBottom: '1rem' }} />
            <p>La ruta está vacía. Agregue el primer destino.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {destinosAsignados.map((item) => (
              <div key={`${item.idItinerario}-${item.idDestino}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-body)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', minWidth: '60px' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Día {item.diaNumero}</span>
                    <span style={{ fontWeight: 'bold' }}>#{item.orden}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.destino?.nombre || 'Destino Desconocido'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{item.destino?.departamento || ''}</div>
                  </div>
                </div>
                <button onClick={() => handleEliminar(item.idDestino)} className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--color-danger)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}