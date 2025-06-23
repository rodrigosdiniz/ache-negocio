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

        <div className="mb-12 animate-fade-in-up">
          <input
            type="text"
            placeholder="Buscar por cidade, nome ou categoria"
            className="w-full md:w-1/2 px-4 py-2 rounded-xl shadow border border-gray-300 focus:outline-none focus:ring focus:border-primary"
          />
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 animate-fade-in-up">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-200">
            <div className="bg-card p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">Construção</div>
            <div className="bg-card p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">Advocacia</div>
            <div className="bg-card p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">Saúde</div>
            <div className="bg-card p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">Educação</div>
          </div>
        </div>

        <div className="w-full mb-24">
          <h2 className="text-2xl font-semibold mb-4 text-center animate-fade-in-up">Empresas em Destaque</h2>
          <div className="flex overflow-x-auto space-x-4 animate-slide-in-left pb-2">
            <div className="min-w-[250px] bg-card rounded-2xl p-4 shadow">Empresa A</div>
            <div className="min-w-[250px] bg-card rounded-2xl p-4 shadow">Empresa B</div>
            <div className="min-w-[250px] bg-card rounded-2xl p-4 shadow">Empresa C</div>
          </div>
        </div>
      </div>

      <footer className="w-full text-center text-muted-foreground py-6 border-t border-border mt-10 animate-fade-in">
        <p className="text-sm">© 2025 Ache Negócio. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
