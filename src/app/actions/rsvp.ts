'use server'

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export interface RSVPFormData {
  nombre: string
  email?: string
  telefono?: string
  asiste: boolean
  alergias?: string
  menuEspecial?: string
  mensaje?: string
}

export interface RSVPResult {
  success: boolean
  error?: string
}

async function sendNotificationEmail(data: RSVPFormData): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY
  const notificationEmail = process.env.NOTIFICATION_EMAIL

  if (!resendApiKey || !notificationEmail) {
    console.log('Email notifications not configured, skipping...')
    return
  }

  const resend = new Resend(resendApiKey)
  const asistenciaText = data.asiste ? '✅ SÍ ASISTIRÁ' : '❌ NO ASISTIRÁ'

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
        Nueva confirmación de asistencia
      </h2>

      <div style="background: ${data.asiste ? '#ecfdf5' : '#fef2f2'}; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 18px; font-weight: bold; margin: 0; color: ${data.asiste ? '#059669' : '#dc2626'};">
          ${asistenciaText}
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Nombre:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.nombre}</td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email}</td>
        </tr>
        ` : ''}
        ${data.telefono ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.telefono}</td>
        </tr>
        ` : ''}
        ${data.alergias ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Alergias:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.alergias}</td>
        </tr>
        ` : ''}
        ${data.menuEspecial ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Menú especial:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.menuEspecial}</td>
        </tr>
        ` : ''}
        ${data.mensaje ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Mensaje:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.mensaje}</td>
        </tr>
        ` : ''}
      </table>

      <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
        Boda Alberto & Carmen · 14 de Noviembre de 2026
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'Boda Alberto & Carmen <onboarding@resend.dev>',
      to: notificationEmail,
      subject: `${data.asiste ? '✅' : '❌'} ${data.nombre} - Confirmación de asistencia`,
      html: htmlContent,
    })
  } catch (error) {
    console.error('Error al enviar email de notificación:', error)
  }
}

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResult> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('rsvp_responses').insert({
      nombre: data.nombre,
      email: data.email || null,
      telefono: data.telefono || null,
      asiste: data.asiste,
      alergias: data.alergias || null,
      menu_especial: data.menuEspecial || null,
      mensaje: data.mensaje || null,
    })

    if (error) {
      console.error('Error al guardar RSVP:', error)
      return { success: false, error: 'Error al guardar la confirmación' }
    }

    // Enviar notificación por email (no bloqueante)
    sendNotificationEmail(data)

    return { success: true }
  } catch (err) {
    console.error('Error inesperado:', err)
    return { success: false, error: 'Error inesperado al procesar la solicitud' }
  }
}
