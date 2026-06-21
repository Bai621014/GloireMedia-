'use client'
import './globals.css' // 🎯 CORRECTION : "import" est maintenant en minuscules

export const metadata = {
  title: 'GloireMedia',
  description: "Espace d'édification, de partage positif et de streaming",
  manifest: '/manifest.json',
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
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="h-full text-white antialiased selection:bg-yellow-500 selection:text-black">
        <main className="min-h-screen max-w-md mx-auto bg-black shadow-xl relative overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
