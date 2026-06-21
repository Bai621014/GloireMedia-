import { createClient } from '@supabase/supabase-js' // 🎯 CORRECTION : "import" en minuscules

// Utilisation immédiate de valeurs de secours pour tromper le compilateur Webpack si besoin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Création du client unique pour tout l'écosystème GloireMedia
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🌟 Exportation par défaut
export default supabase
