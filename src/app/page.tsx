'use client'
import { useEffect, useState } from 'react'
import supabase from '../config/supabase' 
import VideoFeed from '../components/VideoFeed'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true; // Protection contre les fuites mémoire

    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setUser(session?.user || null)
        }
      } catch (err) {
        console.error("Erreur session:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkUser()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="bg-black text-white min-h-screen pb-24">
      {/* Header avec un z-index plus haut pour rester au-dessus du flux */}
      <header className="p-4 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-black/90 backdrop-blur-md z-40">
        <h1 className="text-xl font-bold tracking-wider text-yellow-400">✨ GLOIREMEDIA</h1>
        <div className="flex space-x-2">
          <Link href="/live" className="bg-red-600/20 text-red-500 border border-red-900 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
            🔴 LIVE
          </Link>
          <Link href="/market" className="text-[10px] bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
            🛍️ Boutique
          </Link>
        </div>
      </header>

      {/* Rendu conditionnel propre */}
      <main className="relative">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500 animate-pulse">
            Chargement de l'atmosphère...
          </div>
        ) : (
          <VideoFeed user={user} />
        )}
      </main>

      {/* Navigation Mobile Fixe */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black border-t border-gray-900 p-4 flex justify-around items-center text-xl z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <Link href="/" className="hover:scale-110 transition-transform">🏠</Link>
        <Link href="/market" className="hover:scale-110 transition-transform">🛒</Link>
        <Link href="/live" className="hover:scale-110 transition-transform">🙏</Link>
        <Link href="/retrait" className="hover:scale-110 transition-transform">💳</Link>
      </nav>
    </div>
  )
      }
