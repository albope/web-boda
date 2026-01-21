-- Tabla para peticiones musicales de invitados
CREATE TABLE music_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_title VARCHAR(200) NOT NULL,
  artist VARCHAR(200) NOT NULL,
  requested_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE music_requests ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas (los invitados pueden añadir canciones)
CREATE POLICY "Allow public insert" ON music_requests
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir lecturas públicas (todos pueden ver las canciones sugeridas)
CREATE POLICY "Allow public select" ON music_requests
  FOR SELECT
  USING (true);

-- Índice para ordenar por fecha de creación
CREATE INDEX idx_music_requests_created_at ON music_requests(created_at DESC);
