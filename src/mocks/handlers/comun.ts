import { HttpResponse } from 'msw'
import { usuarioDelToken } from '../authSimulado'

/** Prefijo de la API simulada (igual que VITE_API_URL por defecto). */
export const API = '/api/v1'

/** Usuario de la sesión según el encabezado Authorization (token del simulador). */
export function usuarioActual(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  return usuarioDelToken(token)
}

/**
 * Error con el formato único del backend (`app/api/errors.py`): { codigo, mensaje, campos?, detalle? }.
 * Como el backend, omite `campos` y `detalle` cuando están vacíos.
 */
export function errorApi(
  status: number,
  codigo: string,
  mensaje: string,
  campos: Record<string, string> = {},
  detalle?: unknown,
) {
  return HttpResponse.json(
    {
      codigo,
      mensaje,
      ...(Object.keys(campos).length ? { campos } : {}),
      ...(detalle !== undefined && detalle !== null ? { detalle } : {}),
    },
    { status },
  )
}

export const noAutenticado = () => errorApi(401, 'NO_AUTENTICADO', 'La sesión no es válida')
