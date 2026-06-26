import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as crypto from "https://deno.land/std@0.168.0/crypto/mod.ts";

const MONETBIL_SECRET = Deno.env.get('MONETBIL_SECRET_KEY')!; // À mettre dans Supabase > Project Settings > Edge Functions > Secrets

// Vérif HMAC SHA256 Monetbil
async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(MONETBIL_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return expected === signature;
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const rawBody = await req.text(); // CRITIQUE: text() avant json() pour la signature
  const signature = req.headers.get('x-monetbil-signature'); // Nom exact du header Monetbil

  if (!signature || !(await verifySignature(rawBody, signature))) {
    return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 401 });
  }

  const data = JSON.parse(rawBody);
  // Ex: { status: "success", transaction_id: "...", amount: 50000, phone: "62101468" }

  if (data.status === "success") {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Mets à jour ta table retraits en "payé"
    const { error } = await supabase
      .from('retraits')
      .update({ statut: 'paye', transaction_id: data.transaction_id })
      .eq('phone', data.phone)
      .eq('montant', data.amount);

    if (error) console.error(error);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
})
