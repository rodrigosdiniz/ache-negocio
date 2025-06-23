export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10 py-8 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} AcheNegócio. Todos os direitos reservados.</p>
      <div className="mt-2 space-x-4">
        <a href="https://instagram.com/nexu.sengenharia1" target="_blank" className="hover:text-blue-600">
          Instagram
        </a>
        <a href="https://www.facebook.com/profile.php?id=61568743817647" target="_blank" className="hover:text-blue-600">
          Facebook
        </a>
        <a href="https://wa.me/5521977814334" target="_blank" className="hover:text-blue-600">
          WhatsApp
        </a>
      </div>
    </footer>
  )
}
