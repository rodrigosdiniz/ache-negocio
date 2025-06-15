// app/components/CompanyCard.tsx

interface CompanyCardProps {
  name: string
  category: string
  description: string
  whatsapp: string
}

export default function CompanyCard({ name, category, description, whatsapp }: CompanyCardProps) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: 'white',
      }}
    >
      <h3 style={{ margin: 0 }}>{name}</h3>
      <p style={{ margin: '0.25rem 0', color: '#666' }}>{category}</p>
      <p style={{ fontSize: '0.9rem' }}>{description}</p>
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '0.5rem',
          padding: '0.4rem 0.8rem',
          backgroundColor: '#25D366',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Fale no WhatsApp
      </a>
    </div>
  )
}
