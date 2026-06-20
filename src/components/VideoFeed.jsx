import React, { useState, useRef } from 'react';

// Exemple de données pour le flux
const feedData = [
  { id: 1, user: "Pasteur Jean", videoUrl: "/videos/temoignage1.mp4", caption: "Gloire à Dieu pour ce miracle ! 🙏", likes: 1240 },
  { id: 2, user: "Sœur Marie", videoUrl: "/videos/louange.mp4", caption: "Un moment de louange profonde.", likes: 890 },
];

export default function VideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-screen w-full bg-black snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
      {feedData.map((item, index) => (
        <div key={item.id} className="h-screen w-full relative snap-start">
          {/* Vidéo plein écran */}
          <video
            className="w-full h-full object-cover"
            src={item.videoUrl}
            loop
            muted
            playsInline
            autoPlay={index === activeIndex}
          />

          {/* Overlay des actions sociales */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
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
          <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-bold text-lg">@{item.user}</h3>
            <p className="text-white text-sm mt-1">{item.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
