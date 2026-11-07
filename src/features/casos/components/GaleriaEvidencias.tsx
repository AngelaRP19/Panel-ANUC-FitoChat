import { useState } from 'react'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { CasoDetalle } from '../types'
import { VisorEvidencias } from './VisorEvidencias'

/**
 * Evidencias fotográficas del caso (artboard 04): conteo útil (8/12), un recuadro por foto en el
 * orden en que llegaron y «Ver todas». Las fotos no se clasifican por parte de la planta: basta con
 * que sean de la planta. Cada recuadro abre el visor en esa foto.
 */
export function GaleriaEvidencias({ caso }: { caso: CasoDetalle }) {
  const [visor, setVisor] = useState<{ indice: number } | null>(null)
  const { total, maximo } = caso.evidencias_resumen

  return (
    <section
      aria-labelledby="t-evid"
      className="rounded-lg border border-borde bg-blanco px-6 pt-5 pb-6 shadow-1"
    >
      <div className="mb-3.5 flex items-center gap-3">
        <h2 id="t-evid" className="flex-1 titulo-h2">
          Evidencias fotográficas
        </h2>
        <span className="font-titulos text-[22px] leading-7 font-bold tabular-nums">
          {total}/{maximo}
          <span className="sr-only"> evidencias útiles</span>
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={total === 0}
          onClick={() => setVisor({ indice: 0 })}
        >
          Ver todas
        </Button>
      </div>

      {total === 0 ? (
        <div className="flex aspect-[8/1] min-h-20 items-center justify-center rounded-lg border border-dashed border-borde-control bg-blanco p-2 text-xs leading-4 font-medium text-tinta-terciaria">
          Sin fotos
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setVisor({ indice: i })}
              aria-label={`Ver la foto ${i + 1} de ${total} del caso #${caso.id}`}
              className="relative flex aspect-[4/3] cursor-zoom-in flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-borde bg-verde-100 p-2 text-verde-800 hover:border-verde-300"
            >
              <span className="absolute top-2 left-2 rounded-sm border border-borde bg-blanco px-1.5 text-[11px] leading-4 font-semibold text-tinta-secundaria">
                {i + 1}
              </span>
              <Camera size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {visor && (
        <VisorEvidencias caso={caso} indiceInicial={visor.indice} onClose={() => setVisor(null)} />
      )}
    </section>
  )
}
