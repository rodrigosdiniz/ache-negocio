export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-900 border-t border-gray-300 dark:border-zinc-700 mt-12 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>
        © {new Date().getFullYear()} <strong>AcheNegócio</strong>. Todos os direitos reservados.
      </p>

      <div className="mt-4 flex justify-center gap-6 text-blue-600 dark:text-blue-400">
        <a
          href="https://instagram.com/nexu.sengenharia1"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-700 transition-colors"
        >
          Instagram
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61568743817647"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-700 transition-colors"
        >
          Facebook
        </a>
        <a
          href="https://wa.me/5521977814334"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-700 transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  )
}
