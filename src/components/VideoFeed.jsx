import React, { useState, useRef, useEffect } from 'react';
import VideoCard from './VideoCard';

// Exemple de données de test (en attendant de lier Supabase ici)
const feedData = [
  { 
    id: 1, 
    title: "Gloire à Dieu pour ce miracle ! 🙏", 
    video_url: "/videos/temoignage1.mp4", 
    views: 1240,
    profiles: { username: "Pasteur Jean" }
  },
  { 
    id: 2, 
    title: "Un moment de louange profonde.", 
    video_url: "/videos/louange.mp4", 
    views: 890,
    profiles: { username: "Sœur Marie" }
  },
];

export default function VideoFeed({ user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6, // Détecte quand la vidéo occupe 60% de l'écran
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const currentCards = cardRefs.current;
    currentCards.forEach((cardWrapper) => {
      if (cardWrapper) observer.observe(cardWrapper);
    });

    return () => {
      currentCards.forEach((cardWrapper) => {
        if (cardWrapper) observer.unobserve(cardWrapper);
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll no-scrollbar"
    >
      {feedData.map((item, index) => (
        <div 
          key={item.id} 
          data-index={index}
          ref={(el) => (cardRefs.current[index] = el)}
          className="h-screen w-full relative snap-start flex justify-center items-center"
        >
          {/* On appelle VideoCard en lui disant s'il est actif ou non */}
          <VideoCard 
            video={item} 
            user={user} 
            isActive={index === activeIndex} 
          />
        </div>
      ))}
    </div>
  );
}
