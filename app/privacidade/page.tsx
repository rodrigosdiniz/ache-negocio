// /privacidade/page.tsx

export default function PoliticaPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <p className="mb-4">
        Respeitamos sua privacidade. As informações coletadas são utilizadas exclusivamente para fins operacionais,
        como autenticação, personalização de conteúdo e envio de notificações.
      </p>
      <p className="mb-4">
        Não compartilhamos seus dados com terceiros sem consentimento. Você pode solicitar a remoção dos dados a qualquer momento,
        conforme previsto na Lei Geral de Proteção de Dados (LGPD).
      </p>
      <p>
        Para dúvidas, entre em contato através do nosso formulário em <a href="/contato" className="text-blue-600 underline">/contato</a>.
      </p>
    </main>
  )
}
