export const metadata = {
  title: 'Ache Negócio | Encontre Empresas de Qualquer Setor',
  description:
    'Busque empresas por cidade, categoria ou nome. Avalie serviços, encontre contatos e destaque seu negócio com nosso diretório inteligente.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <div className="max-w-5xl w-full text-center mt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
          Encontre empresas em qualquer cidade ou setor
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in delay-100">
          Compare avaliações, entre em contato e descubra os melhores serviços perto de você.
        </p>
      </div>

      {/* Seção: Categorias Populares */}
      <div className="max-w-6xl w-full mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-primary">
          Categorias populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🛠️', label: 'Construção' },
            { icon: '💅', label: 'Beleza' },
            { icon: '⚖️', label: 'Advocacia' },
            { icon: '🩺', label: 'Saúde' },
            { icon: '🍽️', label: 'Restaurantes' },
            { icon: '🚗', label: 'Autopeças' },
            { icon: '🏠', label: 'Imobiliárias' },
            { icon: '💻', label: 'TI e Software' },
          ].map((cat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-4 text-center hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="text-base md:text-lg font-medium text-primary">
                {cat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
