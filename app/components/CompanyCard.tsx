// components/CompanyCard.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface CompanyCardProps {
  name: string
  category: string
  city: string
  state: string
  phone: string
  imageUrl?: string
}

export default function CompanyCard({
  name,
  category,
  city,
  state,
  phone,
  imageUrl = "/default-company.jpg",
}: CompanyCardProps) {
  return (
    <Card className="w-full max-w-sm shadow-xl hover:scale-105 transition-transform">
      <Image
        src={imageUrl}
        alt={name}
        width={400}
        height={250}
        className="rounded-t-xl object-cover h-48 w-full"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{category} – {city} - {state}</p>
        <p className="mt-2 text-sm">📞 {phone}</p>
        <a
          href={`https://wa.me/55${phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Entrar em contato
        </a>
      </CardContent>
    </Card>
  )
}
