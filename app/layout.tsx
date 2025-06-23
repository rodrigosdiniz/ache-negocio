import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ToastProvider } from "@/context/ToastContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ache Negócio",
  description: "Conectando você às melhores empresas do Brasil.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen px-4 py-8 md:px-12 lg:px-24">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
