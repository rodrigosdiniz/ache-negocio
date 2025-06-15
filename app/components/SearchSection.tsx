export default function SearchSection() {
  return (
    <section style={{ padding: '2rem', backgroundColor: '#f7f7f7', textAlign: 'center' }}>
      <h2>Encontre o que você precisa</h2>
      <input
        type="text"
        placeholder="Digite o que está procurando..."
        style={{
          padding: '0.8rem',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Advogados', 'Engenheiros', 'Eletricistas', 'Mecânicos', 'Contadores', 'Arquitetos'].map((cat) => (
          <button
            key={cat}
            style={{
              padding: '0.7rem 1.2rem',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}
