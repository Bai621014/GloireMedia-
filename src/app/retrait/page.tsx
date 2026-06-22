'use client'
import { useState, useEffect } from 'react'
import supabase from '../../config/supabase' 

export default function RetraitPage() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [operator, setOperator] = useState('MTN')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Chargement initial du solde
  useEffect(() => {
    async function loadUserBalance() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
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
    const val = parseFloat(amount)

    // Validation stricte
    if (!val || val <= 0) return setMessage({ text: '⚠️ Entrez un montant valide.', type: 'error' })
    if (val > balance) return setMessage({ text: '⚠️ Solde insuffisant.', type: 'error' })
    if (phoneNumber.length < 8) return setMessage({ text: '⚠️ Numéro de téléphone invalide.', type: 'error' })

    setLoading(true)
    setMessage({ text: 'Traitement...', type: 'info' })

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error("Session expirée.")
      
      // Insertion sécurisée
      const { error } = await supabase.from('withdrawals').insert({
        user_id: session.user.id,
        amount: val,
        operator,
        phone_number: phoneNumber,
        status: 'pending'
      })

      if (error) throw error

      // Mise à jour locale immédiate pour UX
      setBalance(prev => prev - val)
      setMessage({ text: '✅ Demande envoyée avec succès !', type: 'success' })
      setAmount('')
      setPhoneNumber('')
    } catch (err) {
      setMessage({ text: `❌ Erreur: ${err.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-black text-white min-h-screen pb-24 max-w-md mx-auto">
      {/* ... (Header et Solde restent identiques) ... */}
      
      {/* Affichage conditionnel des messages basé sur le type */}
      {message.text && (
        <p className={`text-xs p-3 rounded-lg text-center font-bold mb-4 ${
          message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'
        }`}>
          {message.text}
        </p>
      )}

      {/* Formulaire inchangé, mais assurez-vous de désactiver le bouton pendant le loading */}
    </div>
  )
}
