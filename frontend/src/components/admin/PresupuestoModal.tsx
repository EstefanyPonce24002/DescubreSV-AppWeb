import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Save, DollarSign, Truck, Coffee, Ticket, Sparkles } from 'lucide-react';
import { presupuestoService, type PresupuestoResponse, type PresupuestoRequest } from '../../services/presupuestoService';
import { useNotification } from '../../context/NotificationContext';

interface PresupuestoModalProps {
  idItinerario: number;
  nombreItinerario: string;
  onClose: () => void;
}

export function PresupuestoModal({ idItinerario, nombreItinerario, onClose }: PresupuestoModalProps) {
  const { showNotification } = useNotification();
  const [presupuesto, setPresupuesto] = useState<PresupuestoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PresupuestoRequest>({
    idItinerario,
    costoTransporte: 0,
    costoAlimentacion: 0,
    costoEntrada: 0,
    costoOtros: 0,
    moneda: 'USD'
  });

  const fetchPresupuesto = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await presupuestoService.obtenerPorItinerario(idItinerario);
      if (response.success && response.data) {
        setPresupuesto(response.data);
        setFormData({
          idItinerario,
          costoTransporte: response.data.costoTransporte,
          costoAlimentacion: response.data.costoAlimentacion,
          costoEntrada: response.data.costoEntrada,
          costoOtros: response.data.costoOtros,
          moneda: response.data.moneda || 'USD'
        });
      } else {
        setPresupuesto(null);
        setFormData({
          idItinerario,
          costoTransporte: 0,
          costoAlimentacion: 0,
          costoEntrada: 0,
          costoOtros: 0,
          moneda: 'USD'
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('No se pudo cargar el presupuesto. Se creará uno nuevo al guardar.');
    } finally {
      setLoading(false);
    }
  }, [idItinerario]);

  useEffect(() => {
    fetchPresupuesto();
  }, [fetchPresupuesto]);

  const totalCalculado = useMemo(() => {
    const t = (formData.costoTransporte || 0);
    const a = (formData.costoAlimentacion || 0);
    const e = (formData.costoEntrada || 0);
    const o = (formData.costoOtros || 0);
    return t + a + e + o;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (presupuesto?.idPresupuesto) {
        await presupuestoService.actualizar(presupuesto.idPresupuesto, formData);
        showNotification('Presupuesto actualizado correctamente.', 'success');
      } else {
        await presupuestoService.guardar(formData);
        showNotification('Presupuesto creado correctamente.', 'success');
      }
      onClose();
    } catch (err: any) {
      showNotification('Error al guardar el presupuesto.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const percentages = useMemo(() => {
    const total = totalCalculado || 1;
    return {
      transporte: Math.round(((formData.costoTransporte || 0) / total) * 100),
      alimentacion: Math.round(((formData.costoAlimentacion || 0) / total) * 100),
      entrada: Math.round(((formData.costoEntrada || 0) / total) * 100),
      otros: Math.round(((formData.costoOtros || 0) / total) * 100)
    };
  }, [formData, totalCalculado]);

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} className="text-success" />
            Presupuesto: {nombreItinerario}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={20} /></button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="login-spinner" style={{ margin: '2rem auto' }} />
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={14} style={{ color: '#6366f1' }} />
                  Costo Transporte ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.costoTransporte}
                  onChange={e => setFormData({ ...formData, costoTransporte: Math.max(0, parseFloat(e.target.value) || 0) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Coffee size={14} style={{ color: '#f59e0b' }} />
                  Costo Alimentación ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.costoAlimentacion}
                  onChange={e => setFormData({ ...formData, costoAlimentacion: Math.max(0, parseFloat(e.target.value) || 0) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Ticket size={14} style={{ color: '#10b981' }} />
                  Costo Entradas ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.costoEntrada}
                  onChange={e => setFormData({ ...formData, costoEntrada: Math.max(0, parseFloat(e.target.value) || 0) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} style={{ color: '#a855f7' }} />
                  Otros Costos ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.costoOtros}
                  onChange={e => setFormData({ ...formData, costoOtros: Math.max(0, parseFloat(e.target.value) || 0) })}
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-body)', padding: '1.5rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-muted)' }}>Costo Total Estimado</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
                  ${totalCalculado.toFixed(2)} USD
                </span>
              </div>

              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'var(--border-color)' }}>
                <div style={{ width: `${percentages.transporte}%`, backgroundColor: '#6366f1' }} title={`Transporte: ${percentages.transporte}%`} />
                <div style={{ width: `${percentages.alimentacion}%`, backgroundColor: '#f59e0b' }} title={`Alimentación: ${percentages.alimentacion}%`} />
                <div style={{ width: `${percentages.entrada}%`, backgroundColor: '#10b981' }} title={`Entradas: ${percentages.entrada}%`} />
                <div style={{ width: `${percentages.otros}%`, backgroundColor: '#a855f7' }} title={`Otros: ${percentages.otros}%`} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'inline-block' }} />
                  <span>Transporte: {percentages.transporte}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                  <span>Alimentación: {percentages.alimentacion}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                  <span>Entradas: {percentages.entrada}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block' }} />
                  <span>Otros: {percentages.otros}%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : <><Save size={16} /><span>Guardar Presupuesto</span></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}