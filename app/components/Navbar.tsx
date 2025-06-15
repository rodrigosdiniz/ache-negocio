import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f1f1f1' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        <li><Link href="/">Início</Link></li>
        <li><Link href="/precos">Planos</Link></li>
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
