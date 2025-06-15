// app/layout.tsx
import './globals.css' // opcional, se quiser usar CSS global
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
