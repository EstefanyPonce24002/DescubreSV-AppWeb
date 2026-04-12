package com.example.descubresv.exception;

// Se lanza cuando se intenta registrar un correo que ya existe
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String mensaje) {
        super(mensaje);
    }
}