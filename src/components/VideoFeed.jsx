import React, { useState, useRef, useEffect } from 'react';

// Exemple de données pour le flux
const feedData = [
  { id: 1, user: "Pasteur Jean", videoUrl: "/videos/temoignage1.mp4", caption: "Gloire à Dieu pour ce miracle ! 🙏", likes: 1240 },
  { id: 2, user: "Sœur Marie", videoUrl: "/videos/louange.mp4", caption: "Un moment de louange profonde.", likes: 890 },
];

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    // Configuration de l'observateur pour détecter la vidéo visible à au moins 60%
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6,
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

    // Récupérer tous les conteneurs de vidéos actuels pour les observer
    const currentVideos = videoRefs.current;
    currentVideos.forEach((videoWrapper) => {
      if (videoWrapper) observer.observe(videoWrapper);
    });

    return () => {
      currentVideos.forEach((videoWrapper) => {
        if (videoWrapper) observer.unobserve(videoWrapper);
      });
    };
  }, []);

  // Gérer la lecture / pause physique de l'élément <video> selon l'index actif
  useEffect(() => {
    videoRefs.current.forEach((wrapper, index) => {
      if (!wrapper) return;
      const videoElement = wrapper.querySelector('video');
      if (!videoElement) return;

      if (index === activeIndex) {
        videoElement.play().catch((err) => console.log("Lecture auto bloquée par le navigateur :", err));
      } else {
        videoElement.pause();
        videoElement.currentTime = 0; // Réinitialise la vidéo au début
      }
    });
  }, [activeIndex]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll no-scrollbar"
    >
      {feedData.map((item, index) => (
        <div 
          key={item.id} 
          data-index={index}
          ref={(el) => (videoRefs.current[index] = el)}
          className="h-screen w-full relative snap-start"
        >
          {/* Vidéo plein écran */}
          <video
            className="w-full h-full object-cover"
            src={item.videoUrl}
            loop
            muted
            playsInline
          />

          {/* Overlay des actions sociales */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-10">
            <button className="flex flex-col items-center text-white">
              <span className="text-3xl">❤️</span>
              <span className="text-xs font-bold">{item.likes}</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <span className="text-3xl">💬</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <span className="text-3xl">📤</span>
            </button>
          </div>

          {/* Overlay Texte / Infos */}
          <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/90 to-transparent z-10">
            <h3 className="text-white font-bold text-lg">@{item.user}</h3>
            <p className="text-white text-sm mt-1">{item.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
