'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const POSITIVE_EMOJIS = ['🙏', '🙌', '🔥', '💪', '❤️', '✨', '👏', '👑', '🎉', '🥰', '😀', '☀️'];
const FORBIDDEN_WORDS = ['nul', 'haine', 'faux', 'insulte', 'guerre', 'mal', 'arnaque', 'idiot'];

export default function CommentSection({ videoId, user }) {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    async function loadComments() {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false })
      if (data) setComments(data)
    }
    if (videoId) loadComments()
  }, [videoId])

  async function handlePostComment(e) {
    e.preventDefault()
    if (!user) return alert('⚠️ Connectez-vous pour laisser un message d\'encouragement.')

    // 1. Filtrage strict des mots négatifs
    const hasNegativeWord = FORBIDDEN_WORDS.some(word => comment.toLowerCase().includes(word))
    if (hasNegativeWord) {
      return alert('⚠️ GloireMedia est un espace de paix. Seuls les messages positifs sont acceptés !')
    }

    // 2. Filtrage strict des émojis négatifs
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
    const customEmojis = comment.match(emojiRegex) || []
    const hasForbiddenEmoji = customEmojis.some(emoji => !POSITIVE_EMOJIS.includes(emoji))
    
    if (hasForbiddenEmoji) {
      return alert('⚠️ S\'il vous plaît, utilisez uniquement des émojis bienveillants (🙏, ❤️, ✨, 🙌).')
    }

    // 3. Insertion si tout est 100% positif
    const { data, error } = await supabase.from('comments').insert({
      video_id: videoId,
      user_id: user.id,
      text: comment
    }).select('*, profiles(username)')

    if (!error && data) {
      setComments([data[0], ...comments])
      setComment('')
      
      // Attribution discrète de la commission de fidélité pour récompenser la positivité
      await supabase.rpc('reward_positive_action', { user_id: user.id, token_amount: 0.5 })
    }
  }

  return (
    <div className="p-4 bg-gray-950 rounded-t-2xl text-white w-full max-w-md mx-auto">
      <h3 className="font-bold text-sm mb-3 text-yellow-400">💬 Messages d'édification</h3>
      
      <form onSubmit={handlePostComment} className="flex space-x-2 mb-4">
        <input 
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Laissez un message de bénédiction..."
          className="flex-1 bg-gray-900 rounded-xl px-4 py-2 text-sm outline-none border border-gray-800 focus:border-yellow-400 text-white"
        />
        <button type="submit" className="bg-yellow-500 text-black px-4 rounded-xl text-sm font-bold active:scale-95 transition-transform">
          Envoyer
        </button>
      </form>

      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-900 p-3 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 font-bold">@{c.profiles?.username || 'Anonyme'}</p>
            <p className="text-sm mt-1 text-gray-100">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
    }
