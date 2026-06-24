# 🌍 GloireMedia V10

> **Le TikTok Africain** — Créez du contenu positif, inspirez la communauté et gagnez des commissions convertibles en Mobile Money !

GloireMedia V10 est une plateforme mobile de partage de vidéos et de diffusions en direct conçue spécifiquement pour l'écosystème africain. Elle intègre un algorithme axé sur la positivité, l'édification spirituelle et la valorisation du contenu inspirant, tout en offrant une optimisation réseau agressive pour les connexions mobiles (3G/4G).

---

## ✨ Fonctionnalités Clés

* **📹 Flux de Contenu Positif :** Un espace de partage de vidéos soumis à une charte stricte de bienveillance et d'encouragement.
* **🙏 Gloire-Direct (Live Streaming) :** Intégration du **SDK Agora Audio/Video** pour suivre les moments de prière, d'intercession et d'édification, même à bas débit.
* **💳 Système de Commissions & Retrait Local :** Portefeuille numérique intégré permettant de convertir les jetons d'activité (`V10`) en Cash via **MTN MoMo**, **Orange Money** ou en **Crédit de communication**.
* **🛍️ Espace Publicitaire & Marketplace :** Marché communautaire alimenté par **Supabase** pour booster vos affaires ou acheter des offres exclusives.
* **⚡ Optimisation Mobile First :** Architecture légère et performante, optimisée pour une navigation fluide sur réseaux 3G/4G.

---

## 🛠️ Stack Technique

* **Framework Frontend :** React avec **Vite** (Architecture SPA ultra-performante)
* **Styles :** Tailwind CSS (Design Sombre / Premium Black & Gold)
* **Backend & Base de données :** Supabase (Authentification, profils, transactions sécurisées, marketplace)
* **Live Streaming :** Agora Web SDK
* **Stockage Médias :** Cloudinary
* **Performance :** Service Workers natifs pour la gestion du cache et déploiement optimisé sur **Render**.

---

## 📦 Structure du Projet (Extrait)

* `src/` : Cœur de l'application (Composants React, Logique Métier).
* `src/UserProfile.jsx` : Gestion du profil et des retraits utilisateur.
* `src/TransactionHistory.jsx` : Historique des transactions optimisé.
* `src/supabaseClient.js` : Client Supabase configuré avec `import.meta.env`.
* `src/exchangeRates.js` : Moteur de conversion monétaire local (XAF, XOF, USD).
* `public/` : Assets statiques et configuration PWA.

---

## 🚀 Installation & Développement

1. **Cloner le dépôt :**
```bash
git clone [https://github.com/GloireMedia-/GloireMedia-.git](https://github.com/GloireMedia-/GloireMedia-.git)
cd GloireMedia-
