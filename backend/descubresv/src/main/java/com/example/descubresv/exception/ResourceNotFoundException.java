package com.example.descubresv.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

<<<<<<< HEAD
// Excepción personalizada para cuando un recurso no existe en la base de datos
// Ejemplo: buscar un usuario por ID y no encontrarlo
@ResponseStatus(HttpStatus.NOT_FOUND) 
// Esta anotación hace que Spring devuelva automáticamente un HTTP 404
// cuando esta excepción es lanzada (sin necesidad de manejarla manualmente)
public class ResourceNotFoundException extends RuntimeException {

    // Constructor que recibe un mensaje personalizado
    // Se usa cuando queremos controlar completamente el mensaje de error
    public ResourceNotFoundException(String mensaje) {
        super(mensaje); // Llama al constructor de RuntimeException
    }

    // Constructor que construye un mensaje automáticamente
    // Recibe el nombre del recurso y su ID
    public ResourceNotFoundException(String recurso, Long id) {
        // Ejemplo de salida: "Usuario no encontrado con id: 5"
=======
// Excepcion para recursos no encontrados - retorna 404
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }

    public ResourceNotFoundException(String recurso, Long id) {
>>>>>>> 81fa6d85b6f3e5b0bf2dbae2b6bceafcc2fd2c57
        super(recurso + " no encontrado con id: " + id);
    }
}