export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
// app/components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Início</Link> | 
      <Link href="/precos">Planos</Link> | 
      <Link href="/login">Login</Link>
    </nav>
  )
}
import Navbar from './components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
