'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader } from '@googlemaps/js-api-loader'

export default function MapaEmpresas() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [map, setMap] = useState<google.maps.Map | null>(null)

  useEffect(() => {
    const carregarEmpresas = async () => {
      const { data } = await supabase
        .from('empresas')
        .select('id, nome, endereco')
        .neq('endereco', '')
      if (data) setEmpresas(data)
    }
    carregarEmpresas()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      })

      loader.load().then(() => {
        const mapa = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: { lat: -22.9068, lng: -43.1729 },
          zoom: 10,
        })
        setMap(mapa)
      })
    }
  }, [])

  useEffect(() => {
    if (map && empresas.length > 0) {
      const geocoder = new google.maps.Geocoder()

      empresas.forEach((empresa) => {
        geocoder.geocode({ address: empresa.endereco }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            new google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: empresa.nome,
            })
          }
        })
      })
    }
  }, [map, empresas])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas no Mapa</h1>
      <div id="map" className="w-full h-[600px] rounded shadow" />
    </main>
  )
}
