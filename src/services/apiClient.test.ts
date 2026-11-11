import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { MENSAJES } from '@/locales/es'
import { server } from '@/mocks/server'
import { api, esErrorApi, mensajeDeError, type ErrorApi } from './apiClient'

const RUTA = '/api/v1/prueba-errores'

async function errorDe(respuesta: () => Response): Promise<ErrorApi> {
  server.use(http.post(RUTA, respuesta))
  try {
    await api.post('/prueba-errores', {})
  } catch (error) {
    if (esErrorApi(error)) return error
    throw error
  }
  throw new Error('La solicitud debía fallar')
}

describe('apiClient · errores del backend', () => {
  it('lee el cuerpo real del backend: { codigo, mensaje, campos } sin envoltura', async () => {
    // Lo que responde FastAPI (app/api/errors.py) a un celular repetido.
    const error = await errorDe(() =>
      HttpResponse.json(
        {
          codigo: 'DUPLICADO',
          mensaje: 'Hay datos que ya están registrados.',
          campos: { celular: 'Este número de celular ya está registrado' },
        },
        { status: 409 },
      ),
    )
    expect(error.status).toBe(409)
    expect(error.codigo).toBe('DUPLICADO')
    expect(error.campos).toEqual({ celular: 'Este número de celular ya está registrado' })
    expect(mensajeDeError(error)).toBe('Hay datos que ya están registrados.')
  })

  it('lee el detalle de un 409 (especie en uso)', async () => {
    const detalle = [{ cultivo: 'Lote 1', especie: 'GRANADILLA', casos: ['0230'] }]
    const error = await errorDe(() =>
      HttpResponse.json(
        { codigo: 'ESPECIE_EN_USO', mensaje: 'No se puede quitar.', detalle },
        { status: 409 },
      ),
    )
    expect(error.codigo).toBe('ESPECIE_EN_USO')
    expect(error.detalle).toEqual(detalle)
    expect(error.campos).toEqual({})
  })

  it('sigue aceptando el formato envuelto { error: {...} }', async () => {
    const error = await errorDe(() =>
      HttpResponse.json({ error: { codigo: 'X', mensaje: 'Mensaje envuelto' } }, { status: 400 }),
    )
    expect(error.codigo).toBe('X')
    expect(error.message).toBe('Mensaje envuelto')
  })

  it('«sin conexión» solo cuando el servidor no respondió', async () => {
    const red = await errorDe(() => HttpResponse.error())
    expect(red.codigo).toBe('RED')
    expect(mensajeDeError(red)).toBe(MENSAJES.errorConexionTexto)

    const sinCuerpo = await errorDe(() => new HttpResponse(null, { status: 502 }))
    expect(sinCuerpo.codigo).toBe('HTTP_502')
    expect(mensajeDeError(sinCuerpo)).toBe(MENSAJES.errorGenerico)
  })
})
