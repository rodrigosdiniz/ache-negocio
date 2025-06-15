'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = () => {
    alert(`Login simulado para: ${email}`)
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br />
        <button onClick={handleLogin} style={{ marginTop: '1rem' }}>Entrar</button>
      </div>
    </main>
  )
}
