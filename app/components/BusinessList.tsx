'use client';

import CompanyCard from './CompanyCard';

const businesses = [
  {
    name: 'Nexus Engenharia',
    category: 'Engenharia Estrutural',
    location: 'Rio de Janeiro - RJ',
    phone: '(21) 97781-4334',
    imageUrl: '/img/nexus.jpg',
    rating: 5,
  },
  {
    name: 'Clínica Bem Estar',
    category: 'Saúde',
    location: 'São Paulo - SP',
    phone: '(11) 98888-1111',
    imageUrl: '/img/clinica.jpg',
    rating: 4,
  },
  {
    name: 'Contábil Alfa',
    category: 'Contabilidade',
    location: 'Belo Horizonte - MG',
    phone: '(31) 92222-3333',
    imageUrl: '/img/contabil.jpg',
    rating: 3,
  },
];

export default function BusinessList() {
  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Empresas em destaque</h2>
      <div className="grid gap-6 justify-center">
        {businesses.map((biz, index) => (
          <CompanyCard key={index} {...biz} />
        ))}
      </div>
    </section>
  );
}
