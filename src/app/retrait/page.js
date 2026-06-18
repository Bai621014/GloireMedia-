'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function RetraitPage() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [operator, setOperator] = useState('MTN')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadUserBalance() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Récupération du solde depuis le profil utilisateur
        const { data } = await supabase
          .from('profiles')
          .select('balance_tokens')
          .eq('id', session.user.id)
          .single()
        if (data) setBalance(data.balance_tokens)
      }
    }
    loadUserBalance()
  }, [])

  async function handleWithdraw(e) {
    e.preventDefault()
    setMessage('')
    
    if (!amount || parseFloat(amount) <= 0) {
      return setMessage('⚠️ Veuillez entrer un montant valide.')
    }
    if (parseFloat(amount) > balance) {
      return setMessage('⚠️ Solde insuffisant pour effectuer cette conversion.')
    }
    if (!phoneNumber) {
      return setMessage('⚠️ Veuillez entrer le numéro de téléphone bénéficiaire.')
    }

    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Enregistrement de la demande de retrait pour traitement par l'API Monetbil/Crypto-Fiat
      const { error } = await supabase.from('withdrawals').insert({
        user_id: session.user.id,
        amount: parseFloat(amount),
        operator: operator,
        phone_number: phoneNumber,
        status: 'pending'
      })

      if (error) throw error

      // Mise à jour locale immédiate du solde pour l'expérience utilisateur
      setBalance(prev => prev - parseFloat(amount))
      setMessage('✅ Demande de transfert envoyée avec succès ! Traitement en cours via Mobile Money.')
      setAmount('')
      setPhoneNumber('')
    } catch (err) {
      setMessage(`❌ Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-black text-white min-h-screen pb-24 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-1">💳 Retrait & Conversions</h1>
      <p className="text-xs text-gray-400 mb-6">Convertissez vos récompenses d'activité positive en crédit ou cash mobile.</p>

      {/* Tableau de bord du solde */}
      <div className="bg-gray-950 p-6 rounded-2xl border border-gray-900 text-center mb-6">
        <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Votre Solde Actuel</span>
        <span className="text-3xl font-black text-green-400">{balance.toFixed(2)} V10</span>
        <p className="text-[10px] text-gray-500 mt-2">Équivalent en valeur locale disponible pour le transfert</p>
      </div>

      {/* Formulaire de demande de paiement */}
      <form onSubmit={handleWithdraw} className="space-y-4 bg-gray-950 p-4 rounded-xl border border-gray-900">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">1. Choisir l'opérateur local</label>
          <select 
            value={operator} 
            onChange={e => setOperator(e.target.value)}
            className="w-full bg-gray-900 rounded-xl p-3 text-sm outline-none border border-gray-800 text-white font-bold"
          >
            <option value="MTN">MTN MoMo</option>
            <option value="Orange">Orange Money</option>
            <option value="Credit">Crédit de Communication</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">2. Numéro de téléphone</label>
          <input 
            type="tel"
            placeholder="Ex: 6xxxxxxxx"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="w-full bg-gray-900 rounded-xl p-3 text-sm outline-none border border-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">3. Montant à convertir (V10)</label>
          <input 
            type="number"
            placeholder="Ex: 50"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-gray-900 rounded-xl p-3 text-sm outline-none border border-gray-800 text-white font-bold text-green-400"
          />
        </div>

        {message && (
          <p className="text-xs p-3 bg-gray-900 rounded-lg text-center font-medium leading-relaxed">
            {message}
          </p>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-800 text-black font-bold py-3 rounded-xl text-xs transition-transform active:scale-95"
        >
          {loading ? 'Validation en cours...' : 'Confirmer la conversion'}
        </button>
      </form>
    </div>
  )
      }
