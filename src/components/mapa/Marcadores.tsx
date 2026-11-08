import { Marker } from '@vis.gl/react-google-maps'
import { iconoPin, urlGoogleMapsPunto } from './estilo'

// Se renderizan dentro de <MapaGoogle>: ahí la API ya cargó y existe `google.maps`.
// Un clic en el marcador abre Google Maps en su punto (pestaña nueva). Los casos y las alertas
// se dibujan en MapaLibre (OpenStreetMap).

const abrir = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

/** Pin verde de una ubicación (finca). */
export function MarcadorPin({
  posicion,
  titulo,
}: {
  posicion: google.maps.LatLngLiteral
  titulo: string
}) {
  return (
    <Marker
      position={posicion}
      icon={iconoPin()}
      title={titulo}
      onClick={() => abrir(urlGoogleMapsPunto(posicion))}
    />
  )
}
