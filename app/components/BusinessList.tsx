type Business = {
  nome: string;
  categoria: string;
  cidade: string;
  telefone: string;
  destaque?: boolean;
};

const empresas: Business[] = [
  {
    nome: 'Nexus Engenharia',
    categoria: 'Engenharia Estrutural',
    cidade: 'Rio de Janeiro - RJ',
    telefone: '(21) 97781-4334',
    destaque: true,
  },
  {
    nome: 'Clínica Bem Estar',
    categoria: 'Saúde',
    cidade: 'São Paulo - SP',
    telefone: '(11) 98888-1111',
  },
  {
    nome: 'Contábil Alfa',
    categoria: 'Contabilidade',
    cidade: 'Belo Horizonte - MG',
    telefone: '(31) 92222-3333',
  },
];

export default function BusinessList() {
  return (
    <section style={{ padding: '2rem 1rem', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Empresas em destaque</h2>
      {empresas.map((empresa, index) => (
        <div key={index} style={{
          border: empresa.destaque ? '2px solid #0070f3' : '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: empresa.destaque ? '#f0f8ff' : '#fff'
        }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>{empresa.nome}</h3>
          <p style={{ margin: 0 }}>{empresa.categoria} – {empresa.cidade}</p>
          <p style={{ margin: '0.3rem 0' }}>📞 {empresa.telefone}</p>
        </div>
      ))}
    </section>
  );
}
