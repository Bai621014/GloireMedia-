import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialisation du client Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  try {
    // Récupération des données envoyées par Monetbil
    const body = await req.json()

    // Logique de validation : Vérification du statut de succès
    if (body && body.status === 'success') {
      
      // Mise à jour de la table 'retraits' dans Supabase
      // Assurez-vous que le champ 'id' dans la table correspond à 'transaction_id' envoyé par Monetbil
      const { error } = await supabase
        .from('retraits')
        .update({ 
          statut: 'paid', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', body.transaction_id)
        
      if (error) {
        console.error("Erreur mise à jour BDD:", error)
        return new Response(JSON.stringify({ error: "Échec lors de la mise à jour en base" }), { status: 500 })
      }

      return new Response(JSON.stringify({ message: "Transaction validée avec succès" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Réponse par défaut si le statut n'est pas 'success'
    return new Response(JSON.stringify({ message: "Statut non traité ou ignoré" }), { status: 200 })

  } catch (err) {
    console.error("Erreur serveur interne:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur interne" }), { status: 500 })
  }
})
