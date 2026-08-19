import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

// Carpeta donde se guardan los archivos subidos (facturas y comprobantes).
// En Railway se monta un volumen persistente en esta ruta; en local es ./datos.
export const CARPETA_ARCHIVOS = process.env.CARPETA_ARCHIVOS || path.resolve('datos/archivos')

export const asegurarCarpeta = async () => {
  if (!existsSync(CARPETA_ARCHIVOS)) {
    await mkdir(CARPETA_ARCHIVOS, { recursive: true })
  }
}

// Solo se permiten estos tipos de archivo, tanto para facturas como comprobantes.
export const TIPOS_PERMITIDOS = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png'
}

export const TAMANO_MAXIMO = 8 * 1024 * 1024 // 8 MB
