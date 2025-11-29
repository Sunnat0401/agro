"use client"

import { useMapEvents } from "react-leaflet"

interface MapClickHandlerProps {
  onMapClick: (coords: [number, number]) => void
}

export function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}
