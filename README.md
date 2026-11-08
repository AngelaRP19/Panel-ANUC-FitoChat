# Panel ANUC Zetaquirá · Frontend

Panel web del sistema de identificación fitosanitaria temprana (Vite + React + TypeScript + Tailwind).
La guía de desarrollo (pantallas, reglas del producto, sistema de diseño) está en `FRONTEND_GUIA.md`;
el diseño de referencia es el lienzo «Panel Fitosanitario ANUC · Pantallas» en Claude Design.

## Comandos

Node.js 24 (versión fijada en `.nvmrc`). El uso del panel y del chatbot está en `docs/MANUAL_USUARIO.md`; la instalación y el despliegue, en `docs/MANUAL_INSTALACION.md` del backend.

```bash
npm install
cp .env.example .env.local   # VITE_USE_MOCKS=true para trabajar sin backend ni Cognito
npm run dev        # http://localhost:5173 (proxy /api → http://localhost:8000)
npm run typecheck
npm run lint
npm test
npm run coverage   # Vitest con cobertura; la CI exige 80 %
npm run build
npm run gen:api    # regenera src/types/api.d.ts desde el OpenAPI del backend
```

## Trabajar con mocks (`VITE_USE_MOCKS=true`)

La API se simula con MSW (`src/mocks/handlers`, datos en `src/mocks/fixtures`) y Cognito con un
simulador en memoria (`src/mocks/authSimulado.ts`). Cuentas de demostración (contraseña `demo1234`):

| Correo | Rol | Caso que permite probar |
|---|---|---|
| `lider@anuc.test` | Líder técnico (Wilmar Torres) | Acceso completo |
| `tecnico@anuc.test` | Técnico (Ana Lucía Becerra) | Vista del técnico |
| `jhon.sanabria@anuc.test` | Técnico | Contraseña temporal: pide crear una nueva al entrar |
| `diana.rincon@anuc.test` | Técnico deshabilitado | Mismo error genérico que credenciales incorrectas |

Escenarios: abre cualquier ruta con `?mock=sin-lider` para simular un panel sin líder técnico
(pantalla «Primer uso») y con `?mock=normal` para volver a los datos del diseño.

Código de recuperación de cuenta en el simulador: `123456`. Tras 5 intentos fallidos responde
«Demasiados intentos».

El catálogo de componentes está en `/dev/ui` (solo con `npm run dev`).

## Variables de entorno

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | Base de la API (`/api/v1`: en producción el panel y la API comparten el dominio de CloudFront) |
| `VITE_USE_MOCKS` | `true` simula la API y Cognito en el navegador; `false` usa el backend y Cognito reales |
| `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID` | User Pool del panel; obligatorias con `VITE_USE_MOCKS=false` |
| `VITE_GOOGLE_MAPS_API_KEY` | Opcional. Mapas de fincas y casos; sin clave se muestran esquemáticos. El mapa de vigilancia y el de las alertas no la necesitan |

Las variables `VITE_*` quedan dentro del paquete publicado: no pongas ahí nada secreto.

## Mapas

- **Mapa de vigilancia** (`src/features/mapa`) y **mapa de cada alerta** (`src/features/alertas`): Leaflet sobre
  OpenStreetMap (`src/components/mapa/MapaLibre.tsx`), sin clave. El de vigilancia muestra los casos y las alertas de
  Zetaquirá con sus filtros; el de la alerta, la zona afectada (círculo del radio) y sus casos.
- **Mapas de fincas y casos** (`src/components/mapa`): Google Maps si hay `VITE_GOOGLE_MAPS_API_KEY`; si no, la vista
  esquemática.

## Despliegue

El panel es estático: `npm run build` con `VITE_USE_MOCKS=false` y las variables de Cognito, y el contenido de `dist/`
se sube al bucket `anuc-panel-web-fitochat`. CloudFront lo sirve en la misma URL que la API (`/api/*` va al backend; el
resto, al bucket con la función `anuc-spa-rewrite`). Después de subirlo, invalida `/index.html` en CloudFront para que
los navegadores tomen la versión nueva. Se publica desde `main`.

## Integración continua

`.github/workflows/ci.yml` corre en cada pull request y en `develop` y `main`: ESLint, TypeScript, Vitest con cobertura mínima de 80 %, la construcción del panel y `npm audit` de las dependencias que llegan al navegador (falla con una vulnerabilidad alta). Dependabot propone actualizaciones cada semana sobre `develop`.

## Ramas

`feature/*` o `fix/*` → `develop` → `main`. Lo que va a producción sale de `main`.

## Reglas de dependencias

`pages → features → components / services / hooks`. ESLint las hace cumplir:
- `components/` no importa de `features/` ni `pages/`.
- Las páginas no usan Axios; usan los hooks del feature.
- Entre features solo se importa la API pública (`@/features/<nombre>`).
- Solo `src/services/auth/cognito.ts` conoce Amplify; el resto usa `@/services/auth`.
