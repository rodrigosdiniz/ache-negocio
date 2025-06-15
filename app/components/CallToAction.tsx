export default function CallToAction() {
  return (
    <section style={{
      padding: '3rem 1rem',
      backgroundColor: '#0070f3',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '8px',
      margin: '2rem auto',
      maxWidth: '900px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Cadastre sua empresa gratuitamente</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Apareça para milhares de clientes no momento certo. Comece agora mesmo!
      </p>
      <a href="/login" style={{
        backgroundColor: '#fff',
        color: '#0070f3',
        padding: '0.75rem 1.5rem',
        borderRadius: '999px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}>
        Começar gratuitamente
      </a>
    </section>
  );
}
