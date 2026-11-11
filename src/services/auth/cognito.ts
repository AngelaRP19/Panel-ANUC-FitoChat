// Adaptador de Amazon Cognito. ÚNICO archivo del proyecto que conoce Amplify:
// si el equipo cambia de proveedor, se reescribe solo este archivo.
import { Amplify } from 'aws-amplify'
import {
  confirmResetPassword,
  confirmSignIn,
  fetchAuthSession,
  signIn,
  signOut,
  updatePassword,
} from 'aws-amplify/auth'
import { env } from '@/config/env'
import {
  ErrorAuth,
  type AdaptadorAuth,
  type CodigoErrorAuth,
  type EnvioRecuperacion,
} from './tipos'

/** Error del backend al pedir el código → código de la interfaz. */
const ERRORES_RECUPERACION: Record<number, CodigoErrorAuth> = {
  404: 'CUENTA_INEXISTENTE',
  409: 'CUENTA_DESHABILITADA',
  429: 'DEMASIADOS_INTENTOS',
}

let configurado = false

function configurar() {
  if (configurado) return
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognito.userPoolId,
        userPoolClientId: env.cognito.clientId,
        loginWith: { email: true },
      },
    },
  })
  configurado = true
}

/** Traduce las excepciones de Cognito a los códigos que entiende la interfaz. */
function traducirError(error: unknown): ErrorAuth {
  const nombre = error instanceof Error ? error.name : ''
  const mensaje = error instanceof Error ? error.message : ''
  const mapa: Record<string, CodigoErrorAuth> = {
    NotAuthorizedException: /attempts exceeded/i.test(mensaje)
      ? 'DEMASIADOS_INTENTOS'
      : 'CREDENCIALES',
    UserNotFoundException: 'CREDENCIALES',
    UserNotConfirmedException: 'CREDENCIALES',
    PasswordResetRequiredException: 'CREDENCIALES',
    TooManyRequestsException: 'DEMASIADOS_INTENTOS',
    LimitExceededException: 'DEMASIADOS_INTENTOS',
    TooManyFailedAttemptsException: 'DEMASIADOS_INTENTOS',
    CodeMismatchException: 'CODIGO_INVALIDO',
    ExpiredCodeException: 'CODIGO_INVALIDO',
    InvalidPasswordException: 'CONTRASENA_INVALIDA',
    NetworkError: 'RED',
  }
  return new ErrorAuth(mapa[nombre] ?? 'DESCONOCIDO', mensaje)
}

async function conErrores<T>(fn: () => Promise<T>): Promise<T> {
  configurar()
  try {
    return await fn()
  } catch (error) {
    throw error instanceof ErrorAuth ? error : traducirError(error)
  }
}

export const adaptadorCognito: AdaptadorAuth = {
  iniciarSesion: (correo, contrasena) =>
    conErrores(async () => {
      const { isSignedIn, nextStep } = await signIn({ username: correo, password: contrasena })
      if (isSignedIn) return { paso: 'LISTO' }
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { paso: 'NUEVA_CONTRASENA' }
      }
      // Otros retos (MFA, verificación) no están contemplados en el panel (P-09).
      throw new ErrorAuth('DESCONOCIDO', `Paso de inicio no soportado: ${nextStep.signInStep}`)
    }),

  confirmarNuevaContrasena: (nueva) =>
    conErrores(async () => {
      const { isSignedIn } = await confirmSignIn({ challengeResponse: nueva })
      if (!isSignedIn) throw new ErrorAuth('DESCONOCIDO', 'No se completó el cambio de contraseña')
    }),

  cerrarSesion: () => conErrores(() => signOut()),

  obtenerToken: async () => {
    configurar()
    try {
      const sesion = await fetchAuthSession()
      return sesion.tokens?.accessToken?.toString() ?? null
    } catch {
      return null
    }
  },

  // RQF06: con la protección contra enumeración de usuarios, Cognito no dice si el correo existe y
  // «envía» aunque no haya cuenta. El backend lo revisa en la base y, solo si hay cuenta, le pide a
  // Cognito el código (o reenvía la contraseña temporal de una cuenta que nunca entró).
  solicitarCodigo: async (correo) => {
    const { api, esErrorApi } = await import('@/services/apiClient')
    try {
      const { data } = await api.post<{ envio: EnvioRecuperacion }>(
        '/auth/recuperacion/solicitar-codigo',
        { correo },
      )
      return data.envio
    } catch (error) {
      if (!esErrorApi(error) || error.status === null) throw new ErrorAuth('RED')
      throw new ErrorAuth(ERRORES_RECUPERACION[error.status] ?? 'DESCONOCIDO', error.message)
    }
  },

  // Con sesión iniciada, NotAuthorizedException significa que la contraseña actual no es correcta.
  cambiarContrasena: (actual, nueva) =>
    conErrores(async () => {
      try {
        await updatePassword({ oldPassword: actual, newPassword: nueva })
      } catch (error) {
        if (error instanceof Error && error.name === 'NotAuthorizedException') {
          throw new ErrorAuth('CONTRASENA_ACTUAL')
        }
        throw error
      }
    }),

  confirmarRecuperacion: (correo, codigo, nueva) =>
    conErrores(() =>
      confirmResetPassword({ username: correo, confirmationCode: codigo, newPassword: nueva }),
    ),
}
