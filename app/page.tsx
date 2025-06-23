export const metadata = {
  title: 'Ache Negócio | Encontre Empresas de Qualquer Setor',
  description:
    'Busque empresas por cidade, categoria ou nome. Avalie serviços, encontre contatos e destaque seu negócio com nosso diretório inteligente.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12">
      <div className="max-w-5xl w-full text-center mt-20 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Encontre empresas em qualquer cidade ou setor
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Compare avaliações, entre em contato e descubra os melhores serviços perto de você.
        </p>
      </div>

      <section className="w-full max-w-6xl py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 animate-fade-in-up">
          Categorias populares
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fade-in-up delay-100">
          {['Advogados', 'Engenharia', 'Clínicas', 'Construtoras', 'Restaurantes', 'TI & Software', 'Contabilidade', 'Imobiliárias'].map((categoria) => (
            <div
              key={categoria}
              className="rounded-2xl bg-muted p-6 text-center shadow hover:scale-105 transition-transform"
            >
              <p className="text-lg font-medium text-primary/90">{categoria}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-6xl py-12 animate-fade-in-up delay-200">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Empresas em destaque
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-6 animate-slide-in-left min-w-full">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="min-w-[260px] bg-white shadow rounded-2xl p-4 flex-shrink-0"
              >
                <h3 className="font-semibold text-primary">Empresa {item}</h3>
                <p className="text-sm text-muted-foreground">Categoria exemplo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full border-t py-6 text-center text-muted-foreground mt-12 animate-fade-in-up delay-300">
        <p>&copy; {new Date().getFullYear()} Ache Negócio. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:underline">Política de Privacidade</a>
          <a href="#" className="hover:underline">Termos de Uso</a>
        </div>
      </footer>
    </main>
  );
}
