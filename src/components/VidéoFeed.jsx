'use client'
import { useRef, useState, useEffect } from 'react'
import supabase from '../lib/supabase'
import CommentSection from './CommentSection'

// ==========================================
// 1. SOUS-COMPOSANT : CARTE VIDÉO INDIVIDUELLE
// ==========================================
function VidéoCard({ vidéo, user, isActive }) {
  const vidéoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (vidéoRef.current) {
      if (isActive) {
        vidéoRef.current.play().catch((err) => console.log("Lecture bloquée :", err))
        setIsPlaying(true)
      } else {
        vidéoRef.current.pause()
        vidéoRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const handleVidéoClick = () => {
    if (vidéoRef.current) {
      if (isPlaying) {
        vidéoRef.current.pause()
        setIsPlaying(false)
      } else {
        vidéoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handlePlayStarted = async () => {
    setIsPlaying(true)
    try {
      if (supabase) {
        await supabase.rpc('increment_views', { target_video_id: vidéo.id })
      }
    } catch (err) {
      console.error("Erreur de vue:", err.message)
    }
  }

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-black flex flex-col justify-center items-center snap-start">
      {/* 🎯 FIX RENDER : La balise HTML doit rester strictement <video> sans accent */}
      <video
        ref={vidéoRef}
        onClick={handleVidéoClick}
        onPlay={handlePlayStarted}
        onPause={() => setIsPlaying(false)}
        src={vidéo.video_url || vidéo.vidéo_url}
        className="w-full h-[calc(100vh-130px)] object-cover rounded-xl"
        loop
        playsInline
      />

      <div className="absolute bottom-6 left-4 z-10 text-white right-16 pointer-events-none">
        <p className="font-bold text-sm text-yellow-400">@{vidéo.profiles?.username || 'Créateur'}</p>
        <p className="text-xs mt-1 drop-shadow-md">{vidéo.title}</p>
        <div className="flex items-center space-x-1 mt-2 text-[10px] text-gray-300 bg-black/40 px-2 py-1 rounded-full w-max">
          <span>👁️</span> <span>{vidéo.views || 0} vues</span>
        </div>
      </div>

      <div className="absolute bottom-10 right-4 z-10 flex flex-col items-center space-y-6">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="bg-gray-900/80 p-3 rounded-full border border-gray-800 text-xl active:scale-90 transition-transform text-white"
        >
          💬
        </button>
      </div>

      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-950 rounded-t-2xl overflow-hidden h-[60vh] flex flex-col">
          <div className="flex justify-end pr-4 bg-gray-950 pt-3 pb-2 border-b border-gray-900">
            <button onClick={() => setShowComments(false)} className="text-gray-400 text-xs font-bold bg-gray-900 px-3 py-1 rounded-full">
              Fermer ✖
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <CommentSection videoId={vidéo.id} user={user} />
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 2. COMPOSANT PRINCIPAL : LE FLUX (FEED)
// ==========================================
export default function VidéoFeed({ user }) {
  const [vidéos, setVidéos] = useState([])
  const [activeVidéoId, setActiveVidéoId] = useState(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchVidéos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setVidéos(data)
        if (data.length > 0) {
          setActiveVidéoId(data[0].id.toString())
        }
      }
      setLoading(false)
    }
    fetchVidéos()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || vidéos.length === 0) return

    const options = {
      root: container,
      rootMargin: '0px',
      threshold: 0.6
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          {/* 🎯 FIX RENDER : Le sélecteur d'attribut HTML doit rester sans accent */}
          const vidéoId = entry.target.getAttribute('data-video-id')
          setActiveVidéoId(vidéoId)
        }
      })
    }, options)

    const children = container.querySelectorAll('[data-video-id]')
    children.forEach((child) => observer.observe(child))

    return () => {
      children.forEach((child) => observer.unobserve(child))
    }
  }, [vidéos])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500">
        Chargement des flux...
      </div>
    )
  }

  if (vidéos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500 px-6 text-center">
        Aucune bénédiction vidéo disponible pour le moment.
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="snap-y snap-mandatory h-[calc(100vh-130px)] overflow-y-scroll no-scrollbar w-full"
    >
      {vidéos.map((vidéo) => (
        <div 
          key={vidéo.id} 
          data-video-id={vidéo.id}
          className="h-full w-full flex items-center justify-center border-b border-gray-950 snap-start"
        >
          <VidéoCard 
            vidéo={vidéo} 
            user={user} 
            isActive={activeVidéoId === vidéo.id.toString()} 
          />
        </div>
      ))}
    </div>
  )
      }
