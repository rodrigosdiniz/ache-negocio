'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { PhoneIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

interface CompanyProps {
  name: string;
  category: string;
  location: string;
  phone: string;
  imageUrl?: string;
  rating?: number;
}

export default function CompanyCard({
  name,
  category,
  location,
  phone,
  imageUrl = '/placeholder.jpg',
  rating = 4,
}: CompanyProps) {
  return (
    <Card className="w-full max-w-xl mx-auto hover:shadow-lg transition-shadow mb-4">
      <Image
        src={imageUrl}
        alt={name}
        width={600}
        height={300}
        className="rounded-t-md object-cover h-48 w-full"
      />
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground">{category} – {location}</p>
        <div className="flex items-center text-sm my-2">
          <PhoneIcon className="w-4 h-4 mr-2 text-green-500" />
          <a href={`https://wa.me/55${phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
            {phone}
          </a>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${i < rating ? 'fill-yellow-500' : 'text-gray-300'}`}
              fill={i < rating ? '#facc15' : 'none'}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
