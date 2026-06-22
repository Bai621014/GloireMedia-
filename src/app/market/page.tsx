'use client'
import { useState, useEffect } from 'react'
import supabase from '../../config/supabase' 

export default function Market() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // Nouvel état pour gérer les erreurs

  useEffect(() => {
    async function loadAds() {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('marketplace_ads')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
        
        if (fetchError) throw fetchError
        setAds(data || [])
      } catch (err) {
        console.error("Erreur chargement ads:", err.message)
        setError("Impossible de charger la boutique. Réessayez plus tard.")
      } finally {
        setLoading(false)
      }
    }
    loadAds()
  }, [])

  return (
    <div className="p-4 bg-black text-white min-h-screen pb-24 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-1">🛍️ Espace Publicitaire & Ventes</h1>
      <p className="text-xs text-gray-400 mb-6">Utilisez vos commissions accumulées comme carburant pour booster vos affaires.</p>

      {loading ? (
        <div className="text-center text-gray-500 text-sm py-10">Mise à jour de la boutique...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-sm py-10">{error}</div>
      ) : ads.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-10">Aucune publicité disponible.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-gray-950 rounded-xl overflow-hidden p-3 border border-gray-900 flex flex-col">
              <img 
                src={ad.image_url || '/placeholder.png'} 
                alt={ad.title} 
                onError={(e) => e.target.src = '/placeholder.png'} // Fallback si l'image casse
                className="w-full aspect-square object-cover rounded-lg bg-gray-900"
              />
              <h3 className="font-bold mt-2 text-sm text-gray-200 truncate">{ad.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ad.description}</p>
              
              <div className="mt-auto pt-3">
                <span className="text-xs text-green-400 font-bold block mb-2">
                  💰 {ad.price_tokens} Commissions
                </span>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs py-2 rounded-lg transition-colors">
                  Voir l'offre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
    }
