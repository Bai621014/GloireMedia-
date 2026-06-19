# 🌍 GloireMedia V10

> **Le TikTok Africain** — Créez du contenu positif, inspirez la communauté et gagnez des commissions convertibles en Mobile Money !

GloireMedia V10 est une plateforme mobile de partage de vidéos et de diffusions en direct conçue spécifiquement pour l'écosystème africain. Elle intègre un algorithme axé sur la positivité, l'édification spirituelle et la valorisation du contenu inspirant, tout en offrant une optimisation réseau agressive pour les connexions mobiles (3G/4G).

---

## ✨ Fonctionnalités Clés

* **📹 Flux de Contenu Positif :** Un espace de partage de vidéos soumis à une charte stricte de bienveillance et d'encouragement.
* **🙏 Gloire-Direct (Live Streaming) :** Intégration du **SDK Agora Audio/Video** pour suivre les moments de prière, d'intercession et d'édification (ex: flux en direct de Pasteur Chris) même à bas débit.
* **💳 Système de Commissions & Retrait Local :** Un portefeuille numérique intégré permettant de convertir vos jetons d'activité (`V10`) directement en Cash via **MTN MoMo**, **Orange Money** ou en **Crédit de communication**.
* **🛍️ Espace Publicitaire & Marketplace :** Un marché communautaire alimenté par Supabase pour booster vos propres affaires ou acheter des offres exclusives en utilisant vos gains.
* **⚡ Mode Hors-Ligne & Optimisation 3G :** Service Worker configuré pour mettre en cache les ressources essentielles et économiser les données mobiles.

---

## 🛠️ Stack Technique

* **Framework Frontend :** Next.js 14+ (App Router, `'use client'`)
* **Styles :** Tailwind CSS (Design Sombre / Premium Black & Gold)
* **Backend & Base de données :** Supabase (Authentification, profils, retraits, marketplace)
* **Live Streaming :** Agora Web SDK
* **Stockage Médias :** Cloudinary
* **PWA :** Service Workers natifs pour la gestion du cache et manifeste d'application mobile (`manifest.json`).

---

## 📦 Structure du Projet (Extraits)

* `manifest.json` : Configuration PWA avec gestion des couleurs thématiques (`#0A2AFF`, `#FFD700`).
* `sw.js` : Stratégie *Cache-First* pour les assets statiques, avec contournement automatique pour les requêtes dynamiques (Supabase & Cloudinary).
* `app/live/page.js` : Page interactive des flux en direct connectée à Agora.
* `app/retrait/page.js` : Formulaire de demande de virement mobile (MTN/Orange) avec synchronisation en temps réel du solde utilisateur.
* `app/market/page.js` : Vitrine des annonces actives récupérées dynamiquement depuis Supabase.

---

## 🚀 Installation & Développement Local

1. **Cloner le dépôt :**
```bash
   git clone [https://github.com/GloireMedia-/GloireMedia-.git](https://github.com/GloireMedia-/GloireMedia-.git)
   cd GloireMedia-
