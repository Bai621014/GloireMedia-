'use client'
import { useEffect, useState } from 'react'
// Correction du chemin vers lib/supabase (on recule d'un niveau pour sortir de app/ et entrer dans lib/)
import supabase from '../lib/supabase' 
// Correction du chemin vers components (on recule d'un niveau pour entrer dans components/)
import VideoCard from '../components/VideoCard'
import Link from 'next/link'

export default function Home() {
  const [videos, setVideos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Vérification de la session utilisateur active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    // 2. Chargement des vidéos publiées
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setVideos(data)
      }
      setLoading(false)
    }

    fetchVideos()
  }, [])

  return (
    <div className="bg-black text-white min-h-screen pb-24">
      {/* Barre supérieure de l'application */}
      <header className="p-4 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-black/90 backdrop-blur z-50">
        <h1 className="text-xl font-bold tracking-wider text-yellow-400">✨ GLOIREMEDIA</h1>
        <div className="flex space-x-3">
          <Link href="/live" className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            🔴 LIVE
          </Link>
          <Link href="/market" className="text-xs bg-gray-800 px-3 py-1 rounded-full flex items-center">
            🛍️ Boutique
          </Link>
        </div>
      </header>

      {/* Zone de défilement vertical complet */}
      {loading ? (
        <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500">
          Chargement du flux positif...
        </div>
      ) : videos.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500 px-6 text-center">
          Aucune vidéo disponible pour le moment. Soyez le premier à partager une bénédiction !
        </div>
      ) : (
        <div className="snap-y snap-mandatory h-[calc(100vh-130px)] overflow-y-scroll no-scrollbar">
          {videos.map((video) => (
            <div key={video.id} className="snap-start h-full w-full flex items-center justify-center border-b border-gray-950">
              <VideoCard video={video} user={user} />
            </div>
          ))}
        </div>
      )}

      {/* Barre de navigation basse pour le public */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900 p-4 flex justify-around items-center text-xl z-50">
        <Link href="/" className="hover:scale-110 transition-transform">🏠</Link>
        <Link href="/market" className="hover:scale-110 transition-transform">🛒</Link>
        <Link href="/live" className="hover:scale-110 transition-transform">🙏</Link>
        <Link href="/retrait" className="hover:scale-110 transition-transform">💳</Link>
      </nav>
    </div>
  )
}
