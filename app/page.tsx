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
    </main>
  );
}
