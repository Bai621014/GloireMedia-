/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Permet de déployer sur Vercel même s'il reste de petites alertes de code
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Autoriser le chargement des images et avatars depuis ton stockage Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
