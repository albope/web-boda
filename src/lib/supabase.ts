// Tipo para las respuestas del formulario RSVP
export interface RSVPResponse {
  id?: string
  nombre: string
  email?: string
  telefono?: string
  asiste: boolean
  alergias?: string
  menu_especial?: string
  mensaje?: string
  created_at?: string
}
