import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. AUTH: Récupère l'user connecté
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } }
    )
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { amount_fcfa, amount_gc, phone } = await req.json()
    if (amount_fcfa !== 12000000 || amount_gc !== 120000) throw new Error('Montant invalide')
    if (!phone) throw new Error('Numéro manquant')

    // 2. CLIENT ADMIN pour toucher l'argent
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 3. TRANSACTION ATOMIQUE: lock la ligne wallet
    const { data: wallet, error: wErr } = await supabaseAdmin
      .from('wallets')
      .select('gloirecoin')
      .eq('user_id', user.id)
      .single()

    if (wErr || !wallet) throw new Error('Wallet introuvable')
    if (wallet.gloirecoin < amount_gc) throw new Error(`Solde insuffisant: ${wallet.gloirecoin} GC`)

    // 4. DEBITE + INSERT RETRAIT PENDING DANS 1 TRANSACTION RPC
    const { data: retrait, error: rErr } = await supabaseAdmin.rpc('creer_retrait', {
      p_user_id: user.id,
      p_amount_gc: amount_gc,
      p_amount_fcfa: amount_fcfa,
      p_phone: phone.replace(/\s/g, '') // +23562101468 sans espace
    })
    if (rErr) throw rErr

    // 5. APPEL MONETBIL AIRTMONEY TCHAD
    const monetbilRes = await fetch('https://api.monetbil.com/v1/payin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount_fcfa,
        phone: phone.replace(/\s/g, ''),
        operator: 'airtel',
        currency: 'XAF',
        serviceKey: Deno.env.get('MONETBIL_SERVICE_KEY'),
        secretKey: Deno.env.get('MONETBIL_SECRET_KEY'),
        transaction_id: retrait.id, // ID du retrait Supabase
        webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-monetbil`
      })
    })

    if (!monetbilRes.ok) throw new Error('Échec appel Monetbil')

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Demande transmise à Monetbil',
      transaction_id: retrait.id 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 
    })
  }
})
