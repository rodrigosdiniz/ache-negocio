'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      padding: '2rem 1rem',
      backgroundColor: '#f4f4f4',
      textAlign: 'center',
      borderTop: '1px solid #ddd',
      marginTop: '2rem'
    }}>
      <p><strong>Ache Negócio SaaS</strong> © {new Date().getFullYear()}</p>

      <p>
        Desenvolvido por Rodrigo Diniz ·
        <a href="mailto:contato@achenegocio.com.br" style={{ marginLeft: '0.3rem', color: '#0070f3' }}>
          contato@achenegocio.com.br
        </a>
      </p>

      <p>
        <a href="https://www.instagram.com/nexu.sengenharia1/" target="_blank" rel="noopener noreferrer">
          Instagram
        </a> ·{' '}
        <a href="https://www.facebook.com/profile.php?id=61568743817647" target="_blank" rel="noopener noreferrer">
          Facebook
        </a> ·{' '}
        <Link href="/contato" style={{ color: '#0070f3' }}>
          Fale Conosco
        </Link>
      </p>
    </footer>
  )
}
