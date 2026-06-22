'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '../../config/supabase' 

export default function LiveStreamPage() {
  const [isLiveActive, setIsLiveActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initAgora = async () => {
      try {
        // Simulation d'initialisation SDK Agora
        // const client = AgoraRTC.createClient(...)
        await new Promise(resolve => setTimeout(resolve, 1000)) 
        
        if (isMounted) {
          setIsLiveActive(false) // Mettez à 'true' quand le flux est réellement prêt
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erreur SDK Agora:", error)
        if (isMounted) setIsLoading(false)
      }
    }

    initAgora()

    // Nettoyage crucial pour éviter les fuites de mémoire
    return () => {
      isMounted = false
      // Agora.leave() ou cleanup ici
    }
  }, [])

  return (
    <div className="p-4 bg-black text-white min-h-screen pb-24 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold tracking-wider text-yellow-400">🙏 GLOIRE-DIRECT</h1>
          <span className="bg-gray-900 border border-gray-800 text-[10px] text-gray-400 px-3 py-1 rounded-full">
            {isLoading ? "Initialisation..." : "Agora SDK Prêt"}
          </span>
        </div>

        <div className="relative w-full aspect-video bg-gray-950 rounded-2xl overflow-hidden border border-gray-900 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
          {isLoading ? (
            <div className="animate-pulse text-gray-600">Chargement du flux...</div>
          ) : isLiveActive ? (
            <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse uppercase tracking-widest">
              🔴 En Direct
            </div>
          ) : (
            <div>
              <span className="text-4xl block mb-3">✨</span>
              <h2 className="text-sm font-bold text-gray-200">Atmosphère de Prière & d'Édification</h2>
              <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                Le flux en direct démarrera bientôt. Restez connecté !
              </p>
            </div>
          )}
        </div>
        
        {/* ... reste du code ... */}
      </div>
      
      <Link href="/" className="...">⬅ Retourner au Flux Principal</Link>
    </div>
  )
    }
