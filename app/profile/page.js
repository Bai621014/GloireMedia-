'use client'
import React from 'react';
import UserProfile from '../../components/UserProfile'; // Ajustez le chemin selon votre structure

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* 
        Le composant UserProfile contient votre logique Pro 
        et la gestion des jetons V10.
      */}
      <UserProfile initialBalance={1250} />
      
      {/* Barre de navigation fixe (si vous ne l'avez pas déjà en layout) */}
      <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4 flex justify-around text-white">
        <a href="/home" className="text-xs">Maison</a>
        <a href="/explore" className="text-xs">Découvrir</a>
        <a href="/messages" className="text-xs">Messages</a>
        <a href="/profile" className="text-xs text-amber-500 font-bold">Moi</a>
      </nav>
    </main>
  );
    }
