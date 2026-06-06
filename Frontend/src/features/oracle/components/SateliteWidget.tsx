import { useState, useEffect } from 'react'

interface SateliteWidgetProps {
  lat?: number
  lng?: number
  tipoGrano?: string
}

export function SateliteWidget({ lat, lng, tipoGrano }: SateliteWidgetProps) {
  const [ndviUrl, setNdviUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!lat || !lng) return
    const bbox = `${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}`
    const url = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?` +
      `SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0` +
      `&LAYERS=MODIS_Terra_NDVI_8Day` +
      `&FORMAT=image/png&TRANSPARENT=true` +
      `&WIDTH=300&HEIGHT=300&CRS=CRS:84` +
      `&BBOX=${bbox}`
    setNdviUrl(url)
  }, [lat, lng])

  if (!lat || !lng) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200
                      dark:border-gray-700 p-6 text-center">
        <p className="text-2xl">🛰️</p>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Sin coordenadas GPS
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          El agricultor debe registrar las coordenadas del terreno
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-4
                    ring-1 ring-gray-200 dark:ring-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          🛰️ Vista Satelital NASA
        </h3>
        <span className="text-xs text-gray-400">NDVI · Salud vegetal</span>
      </div>
      {ndviUrl && (
        <img
          src={ndviUrl}
          alt={`Imagen satelital NDVI del terreno de ${tipoGrano ?? 'cultivo'}`}
          className="w-full rounded-lg object-cover"
          style={{ height: 200 }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2">
          <p className="text-gray-400">Latitud</p>
          <p className="font-mono font-medium text-gray-700 dark:text-gray-300">
            {lat.toFixed(4)}°
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2">
          <p className="text-gray-400">Longitud</p>
          <p className="font-mono font-medium text-gray-700 dark:text-gray-300">
            {lng.toFixed(4)}°
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-500"/>
          <span className="text-gray-500">Alta vegetación</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-yellow-400"/>
          <span className="text-gray-500">Media</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-red-400"/>
          <span className="text-gray-500">Escasa</span>
        </div>
      </div>
      <a
        href={`https://worldview.earthdata.nasa.gov/?l=MODIS_Terra_NDVI_8Day&v=${lng-0.5},${lat-0.5},${lng+0.5},${lat+0.5}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-primary-600 dark:text-primary-400
                   hover:underline"
      >
        Ver en NASA Worldview →
      </a>
    </div>
  )
}
