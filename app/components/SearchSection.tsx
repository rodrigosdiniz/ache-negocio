'use client'

import { useState } from 'react'

export default function SearchSection() {
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `/resultados?q=${encodeURIComponent(query)}`
  }

  return (
    <section style={{ padding: '2rem', backgroundColor: '#f7f7f7', textAlign: 'center' }}>
      <h2>Encontre o que você precisa</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Digite o que está procurando..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.8rem',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        />
      </form>

      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['Advogados', 'Engenheiros', 'Eletricistas', 'Mecânicos', 'Contadores', 'Arquitetos'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => (window.location.href = `/resultados?q=${encodeURIComponent(cat)}`)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          )
        )}
      </div>
    </section>
  )
}
