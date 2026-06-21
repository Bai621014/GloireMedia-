'use client'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

// 🌟 Liste Sainte & Riche étendue : Joie, Abondance, Respect et Personnes Élégantes
const POSITIVE_EMOJIS = [
  '🙏', '🙌', '✨', '🔥', '👑', '🕊️', '📖', '🌟',
  '👏', '🤝', '🙇‍♂️', '🙇‍♀️', '👍', '✊', '👋', '✍️', '✏️',
  '🕺', '💃', '🕴️', '👨‍💼', '👩‍💼', '👑', '🏅', '🏆', '🎉',
  '😂', '🤣', '😀', '🥰', '😁', '❤️', '🎉', '🥳', '☀️', '💙', '💜', '💚', '💛',
  '💸', '💰', '💵', '💲', '📈', '🚀', '🎯', '💪', '🏦', '👇🏻', '👆🏻'
];

// 🛑 Mots strictement interdits (Filtre de négativité)
const FORBIDDEN_WORDS = [
  'nul', 'haine', 'faux', 'insulte', 'guerre', 'mal', 
  'arnaque', 'idiot', 'menteur', 'diable', 'colère'
];

export default function CommentSection({ videoId, user }) {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Chargement en temps réel des messages
  useEffect(() => {
    async function loadComments() {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false })
      if (data) setComments(data)
    }
    if (videoId) loadComments()
  }, [videoId])

  async function handlePostComment(e) {
    e.preventDefault()
    if (!user) return alert("⚠️ Connectez-vous pour libérer un message d'encouragement.")
    if (!comment.trim() || isSubmitting) return

    const lowerCaseComment = comment.toLowerCase()

    // 1. Filtrage automatique et strict des termes négatifs
    const hasNegativeWord = FORBIDDEN_WORDS.some(word => lowerCaseComment.includes(word))
    if (hasNegativeWord) {
      return alert('⚠️ GloireMedia est un havre de paix. Seuls les propos bienveillants et constructifs sont admis ici !')
    }

    // 2. Extraction et validation exclusive des émojis
    const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu
    const extractedEmojis = comment.match(emojiRegex) || []
    
    const hasForbiddenEmoji = extractedEmojis.some(emoji => !POSITIVE_EMOJIS.includes(emoji))
    if (hasForbiddenEmoji) {
      return alert("⚠️ S'il vous plaît, utilisez exclusivement les émojis de joie, d'abondance ou de profond respect autorisés.")
    }

    try {
      setIsSubmitting(true)

      const { data, error } = await supabase.from('comments').insert({
        video_id: videoId,
        user_id: user.id,
        text: comment.trim()
      }).select('*, profiles(username, avatar_url)')

      if (error) throw error

      if (data && data[0]) {
        setComments([data[0], ...comments])
        setComment('')
        
        // 💰 Attribution instantanée de 0.5 Commission V10
        await supabase.rpc('reward_positive_action', { user_id: user.id, token_amount: 0.5 })
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 bg-gradient-to-b from-gray-950 to-black rounded-t-3xl text-white w-full max-w-md mx-auto border-t border-gray-900 shadow-2xl">
      
      {/* En-tête avec les voyants clignotants */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm tracking-wide text-yellow-400 flex items-center gap-2">
          💬 Flux d'Édification & de Grâce
        </h3>
        <div className="flex items-center space-x-3">
          
          {/* 🚦 Zone des voyants clignotants */}
          <div className="flex space-x-2 items-center bg-gray-900/60 px-2.5 py-1 rounded-full border border-gray-800">
            {/* 🟢 Voyant Vert */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>

            {/* 🔵 Voyant Bleu */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            
            {/* 🟡 Voyant Doré */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>

            {/* 🔴 Voyant Rouge */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>

          <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full font-medium animate-pulse">
            Actif : +0.5 V10 💸
          </span>
        </div>
      </div>
      
      {/* Formulaire d'envoi */}
      <form onSubmit={handlePostComment} className="flex space-x-2 mb-5">
        <input 
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Partagez une bénédiction, joie ou témoignage..."
          className="flex-1 bg-gray-900/90 rounded-2xl px-4 py-2.5 text-sm outline-none border border-gray-800 focus:border-yellow-500/55 text-white transition-all placeholder:text-gray-600"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 rounded-2xl text-sm font-bold active:scale-95 transition-transform flex items-center justify-center"
        >
          {isSubmitting ? '...' : 'Envoyer'}
        </button>
      </form>

      {/* Zone des messages */}
      <div className="space-y-3.5 max-h-72 overflow-y-auto no-scrollbar pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-2xl block mb-2 animate-bounce">🕊️</span>
            <p className="text-xs text-gray-500">Aucun message pour le moment. Soyez le premier à semer une parole de paix !</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-gray-900/40 p-3 rounded-2xl border border-gray-900 flex items-start space-x-3">
              <img 
                src={c.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (c.profiles?.username || c.id)} 
                className="w-7 h-7 rounded-full object-cover mt-0.5"
                alt="avatar"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-yellow-500/90 font-bold truncate">@{c.profiles?.username || 'Anonyme'}</p>
                  <span className="text-[9px] text-gray-600 flex items-center gap-1">
                    Béni <span className="inline-block animate-pulse text-yellow-400">✨</span>
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-200 leading-relaxed break-words">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
      }
