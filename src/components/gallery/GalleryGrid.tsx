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
      { threshold: 0.1, rootMargin: "100px" }
    );

    videoRefs.current.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      video.muted = isMuted;
    });
  }, [isMuted]);

  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".gallery-card");
      if (!cards) return;

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

    return () => ctx.revert();
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
      {gridItems.map((item) => {
        const isComingSoon = !item.src;

        return (
          <figure
            key={item.id}
            onClick={() => !isComingSoon && onItemClick(item)}
            className={`gallery-card group relative rounded-2xl overflow-hidden bg-card border border-white/5 shadow-xl transition-all duration-500 transform-gpu opacity-0 translate-y-10 scale-95
              ${isComingSoon ? "cursor-default" : "cursor-pointer hover:shadow-primary/20 hover:border-primary/40"}`}
          >
            {/* MODRÝ PRÚŽOK A GRADIENT - Zobrazí sa iba ak NIE JE Coming Soon */}
            {!isComingSoon && (
              <div className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#3b82f6]" />
              </div>
            )}

            <div className="aspect-[16/10] overflow-hidden bg-black relative flex items-center justify-center">
              {isComingSoon ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 overflow-hidden">
                  <div className="absolute inset-0 opacity-10" 
                       style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                  <div className="relative z-10 text-center">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.3em] block mb-1">Status: Locked</span>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              ) : item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu"
                />
              ) : (
                <video
                  ref={(el) => setVideoRef(item.id, el)}
                  data-src={item.src}
                  poster={item.poster}
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 z-20" />
            </div>

            <figcaption className="relative z-30 p-5 bg-card/95 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-display text-base font-bold transition-colors duration-300 ${isComingSoon ? 'text-foreground/70' : 'text-foreground group-hover:text-primary'}`}>
                  {item.title}
                </h3>
                {!isComingSoon && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-primary/30 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.type}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic font-light">
                {isComingSoon ? "Module initialization pending. Feature available in future updates." : item.description}
              </p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
};

export default GalleryGrid;