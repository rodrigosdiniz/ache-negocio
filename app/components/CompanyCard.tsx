// components/CompanyCard.tsx
import { Card, CardContent } from "@/components/ui/card";

interface CompanyCardProps {
  name: string;
  description: string;
  image: string;
  rating: number;
  contactLink: string;
}

export default function CompanyCard({
  name,
  description,
  image,
  rating,
  contactLink,
}: CompanyCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md border rounded-2xl overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-yellow-500 text-sm mb-4">⭐ {rating.toFixed(1)} / 5.0</p>
        <a
          href={contactLink}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar em contato
        </a>
      </CardContent>
    </Card>
  );
}
