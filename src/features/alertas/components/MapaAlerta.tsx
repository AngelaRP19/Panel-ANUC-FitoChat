import { Circle } from 'lucide-react'
import { CENTRO_ZETAQUIRA, type Punto } from '@/components/mapa/estilo'
import { CirculoRadioLibre, MapaLibre, MarcadorCasoLibre } from '@/components/mapa/MapaLibre'
import { FormaCategoria } from '@/components/ui/CategoriaMarca'
import { CATEGORIA_FORMA_LABEL, CATEGORIA_LABEL } from '@/locales/es'
import type { Categoria } from '@/types/enums'
import type { CasoAlerta } from '../types'
import { formatearKm } from '../utils'

const KM_POR_GRADO = 111.32

interface MapaAlertaProps {
  casos: CasoAlerta[]
  categoria: Categoria
  radioKm: number
  /** Descripción accesible del mapa. */
  etiqueta: string
}

/** Leyenda bajo el mapa (encima taparía el círculo en la columna angosta del detalle). */
function Leyenda({
  categoria,
  radioKm,
  numCasos,
}: {
  categoria: Categoria
  radioKm: number
  numCasos: number
}) {
  return (
    <div className="flex flex-col gap-1 text-nota text-tinta-secundaria">
      <span className="font-semibold text-tinta">
        Zona de la alerta · {numCasos} casos de {CATEGORIA_LABEL[categoria]} en un radio de{' '}
        {formatearKm(radioKm)}
      </span>
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <FormaCategoria categoria={categoria} />
          {CATEGORIA_LABEL[categoria]} confirmado ({CATEGORIA_FORMA_LABEL[categoria]})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Circle size={14} className="text-advertencia" strokeDasharray="4 3" aria-hidden="true" />
          Radio {formatearKm(radioKm)}
        </span>
      </span>
    </div>
  )
}

/** Centro de los casos y su posición; los de la misma finca se separan unos 70 m. */
function ubicar(casos: CasoAlerta[]) {
  const con = casos.filter((c) => c.latitud !== null && c.longitud !== null)
  if (!con.length) return null
  const centro = {
    lat: con.reduce((s, c) => s + c.latitud!, 0) / con.length,
    lng: con.reduce((s, c) => s + c.longitud!, 0) / con.length,
  }
  const vistos = new Map<string, number>()
  const puntos = con.map((c) => {
    const clave = `${c.latitud},${c.longitud}`
    const n = vistos.get(clave) ?? 0
    vistos.set(clave, n + 1)
    return { caso: c, posicion: { lat: c.latitud! + n * 0.0006, lng: c.longitud! + n * 0.0006 } }
  })
  return { centro, puntos }
}

/** Rectángulo que contiene el círculo del radio. */
function limitesCirculo(centro: Punto, radioKm: number) {
  const dLat = radioKm / KM_POR_GRADO
  const dLng = radioKm / (KM_POR_GRADO * Math.cos((centro.lat * Math.PI) / 180))
  return {
    north: centro.lat + dLat,
    south: centro.lat - dLat,
    east: centro.lng + dLng,
    west: centro.lng - dLng,
  }
}

/**
 * Mapa de la alerta: el mismo del mapa de vigilancia (OpenStreetMap, sin clave), encuadrado en
 * la zona afectada, con el círculo del radio alrededor del centro de los casos y cada caso con la
 * forma de su categoría. Antes era Google Maps y, sin clave de la API, solo un mapa embebido en el
 * que no se podía señalar la zona.
 */
export function MapaAlerta({ casos, categoria, radioKm, etiqueta }: MapaAlertaProps) {
  const u = ubicar(casos)
  return (
    <div className="flex flex-col gap-2">
      <MapaLibre
        etiqueta={etiqueta}
        encuadre={
          u
            ? { limites: limitesCirculo(u.centro, radioKm) }
            : { centro: CENTRO_ZETAQUIRA, zoom: 12 }
        }
        className="h-72"
      >
        {u && <CirculoRadioLibre centro={u.centro} radioKm={radioKm} />}
        {u?.puntos.map(({ caso, posicion }) => (
          <MarcadorCasoLibre
            key={caso.id}
            posicion={posicion}
            categoria={categoria}
            titulo={`Caso #${caso.codigo} · ${caso.productor_nombre} · ${caso.finca_nombre}`}
          />
        ))}
      </MapaLibre>
      <Leyenda categoria={categoria} radioKm={radioKm} numCasos={casos.length} />
    </div>
  )
}
