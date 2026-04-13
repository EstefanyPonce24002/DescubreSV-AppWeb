package com.example.descubresv.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

//  Envuelve todas las respuestas de la API

// Excluye automaticamente del JSON los campos que sean null para respuestas mas limpias.
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    // Indica si la operacion fue exitosa o fallo.
    private boolean success;

    // Mensaje descriptivo del resultado de la operacion.
    private String message;

    // Carga util generica de la respuesta (objeto, lista o null en errores).
    private T data;

    public ApiResponse() {
    }

    // Constructor completo para inicializar todos los campos manualmente.
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Fabrica de respuesta exitosa con mensaje por defecto "OK".
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "OK", data);
    }

    // Fabrica de respuesta exitosa con mensaje personalizado.
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    // Fabrica de respuesta de error; no retorna payload en data.
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    // Getter del estado de exito de la respuesta.
    public boolean isSuccess() {
        return success;
    }

    // Setter del estado de exito para construccion o ajuste manual.
    public void setSuccess(boolean success) {
        this.success = success;
    }

    // Getter del mensaje de la respuesta.
    public String getMessage() {
        return message;
    }

    // Setter del mensaje de la respuesta.
    public void setMessage(String message) {
        this.message = message;
    }

    // Getter del payload de datos devuelto por la API.
    public T getData() {
        return data;
    }

    // Setter del payload de datos para asignacion manual.
    public void setData(T data) {
        this.data = data;
    }
}
