export const metadata = {
  title: 'Ache Negócio | Encontre Empresas de Qualquer Setor',
  description:
    'Busque empresas por cidade, categoria ou nome. Avalie serviços, encontre contatos e destaque seu negócio com nosso diretório inteligente.',
};

export default function Home() {
  const categorias = [
    { nome: 'Advocacia', emoji: '⚖️' },
    { nome: 'Construção Civil', emoji: '🏗️' },
    { nome: 'Saúde', emoji: '🩺' },
    { nome: 'Educação', emoji: '📚' },
    { nome: 'Tecnologia', emoji: '💻' },
    { nome: 'Beleza', emoji: '💅' },
    { nome: 'Alimentação', emoji: '🍽️' },
    { nome: 'Automotivo', emoji: '🚗' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12">
      <div className="max-w-5xl w-full text-center mt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
          Encontre empresas em qualquer cidade ou setor
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in delay-100">
          Compare avaliações, entre em contato e descubra os melhores serviços perto de você.
        </p>

        <section className="w-full">
          <h2 className="text-2xl font-semibold text-primary mb-6">Categorias populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categorias.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-4 border rounded-2xl shadow hover:scale-105 transition-all duration-300 bg-white dark:bg-zinc-900"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <span className="text-sm font-medium text-muted-foreground">{cat.nome}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
