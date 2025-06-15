// app/components/BusinessList.tsx
import CompanyCard from './CompanyCard';

const dummyBusinesses = [
  {
    name: 'Engenharia Total',
    category: 'Engenheiros',
    description: 'Especializados em projetos estruturais e laudos técnicos.',
    whatsapp: '21999999999',
    address: 'Rua A, 123 - Centro, RJ'
  },
  {
    name: 'Eletricista Rápido',
    category: 'Eletricistas',
    description: 'Serviços elétricos residenciais e comerciais com segurança.',
    whatsapp: '21988888888',
    address: 'Rua B, 456 - Tijuca, RJ'
  },
  {
    name: 'Contabilidade Silva',
    category: 'Contadores',
    description: 'Impostos, declarações e gestão financeira.',
    whatsapp: '21977777777',
    address: 'Av. das Américas, 8900 - Barra, RJ'
  }
];

export default function BusinessList() {
  return (
    <section style={{ padding: '2rem', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Empresas em destaque</h2>
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        justifyContent: 'center'
      }}>
        {dummyBusinesses.map((business, index) => (
          <CompanyCard key={index} business={business} />
        ))}
      </div>
    </section>
  );
}
