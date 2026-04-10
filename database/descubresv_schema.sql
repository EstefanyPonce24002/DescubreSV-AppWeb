-- Tipo ENUM para roles de usuario
DO $$ BEGIN
    CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'TURISTA');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Tabla usuarios - informacion de los usuarios registrados
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario          SERIAL PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    correo              VARCHAR(150) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    nacionalidad        VARCHAR(100),
    preferencias        TEXT,
    presupuesto_estimado DECIMAL(10, 2) DEFAULT 0.00,
    avatar_url          VARCHAR(500),
    rol                 rol_usuario NOT NULL DEFAULT 'TURISTA',
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices de usuario
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Tabla categorias_destino - categorias para clasificar destinos
CREATE TABLE IF NOT EXISTS categorias_destino (
    id_categoria        SERIAL PRIMARY KEY,
    nombre_categoria    VARCHAR(100) NOT NULL UNIQUE,
    descripcion         TEXT,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla destinos - informacion de cada destino turistico
CREATE TABLE IF NOT EXISTS destinos (
    id_destino          SERIAL PRIMARY KEY,
    nombre              VARCHAR(200) NOT NULL,
    descripcion         TEXT,
    departamento        VARCHAR(100) NOT NULL,
    precio_entrada      DECIMAL(10, 2) DEFAULT 0.00,
    horario             VARCHAR(200),
    mejor_epoca         VARCHAR(200),
    tipo                VARCHAR(100),
    como_llegar_vehiculo TEXT,
    como_llegar_bus     TEXT,
    latitud             DECIMAL(10, 7),
    longitud            DECIMAL(10, 7),
    imagen_url          VARCHAR(500),
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0.00,
    id_categoria        INTEGER REFERENCES categorias_destino(id_categoria) ON DELETE SET NULL,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indices de destinos
CREATE INDEX IF NOT EXISTS idx_destinos_categoria ON destinos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_destinos_departamento ON destinos(departamento);
CREATE INDEX IF NOT EXISTS idx_destinos_tipo ON destinos(tipo);
CREATE INDEX IF NOT EXISTS idx_destinos_activo ON destinos(activo);

-- Tabla favoritos - destinos guardados por los turistas
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito         SERIAL PRIMARY KEY,
    id_usuario          INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_destino          INTEGER NOT NULL REFERENCES destinos(id_destino) ON DELETE CASCADE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Un usuario no puede guardar el mismo destino dos veces
    UNIQUE(id_usuario, id_destino)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(id_usuario);
CREATE INDEX IF NOT EXISTS idx_favoritos_destino ON favoritos(id_destino);

-- Tabla resenas - calificaciones de turistas sobre destinos
CREATE TABLE IF NOT EXISTS resenas (
    id_resena           SERIAL PRIMARY KEY,
    id_usuario          INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_destino          INTEGER NOT NULL REFERENCES destinos(id_destino) ON DELETE CASCADE,
    calificacion        INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario          TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resenas_usuario ON resenas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_resenas_destino ON resenas(id_destino);
CREATE INDEX IF NOT EXISTS idx_resenas_calificacion ON resenas(calificacion);

-- Tabla itinerarios - planificacion de viajes
CREATE TABLE IF NOT EXISTS itinerarios (
    id_itinerario       SERIAL PRIMARY KEY,
    id_usuario          INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre              VARCHAR(200) NOT NULL DEFAULT 'Mi Itinerario',
    fecha_inicio        DATE,
    fecha_fin           DATE,
    duracion            INTEGER DEFAULT 0,
    presupuesto_categoria VARCHAR(100),
    tipo_experiencia    VARCHAR(100),
    tipo_grupo          VARCHAR(100),
    modo_planificacion  VARCHAR(100),
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itinerarios_usuario ON itinerarios(id_usuario);

-- Tabla itinerario_destinos - relacion muchos a muchos con orden y dia
CREATE TABLE IF NOT EXISTS itinerario_destinos (
    id_itinerario       INTEGER NOT NULL REFERENCES itinerarios(id_itinerario) ON DELETE CASCADE,
    id_destino          INTEGER NOT NULL REFERENCES destinos(id_destino) ON DELETE CASCADE,
    dia_numero          INTEGER NOT NULL DEFAULT 1,
    orden               INTEGER NOT NULL DEFAULT 1,
    notas               TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_itinerario, id_destino)
);

CREATE INDEX IF NOT EXISTS idx_itinerario_destinos_destino ON itinerario_destinos(id_destino);

-- Tabla presupuesto - desglose de costos por itinerario
CREATE TABLE IF NOT EXISTS presupuesto (
    id_presupuesto      SERIAL PRIMARY KEY,
    id_itinerario       INTEGER NOT NULL REFERENCES itinerarios(id_itinerario) ON DELETE CASCADE,
    costo_transporte    DECIMAL(10, 2) DEFAULT 0.00,
    costo_alimentacion  DECIMAL(10, 2) DEFAULT 0.00,
    costo_entrada       DECIMAL(10, 2) DEFAULT 0.00,
    costo_otros         DECIMAL(10, 2) DEFAULT 0.00,
    total               DECIMAL(10, 2) DEFAULT 0.00,
    moneda              VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_presupuesto_itinerario ON presupuesto(id_itinerario);

-- Tabla transportes - opciones de transporte por destino
CREATE TABLE IF NOT EXISTS transportes (
    id_transporte       SERIAL PRIMARY KEY,
    tipo                VARCHAR(100) NOT NULL,
    costo               DECIMAL(10, 2) DEFAULT 0.00,
    capacidad           INTEGER DEFAULT 0,
    tiempo_estimado     VARCHAR(100),
    id_destino          INTEGER NOT NULL REFERENCES destinos(id_destino) ON DELETE CASCADE,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transportes_destino ON transportes(id_destino);

-- Tabla alimentacion - opciones de comida por destino
CREATE TABLE IF NOT EXISTS alimentacion (
    id_alimentacion     SERIAL PRIMARY KEY,
    nombre              VARCHAR(200) NOT NULL,
    tipo_comida         VARCHAR(100),
    precio_promedio     DECIMAL(10, 2) DEFAULT 0.00,
    ubicacion           VARCHAR(300),
    horarios            VARCHAR(200),
    calificacion        INTEGER CHECK (calificacion IS NULL OR calificacion BETWEEN 1 AND 5),
    id_destino          INTEGER NOT NULL REFERENCES destinos(id_destino) ON DELETE CASCADE,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alimentacion_destino ON alimentacion(id_destino);

-- Funcion reutilizable para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at en cada tabla
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_categorias_destino_updated_at
    BEFORE UPDATE ON categorias_destino
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_destinos_updated_at
    BEFORE UPDATE ON destinos
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_resenas_updated_at
    BEFORE UPDATE ON resenas
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_itinerarios_updated_at
    BEFORE UPDATE ON itinerarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_presupuestos_updated_at
    BEFORE UPDATE ON presupuesto
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_transportes_updated_at
    BEFORE UPDATE ON transportes
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_alimentacion_updated_at
    BEFORE UPDATE ON alimentacion
    FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
