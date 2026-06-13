package com.example.descubresv.model.entity;

import java.io.Serializable;
import java.util.Objects;

// Clase para la llave primaria compuesta de itinerario_destinos
public class ItinerarioDestinoId implements Serializable {

    // Identificadores que conforman la clave primaria compuesta
    private Long itinerario;
    private Long destino;

    // Constructor sin argumentos requerido por JPA para mapeo de claves compuestas
    public ItinerarioDestinoId() {
    }

    // Constructor parametrizado para instanciar con valores específicos de
    // itinerario y destino
    public ItinerarioDestinoId(Long itinerario, Long destino) {
        this.itinerario = itinerario;
        this.destino = destino;
    }

    // Compara dos instancias evaluando igualdad de ambas partes de la clave
    // compuesta
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ItinerarioDestinoId that = (ItinerarioDestinoId) o;
        return Objects.equals(itinerario, that.itinerario) &&
                Objects.equals(destino, that.destino);
    }

    // Genera codigo hash basado en ambos componentes de la clave para uso en
    // colecciones
    @Override
    public int hashCode() {
        return Objects.hash(itinerario, destino);
    }
}
