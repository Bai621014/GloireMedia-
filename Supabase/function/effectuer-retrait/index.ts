import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// TAUX: 1 GC = 100 FCFA. Donc 500 GC = 50 000 FCFA
const TAUX_GC_TO_FCFA = 100; 
const MIN_RETRAIT_FCFA = 50000;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. AUTH: Récupère l'user connecté
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! }
    })
    const { data: { user } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { amount_fcfa, phone } = await req.json() // On envoie que FCFA depuis le front
    if (!phone) throw new Error('Numéro manquant')
    if (amount_fcfa < MIN_RETRAIT_FCFA) throw new Error(`Min: ${MIN_RETRAIT_FCFA} FCFA`)
    if (amount_fcfa % TAUX_GC_TO_FCFA !== 0) throw new Error(`Montant doit être multiple de ${TAUX_GC_TO_FCFA}`)

    const amount_gc = amount_fcfa / TAUX_GC_TO_FCFA;
    const phoneClean = phone.replace(/\D/g, ''); // 62101468

    // 2. CLIENT ADMIN pour toucher l'argent
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 3. TRANSACTION ATOMIQUE: lock la ligne wallet via RPC
    const { data: retrait, error: rErr } = await supabaseAdmin.rpc('creer_retrait', {
      p_user_id: user.id,
      p_amount_gc: amount_gc,
      p_amount_fcfa: amount_fcfa,
      p_phone: phoneClean
    })
    if (rErr) throw rErr
    if (!retrait) throw new Error('Échec création retrait')

    // 4. APPEL MONETBIL PAYOUT TCHAD AIRTEL
    const monetbilRes = await fetch('https://api.monetbil.com/v1/payout', { // PAYOUT pas payin
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: 'TD',
        operator: 'airtel',
        account_number: phoneClean,
        amount: amount_fcfa,
        currency: 'XAF',
        serviceKey: Deno.env.get('MONETBIL_SERVICE_KEY'),
        secretKey: Deno.env.get('MONETBIL_SECRET_KEY'),
        reference: retrait.id, // ID du retrait Supabase
        webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-monetbil`
      })
    })

    const monetbilData = await monetbilRes.json();
    if (!monetbilRes.ok) {
      // Rembourse si Monetbil refuse
      await supabaseAdmin.rpc('annuler_retrait', { p_retrait_id: retrait.id });
      throw new Error(monetbilData.message || 'Échec appel Monetbil');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Demande de 50000 FCFA transmise à Airtel',
      transaction_id: retrait.id 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 
    })
  }
})
