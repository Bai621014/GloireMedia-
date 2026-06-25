import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { effectuerRetrait } from './monetbil'; // Assurez-vous que le chemin est correct

// Initialisation de Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
