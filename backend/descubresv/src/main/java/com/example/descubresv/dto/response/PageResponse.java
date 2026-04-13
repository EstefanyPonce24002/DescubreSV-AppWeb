package com.example.descubresv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// DTO genérico para respuestas paginadas en la API
// Se usa para devolver listas con información de paginación
@Data // Genera getters, setters, toString, equals y hashCode automáticamente
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor con todos los atributos
@Builder // Permite crear objetos usando el patrón builder
public class PageResponse<T> {

    // Lista de elementos de la página actual
    private List<T> contenido;

    // Número de la página actual (empieza desde 0 en Spring)
    private int paginaActual;

    // Total de páginas disponibles
    private int totalPaginas;

    // Total de elementos en toda la consulta (no solo esta página)
    private long totalElementos;

    // Cantidad de elementos por página
    private int tamanoPagina;

    // Indica si esta es la primera página
    private boolean primera;

    // Indica si esta es la última página
    private boolean ultima;

    // Método estático de fábrica
    // Convierte un objeto Page<T> de Spring en nuestro DTO personalizado
    public static <T> PageResponse<T> of(org.springframework.data.domain.Page<T> page) {
        return PageResponse.<T>builder()
                .contenido(page.getContent()) // Lista de datos
                .paginaActual(page.getNumber()) // Número de página actual
                .totalPaginas(page.getTotalPages()) // Total de páginas
                .totalElementos(page.getTotalElements()) // Total de registros
                .tamanoPagina(page.getSize()) // Tamaño de página
                .primera(page.isFirst()) // ¿Es la primera?
                .ultima(page.isLast()) // ¿Es la última?
                .build();
    }
}