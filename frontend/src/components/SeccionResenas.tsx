import React, { useState, useEffect } from 'react';
import { useResenas } from '../hooks/useResenas';

interface Destino {
    idDestino: number;
    nombre: string;
}

export const SeccionResenas = () => {
    const [destinos, setDestinos] = useState<Destino[]>([]);
    const [destinoSeleccionado, setDestinoSeleccionado] = useState<number | ''>('');

    const [calificacion, setCalificacion] = useState<number>(5);
    const [comentario, setComentario] = useState<string>('');
    const [envioExitoso, setEnvioExitoso] = useState<boolean>(false);

    const { resenas, cargando, error, obtenerResenas, crearResena } = useResenas();

    // 🚀 Petición adaptada a la estructura exacta de tu backend Spring Boot
    useEffect(() => {
        const cargarDestinos = async () => {
            try {
                const respuesta = await fetch('http://localhost:8080/api/destinos');
                if (respuesta.ok) {
                    const datos = await respuesta.json();

                    // 🎯 Extraemos el array desde datos.data.contenido basado en tu consola
                    if (datos && datos.data && Array.isArray(datos.data.contenido)) {
                        const listaDestinos = datos.data.contenido;
                        setDestinos(listaDestinos);

                        if (listaDestinos.length > 0) {
                            setDestinoSeleccionado(listaDestinos[0].idDestino);
                        }
                    } else {
                        console.error("Estructura inesperada en el backend:", datos);
                    }
                }
            } catch (err) {
                console.error("Error al traer la lista de destinos:", err);
            }
        };
        cargarDestinos();
    }, []);

    useEffect(() => {
        if (destinoSeleccionado !== '') {
            obtenerResenas(Number(destinoSeleccionado));
        }
    }, [destinoSeleccionado]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comentario.trim() || destinoSeleccionado === '') return;

        const exito = await crearResena({
            calificacion,
            comentario,
            idDestino: Number(destinoSeleccionado),
            idUsuario: 1
        });

        if (exito) {
            setComentario('');
            setEnvioExitoso(true);
            setTimeout(() => setEnvioExitoso(false), 3000);
            obtenerResenas(Number(destinoSeleccionado));
        }
    };

    return (
        <div className="resenas-box" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#fff' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>Comentarios y Reseñas de Turistas</h3>

            <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e2230', padding: '24px', borderRadius: '8px', marginBottom: '30px' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Deja tu opinión</h4>

                {error && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</p>}
                {envioExitoso && <p style={{ color: '#10b981', marginBottom: '10px' }}>¡Reseña publicada con éxito!</p>}

                {/* 🎯 LISTA DESPLEGABLE CONECTADA */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>¿Qué destino deseas evaluar?</label>
                    <select
                        value={destinoSeleccionado}
                        onChange={(e) => setDestinoSeleccionado(e.target.value === '' ? '' : Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111420', color: '#fff', border: '1px solid #374151' }}
                    >
                        {!Array.isArray(destinos) || destinos.length === 0 ? (
                            <option value="">No hay destinos registrados en la base de datos...</option>
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
                    <label style={{ display: 'block', marginBottom: '5px' }}>Calificación:</label>
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
                    <label style={{ display: 'block', marginBottom: '5px' }}>Tu experiencia:</label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Cuéntanos sobre el clima, los precios, la comida..."
                        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '6px', backgroundColor: '#111420', color: '#fff', border: '1px solid #374151', resize: 'none' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={destinoSeleccionado === ''}
                    style={{ backgroundColor: destinoSeleccionado === '' ? '#4b5563' : '#0070f3', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: destinoSeleccionado === '' ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                    Publicar Reseña
                </button>
            </form>

            <div className="lista-comentarios">
                <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Lo que dicen otros visitantes</h4>
                {cargando ? (
                    <p>Cargando comentarios...</p>
                ) : !Array.isArray(resenas) || resenas.length === 0 ? (
                    <p style={{ color: '#9ca3af' }}>Este destino aún no tiene reseñas. ¡Sé el primero en comentar!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {resenas.map((r) => (
                            <div key={r.idResena} style={{ backgroundColor: '#1e2230', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0070f3' }}>
                                <div style={{ color: '#fbbf24', marginBottom: '5px' }}>{'⭐'.repeat(r.calificacion)}</div>
                                <p style={{ fontStyle: 'italic', marginBottom: '5px' }}>"{r.comentario}"</p>
                                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Asociado al Destino #{r.idDestino}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};