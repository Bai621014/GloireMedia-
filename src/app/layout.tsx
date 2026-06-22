import './globals.css'

export const metadata = {
  title: 'GloireMedia',
  description: "Espace d'édification, de partage positif et de streaming",
  manifest: '/manifest.json',
  // Déplacement des balises ici pour une meilleure gestion par Next.js
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GloireMedia',
  },
  icons: {
    apple: '/icon-192.png',
  }
}

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full bg-black">
      {/* Plus besoin de balises <head> manuelles ici */}
      <body className="h-full text-white antialiased selection:bg-yellow-500 selection:text-black">
        <main className="min-h-screen max-w-md mx-auto bg-black shadow-xl relative overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
