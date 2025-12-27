import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryHeroSliderProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
  prefersReducedMotion: boolean;
}

const GalleryHeroSlider: React.FC<GalleryHeroSliderProps> = ({
  items,
  onItemClick,
  prefersReducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  const highlightItems = useMemo(() => items.slice(0, 5), [items]);

  const checkScroll = useCallback(() => {
    const s = sliderRef.current;
    if (!s) return;
    const left = s.scrollLeft > 20;
    const right = s.scrollLeft < s.scrollWidth - s.offsetWidth - 20;
    setCanScroll((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion || !containerRef.current) return;

      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom -5000%", 
            toggleActions: "play none none reverse",
          }
        }
      );

      gsap.fromTo(".hero-slide", 
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1, 
          stagger: 0.08, 
          duration: 0.6, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sliderRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, containerRef);

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      ctx.revert();
      window.removeEventListener("resize", checkScroll);
    };
  }, [prefersReducedMotion, checkScroll]);

  const handleSlideChange = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, highlightItems.length - 1));
    setActiveIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const scrollToSlide = (index: number) => {
    const container = sliderRef.current;
    const slides = container?.querySelectorAll<HTMLDivElement>(".hero-slide");
    if (!container || !slides?.[index]) return;

    const target = slides[index];
    const scrollTarget = target.offsetLeft - (container.offsetWidth * 0.04);

    gsap.to(container, {
      scrollLeft: Math.max(0, Math.min(scrollTarget, container.scrollWidth - container.offsetWidth)),
      duration: 0.7,
      ease: "expo.out",
      overwrite: "auto",
      onUpdate: checkScroll
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-transparent select-none flex flex-col justify-start pt-4 pb-12 will-change-[opacity,transform]"
    >
      {/* Navigačné šípky */}
      <button 
        onClick={() => handleSlideChange(activeIndex - 1)}
        disabled={!canScroll.left}
        className="absolute left-4 top-[40%] -translate-y-1/2 z-40 p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white transition-all hover:border-primary disabled:opacity-0 disabled:pointer-events-none hidden md:block"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={() => handleSlideChange(activeIndex + 1)}
        disabled={!canScroll.right}
        className="absolute right-4 top-[40%] -translate-y-1/2 z-40 p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white transition-all hover:border-primary disabled:opacity-0 disabled:pointer-events-none hidden md:block"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className="flex gap-8 overflow-x-auto py-4 pl-[4vw] pr-[4vw] no-scrollbar items-center bg-transparent"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollBehavior: "auto" }}
      >
        {highlightItems.map((item, index) => {
          const isComingSoon = !item.src;
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              className={`hero-slide flex-shrink-0 w-[260px] md:w-[380px] transition-all duration-700 group
                ${isActive ? "scale-105 z-10 opacity-100" : "scale-90 opacity-40 hover:opacity-80"}
                ${isComingSoon ? "cursor-default" : "cursor-pointer"}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => !isComingSoon && onItemClick(item)}
            >
              <div className={`relative transition-all duration-500 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg rounded-br-lg overflow-hidden border-2 
                ${isActive 
                  ? (isComingSoon ? "border-white/20 bg-white/5" : "border-primary shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-primary/5") 
                  : "border-white/10 bg-transparent"}
                backdrop-blur-sm ${!isComingSoon && "group-hover:border-primary/80"}`}>
                
                {/* Skenovací efekt iba pre dostupné položky */}
                {!isComingSoon && (
                  <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-y-full group-hover:animate-scan z-20 pointer-events-none" />
                )}

                <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center">
                  {isComingSoon ? (
                    /* COMING SOON PLACEHOLDER */
                    <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6">
                      <div className="absolute inset-0 opacity-5" 
                           style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      <span className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.3em] mb-1">Status: Locked</span>
                      <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Coming Soon</span>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={item.poster || item.src} 
                        alt={item.title} 
                        loading="lazy" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </>
                  )}

                  <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full z-20">
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${isComingSoon ? 'text-white/20' : 'text-primary/80'}`}>
                      {isComingSoon ? "Access Denied" : item.category}
                    </span>
                    <h3 className={`text-lg md:text-xl font-black mb-1 uppercase tracking-tighter transition-colors ${isComingSoon ? 'text-white/40' : 'text-white group-hover:text-primary'}`}>
                      {item.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-tight line-clamp-2">
                      {isComingSoon ? "This module is currently encrypted and under development." : item.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`mt-3 font-mono text-[10px] transition-all duration-500 
                ${isActive ? (isComingSoon ? "text-white/40" : "text-primary") : "text-white/20 opacity-50"}`}>
                0{index + 1} / {isComingSoon ? "ENCRYPTED_FILE" : "CORE_DATA"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indikátory (bodky) */}
      <div className="flex justify-center items-center gap-4 mt-6 h-6">
        {highlightItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-1 transition-all duration-500 
              ${index === activeIndex 
                ? (!item.src ? "w-10 bg-white/20" : "w-10 bg-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]") 
                : "w-3 bg-white/10 hover:bg-white/30"}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(1000%); } }
        .animate-scan { animation: scan 2s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default GalleryHeroSlider;