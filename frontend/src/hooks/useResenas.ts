import { useState, useCallback } from 'react';

// Definimos la estructura de la reseña según tu backend
interface Resena {
    idResena: number;
    calificacion: number;
    comentario: string;
    idDestino: number;
    idUsuario: number;
}

interface CrearResenaDTO {
    calificacion: number;
    comentario: string;
    idDestino: number;
    idUsuario: number;
}

export const useResenas = () => {
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 🎯 CLAVE: Usamos useCallback para que la función mantenga su referencia en memoria
    // Esto evita que SeccionResenas entre en un bucle infinito al renderizar
    const obtenerResenas = useCallback(async (idDestino: number) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await fetch(`http://localhost:8080/api/resenas/destino/${idDestino}`);
            if (!respuesta.ok) {
                throw new Error('No se pudieron cargar las reseñas de este destino');
            }
            const datos = await respuesta.json();
            setResenas(datos);
        } catch (err: any) {
            setError(err.message || 'Error al conectar con el servidor');
            setResenas([]); // Limpiamos para evitar residuos
        } finally {
            setCargando(false);
        }
    }, []); // Al estar vacío, la función no cambia nunca de referencia

    // Función para enviar una nueva reseña al backend de Spring Boot
    const crearResena = async (nuevaResena: CrearResenaDTO): Promise<boolean> => {
        setError(null);
        try {
            const respuesta = await fetch('http://localhost:8080/api/resenas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaResena),
            });

            if (!respuesta.ok) {
                throw new Error('Error al publicar la reseña');
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'No se pudo enviar el comentario');
            return false;
        }
    };

    return {
        resenas,
        cargando,
        error,
        obtenerResenas,
        crearResena
    };
};