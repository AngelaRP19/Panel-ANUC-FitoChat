import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { adaptadorCognito } from './cognito'
import { esErrorAuth } from './tipos'

const RUTA = '/api/v1/auth/recuperacion/solicitar-codigo'

async function codigoDeError(respuesta: () => Response) {
  server.use(http.post(RUTA, respuesta))
  try {
    await adaptadorCognito.solicitarCodigo('ana@anuc.org')
  } catch (error) {
    return esErrorAuth(error) ? error.codigo : 'NO_ES_ERROR_AUTH'
  }
  return 'SIN_ERROR'
}

describe('adaptador de Cognito · recuperar cuenta (RQF06)', () => {
  it('pide el código al backend, no directo a Cognito', async () => {
    let cuerpo: unknown = null
    server.use(
      http.post(RUTA, async ({ request }) => {
        cuerpo = await request.json()
        return HttpResponse.json({ envio: 'CODIGO' })
      }),
    )
    await expect(adaptadorCognito.solicitarCodigo('ana@anuc.org')).resolves.toBe('CODIGO')
    expect(cuerpo).toEqual({ correo: 'ana@anuc.org' })
  })

  it('devuelve si se reenvió la contraseña temporal', async () => {
    server.use(http.post(RUTA, () => HttpResponse.json({ envio: 'CONTRASENA_TEMPORAL' })))
    await expect(adaptadorCognito.solicitarCodigo('ana@anuc.org')).resolves.toBe(
      'CONTRASENA_TEMPORAL',
    )
  })

  it('traduce las respuestas del backend', async () => {
    const error = (status: number, codigo: string) => () =>
      HttpResponse.json({ codigo, mensaje: 'x' }, { status })
    expect(await codigoDeError(error(404, 'CUENTA_INEXISTENTE'))).toBe('CUENTA_INEXISTENTE')
    expect(await codigoDeError(error(409, 'CUENTA_DESHABILITADA'))).toBe('CUENTA_DESHABILITADA')
    expect(await codigoDeError(error(429, 'DEMASIADAS_SOLICITUDES'))).toBe('DEMASIADOS_INTENTOS')
    expect(await codigoDeError(error(503, 'ERROR_INTERNO'))).toBe('DESCONOCIDO')
    expect(await codigoDeError(() => HttpResponse.error())).toBe('RED')
  })
})
