export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
        <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4 flex justify-around z-50">
          <a href="/" className="text-xs">Maison</a>
          <a href="/explore" className="text-xs">Découvrir</a>
          <a href="/messages" className="text-xs">Messages</a>
          <a href="/profile" className="text-xs text-amber-500 font-bold">Moi</a>
        </nav>
      </body>
    </html>
  );
}
