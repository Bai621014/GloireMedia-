'use client'
import { useRef, useState, useEffect } from 'react'
// 🎯 CORRECTION CHEMIN : Utilisation du chemin relatif direct sans alias
import supabase from '../lib/supabase' 
import CommentSection from './CommentSection'

function VideoCard({ video, user, isActive }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch((err) => console.log("Lecture bloquée :", err))
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handlePlayStarted = async () => {
    setIsPlaying(true)
    try {
      if (supabase) {
        await supabase.rpc('increment_views', { target_video_id: video.id })
      }
    } catch (err) {
      console.error("Erreur de vue:", err.message)
    }
  }

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-black flex flex-col justify-center items-center snap-start">
      <video
        ref={videoRef}
        onClick={handleVideoClick}
        onPlay={handlePlayStarted}
        onPause={() => setIsPlaying(false)}
        src={video.video_url}
        className="w-full h-[calc(100vh-130px)] object-cover rounded-xl"
        loop
        playsInline
      />

      <div className="absolute bottom-6 left-4 z-10 text-white right-16 pointer-events-none">
        <p className="font-bold text-sm text-yellow-400">@{video.profiles?.username || 'Créateur'}</p>
        <p className="text-xs mt-1 drop-shadow-md">{video.title}</p>
        <div className="flex items-center space-x-1 mt-2 text-[10px] text-gray-300 bg-black/40 px-2 py-1 rounded-full w-max">
          <span>👁️</span> <span>{video.views || 0} vues</span>
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
            <CommentSection videoId={video.id} user={user} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function VideoFeed({ user }) {
  const [videos, setVideos] = useState([])
  const [activeVideoId, setActiveVideoId] = useState(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchVideos() {
      if (!supabase) return
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setVideos(data)
        if (data.length > 0) {
          setActiveVideoId(data[0].id.toString())
        }
      }
      setLoading(false)
    }
    fetchVideos()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || videos.length === 0) return

    const options = {
      root: container,
      rootMargin: '0px',
      threshold: 0.6
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const vId = entry.target.getAttribute('data-video-id')
          setActiveVideoId(vId)
        }
      })
    }, options)

    const children = container.querySelectorAll('[data-video-id]')
    children.forEach((child) => observer.observe(child))

    return () => {
      children.forEach((child) => observer.unobserve(child))
    }
  }, [videos])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-sm text-gray-500">
        Chargement des flux...
      </div>
    )
  }

  if (videos.length === 0) {
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
      {videos.map((video) => (
        <div 
          key={video.id} 
          data-video-id={video.id}
          className="h-full w-full flex items-center justify-center border-b border-gray-950 snap-start"
        >
          <VideoCard 
            video={video} 
            user={user} 
            isActive={activeVideoId === video.id.toString()} 
          />
        </div>
      ))}
    </div>
  )
      }
