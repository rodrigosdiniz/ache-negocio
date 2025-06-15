export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="E-mail" required /><br />
        <input type="password" placeholder="Senha" required /><br />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}

