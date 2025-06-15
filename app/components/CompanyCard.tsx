'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompanyCardProps {
  name: string
  description: string
  imageUrl: string
  whatsapp: string
  rating: number // de 0 a 5
}

export default function CompanyCard({ name, description, imageUrl, whatsapp, rating }: CompanyCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden max-w-sm border hover:shadow-lg transition">
      <Image
        src={imageUrl}
        alt={`Logo de ${name}`}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center gap-1 text-yellow-500 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} fill={i < rating ? 'currentColor' : 'none'} />
          ))}
        </div>
        <Button asChild className="w-full">
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
            Entrar em contato
          </a>
        </Button>
      </div>
    </div>
  )
}
