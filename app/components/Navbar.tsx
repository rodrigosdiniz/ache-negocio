// app/components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Início</Link> |{" "}
      <Link href="/precos">Planos</Link> |{" "}
      <Link href="/login">Login</Link>
    </nav>
  )
}
