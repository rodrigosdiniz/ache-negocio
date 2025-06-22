/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'files.stripe.com',
      'lh3.googleusercontent.com', // caso use login com Google
      'jcnvpcjgydavwmedtdih.supabase.co', // imagens do Supabase
      'cdn.resend.com', // se usar Resend com imagens
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
}

module.exports = nextConfig
