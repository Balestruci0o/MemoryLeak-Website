import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem } from "./types";

gsap.registerPlugin(ScrollTrigger);

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
  prefersReducedMotion: boolean;
  isMuted: boolean;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items, onItemClick, prefersReducedMotion, isMuted,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // 1. OBSERVER pre video - Optimalizovaný pre plynulosť
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src;
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" } // Začni načítavať o niečo skôr
    );

    videoRefs.current.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [items]);

  // Synchronizácia zvuku bez re-renderu celého listu
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      video.muted = isMuted;
    });
  }, [isMuted]);

  // 2. GSAP: Batch optimalizácia (výkonnejšie ako forEach trigger)
  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".gallery-card");
      if (!cards) return;

      // Použitie batch šetrí CPU, pretože nevyvoláva stovky výpočtov naraz
      ScrollTrigger.batch(cards, {
        onEnter: (batch) => gsap.to(batch, { 
          opacity: 1, y: 0, scale: 1, stagger: 0.1, overwrite: true 
        }),
        onLeaveBack: (batch) => gsap.to(batch, { 
          opacity: 0, y: 40, scale: 0.95, overwrite: true 
        }),
        start: "top 95%",
      });
    }, gridRef);

    return () => ctx.revert(); // Kompletné vyčistenie pamäte
  }, [items, prefersReducedMotion]);

  const setVideoRef = useCallback((id: string, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current.set(id, el);
    else videoRefs.current.delete(id);
  }, []);

  const gridItems = items.slice(5);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4"
    >
      {gridItems.map((item) => (
        <figure
          key={item.id}
          onClick={() => onItemClick(item)}
          className="gallery-card group relative cursor-pointer rounded-2xl overflow-hidden bg-card border border-white/5 shadow-xl transition-all duration-500 hover:shadow-primary/20 hover:border-primary/50 transform-gpu opacity-0 translate-y-10 scale-95"
        >
          {/* Neon Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
             <div className="absolute inset-[-2px] bg-gradient-to-t from-primary/40 to-transparent blur-md" />
          </div>

          <div className="aspect-[16/10] overflow-hidden bg-black relative">
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 transform-gpu"
              />
            ) : (
              <video
                ref={(el) => setVideoRef(item.id, el)}
                data-src={item.src}
                poster={item.poster}
                muted={isMuted}
                loop
                playsInline
                disablePictureInPicture
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-20" />
            
            {item.type === "video" && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 z-30">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
            )}
          </div>

          <figcaption className="relative z-30 p-5 bg-card/90 backdrop-blur-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-primary/30 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default GalleryGrid;