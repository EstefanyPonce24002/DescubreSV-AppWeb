package com.example.descubresv.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import com.example.descubresv.model.enums.RolUsuario;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey claveSecreta;
    private final long tiempoExpiracion;
    private final String nombreCookie;

    public JwtService(
            @Value("${jwt.secret}") String secreto,
            @Value("${jwt.expiration}") long expiracion,
            @Value("${jwt.cookie-name}") String cookie) {
        this.claveSecreta = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secreto));
        this.tiempoExpiracion = expiracion;
        this.nombreCookie = cookie;
    }

    public String generarToken(Long userId, String email, RolUsuario rol) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("rol", rol.name())
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + tiempoExpiracion))
                .signWith(claveSecreta)
                .compact();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().verifyWith(claveSecreta).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims extraerClaims(String token) {
        return Jwts.parser().verifyWith(claveSecreta).build().parseSignedClaims(token).getPayload();
    }

    public Long extraerUserId(String token) {
        return Long.parseLong(extraerClaims(token).getSubject());
    }

    public String extraerEmail(String token) {
        return extraerClaims(token).get("email", String.class);
    }

    public RolUsuario extraerRol(String token) {
        return RolUsuario.valueOf(extraerClaims(token).get("rol", String.class));
    }

    public Cookie crearCookieJwt(String token) {
        Cookie cookie = new Cookie(nombreCookie, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (tiempoExpiracion / 1000));
        return cookie;
    }

    public String getNombreCookie() {
        return nombreCookie;
    }
}
