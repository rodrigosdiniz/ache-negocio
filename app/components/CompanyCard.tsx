// app/components/CompanyCard.tsx
import React from 'react';

interface CompanyCardProps {
  name: string;
  description: string;
  category: string;
  whatsapp: string;
  address: string;
  imageUrl?: string;
  rating?: number;
}

export default function CompanyCard({
  name,
  description,
  category,
  whatsapp,
  address,
  imageUrl = 'https://via.placeholder.com/100x100.png?text=Empresa',
  rating = 4.5,
}: CompanyCardProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      maxWidth: '600px',
      margin: '1rem auto'
    }}>
      <img
        src={imageUrl}
        alt={name}
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 0.25rem' }}>{name}</h3>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>{description}</p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#888' }}>
          <strong>Categoria:</strong> {category} <br />
          <strong>Endereço:</strong> {address}
        </p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: '#f39c12' }}>
          {'★'.repeat(Math.round(rating))} <span style={{ color: '#333' }}>({rating.toFixed(1)})</span>
        </p>
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#25D366',
            color: 'white',
            borderRadius: '5px',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}
        >
          Fale por WhatsApp
        </a>
      </div>
    </div>
  );
}
