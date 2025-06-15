// app/components/BusinessList.tsx
'use client'

import CompanyCard from './CompanyCard';

const mockCompanies = [
  {
    id: 1,
    name: 'Auto Elétrica Luz Forte',
    description: 'Especialistas em parte elétrica automotiva com 20 anos de experiência.',
    image: 'https://via.placeholder.com/300x180?text=Auto+El%C3%A9trica',
    rating: 4.5,
    whatsapp: '(21) 99999-0001',
  },
  {
    id: 2,
    name: 'Mecânica Rápida RJ',
    description: 'Serviços de mecânica leve e revisões em até 24h.',
    image: 'https://via.placeholder.com/300x180?text=Mec%C3%A2nica',
    rating: 4.8,
    whatsapp: '(21) 98888-1122',
  },
  {
    id: 3,
    name: 'Refrigeração Polar',
    description: 'Instalação e manutenção de ar-condicionado split residencial.',
    image: 'https://via.placeholder.com/300x180?text=Refrigera%C3%A7%C3%A3o',
    rating: 4.2,
    whatsapp: '(21) 97777-3344',
  },
];

export default function BusinessList() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Empresas em destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
}
