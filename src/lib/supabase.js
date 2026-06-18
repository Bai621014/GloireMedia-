import { createClient } from '@supabase/supabase-js'

// Récupération des clés sécurisées de ton projet Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Sécurité : Vérification et alerte si les variables d'environnement manquent
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Attention : Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ne sont pas encore configurées sur Render / GloireHub."
  )
}

// Création et exportation du client unique pour tout l'écosystème GloireMedia
// Le repli sur des chaînes de texte évite un plantage bloquant lors de la compilation
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
