import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { destinoService, type DestinoResponse } from '../services/destinoService';
import { resenaService, type ResenaResponse } from '../services/resenaService';

export const SeccionResenas = () => {
  const { isAuthenticated, user } = useAuth();
  const [destinos, setDestinos] = useState<DestinoResponse[]>([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<number | ''>('');
  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [resenas, setResenas] = useState<ResenaResponse[]>([]);
  
  const [cargando, setCargando] = useState<boolean>(false);
  const [envioExitoso, setEnvioExitoso] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDestinos = async () => {
    try {
      const response = await destinoService.listarPublicos(0, 50);
      if (response.success && response.data && response.data.contenido) {
        setDestinos(response.data.contenido);
        if (response.data.contenido.length > 0) {
          setDestinoSeleccionado(response.data.contenido[0].idDestino);
        }
      }
    } catch {
    }
  };

  const cargarResenas = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      const response = await resenaService.listarPorDestino(id, 0, 20);
      if (response.success && response.data) {
        setResenas(response.data.contenido);
      }
    } catch {
      setError('Error al obtener reseñas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  useEffect(() => {
    if (destinoSeleccionado !== '') {
      cargarResenas(Number(destinoSeleccionado));
    }
  }, [destinoSeleccionado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnvioExitoso(false);

    if (destinoSeleccionado === '') return;

    if (!comentario.trim()) {
      setError('Por favor escribe tu reseña antes de enviar.');
      return;
    }

    try {
      const response = await resenaService.crear({
        idDestino: Number(destinoSeleccionado),
        calificacion,
        comentario: comentario.trim()
      });

      if (response.success) {
        setComentario('');
        setEnvioExitoso(true);
        setTimeout(() => setEnvioExitoso(false), 3000);
        cargarResenas(Number(destinoSeleccionado));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar la reseña.');
    }
  };

  const handleDelete = async (idResena: number) => {
    if (window.confirm('¿Seguro que deseas eliminar tu reseña?')) {
      try {
        await resenaService.eliminar(idResena);
        if (destinoSeleccionado !== '') {
          cargarResenas(Number(destinoSeleccionado));
        }
      } catch {
        setError('No se pudo eliminar la reseña.');
      }
    }
  };

  return (
    <div className="resenas-box" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>Comentarios y Reseñas de Turistas</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="responsive-resenas-layout">
        <div>
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e2230', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Deja tu opinión</h4>

            {error && <p style={{ color: '#f87171', marginBottom: '10px', fontSize: '0.875rem' }}>{error}</p>}
            {envioExitoso && <p style={{ color: '#34d399', marginBottom: '10px', fontSize: '0.875rem' }}>¡Reseña publicada con éxito!</p>}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>¿Qué destino deseas evaluar?</label>
              <select
                value={destinoSeleccionado}
                onChange={(e) => setDestinoSeleccionado(e.target.value === '' ? '' : Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111420', color: '#fff', border: '1px solid #374151' }}
              >
                {destinos.length === 0 ? (
                  <option value="">Cargando destinos...</option>
                ) : (
                  destinos.map((dest) => (
                    <option key={dest.idDestino} value={dest.idDestino}>
                      {dest.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Calificación:</label>
              <select
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111420', color: '#fff', border: '1px solid #374151' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (Excelente)</option>
                <option value={4}>⭐⭐⭐⭐ (Muy Bueno)</option>
                <option value={3}>⭐⭐⭐ (Regular)</option>
                <option value={2}>⭐⭐ (Malo)</option>
                <option value={1}>⭐ (Pésimo)</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tu experiencia:</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos sobre el clima, los precios, la comida..."
                style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '6px', backgroundColor: '#111420', color: '#fff', border: '1px solid #374151', resize: 'none' }}
              />
            </div>

            {isAuthenticated && user?.rol === 'TURISTA' ? (
              <button
                type="submit"
                disabled={destinoSeleccionado === ''}
                style={{ width: '100%', backgroundColor: destinoSeleccionado === '' ? '#4b5563' : 'var(--primary-color)', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: destinoSeleccionado === '' ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}
              >
                Publicar Reseña
              </button>
            ) : (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '6px', color: '#fbbf24', fontSize: '0.8125rem', textAlign: 'center' }}>
                Debes iniciar sesión como turista para poder publicar reseñas.
              </div>
            )}
          </form>
        </div>

        <div className="lista-comentarios" style={{ marginTop: '1rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Lo que dicen otros visitantes</h4>
          {cargando ? (
            <p style={{ color: 'var(--text-muted)' }}>Cargando opiniones...</p>
          ) : resenas.length === 0 ? (
            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Este destino aún no tiene reseñas. ¡Sé el primero en comentar!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {resenas.map((r) => (
                <div key={r.idResena} style={{ backgroundColor: '#1e2230', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.nombreUsuario}</span>
                    {isAuthenticated && user && user.idUsuario === r.idUsuario && (
                      <button onClick={() => handleDelete(r.idResena)} style={{ color: 'var(--status-danger-text)', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    )}
                  </div>
                  <div style={{ color: '#fbbf24', margin: '5px 0' }}>
                    {'★'.repeat(r.calificacion)}
                    {'☆'.repeat(5 - r.calificacion)}
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>"{r.comentario}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};