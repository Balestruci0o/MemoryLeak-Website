import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GalleryItem } from "./types";

interface MediaModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  isMuted: boolean;
  onClose: () => void;
  onNavigate: (direction: "next" | "prev") => void;
  onToggleMute: () => void;
  prefersReducedMotion: boolean;
}

const MediaModal: React.FC<MediaModalProps> = ({
  item, isOpen, isMuted, onClose, onNavigate, onToggleMute, prefersReducedMotion,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. ANIMÁCIA (Open/Close) cez GSAP Context pre čistú pamäť
  useEffect(() => {
    if (!modalRef.current) return;
    const ctx = gsap.context(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        gsap.set(modalRef.current, { display: "flex", opacity: 0 });
        gsap.timeline({ defaults: { ease: "expo.out", duration: 0.5 } })
          .to(modalRef.current, { opacity: 1, duration: 0.3 })
          .fromTo(contentRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1 }, "-=0.2");
      } else {
        document.body.style.overflow = "";
        gsap.to(modalRef.current, { 
          opacity: 0, 
          duration: 0.3, 
          onComplete: () => {
            gsap.set(modalRef.current, { display: "none" });
            if (videoRef.current) videoRef.current.pause();
          } 
        });
      }
    }, modalRef);
    return () => ctx.revert();
  }, [isOpen]);

  // 2. KLÁVESY (ESC, Šípky)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate("next");
      if (e.key === "ArrowLeft") onNavigate("prev");
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isOpen, onClose, onNavigate]);

  // 3. GSAP HOVER EFEKT pre všetky tlačidlá
  const hover = (e: React.MouseEvent, enter: boolean) => {
    if (prefersReducedMotion) return;
    gsap.to(e.currentTarget, { 
      scale: enter ? 1.05 : 1, 
      backgroundColor: enter ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
      duration: 0.2, 
      overwrite: "auto" 
    });
  };

  if (!item) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100] items-center justify-center hidden opacity-0" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

      {/* Main Content Card */}
      <div ref={contentRef} className="relative z-10 w-full max-w-6xl mx-4 flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        
        {/* MEDIA SECTION */}
        <div className="relative flex-grow bg-black flex items-center justify-center min-h-[300px] group">
          {item.type === "image" ? (
            <img src={item.src} alt={item.title} className="max-w-full max-h-full object-contain select-none" />
          ) : (
            <div className="relative w-full h-full flex items-center">
              <video ref={videoRef} src={item.src} autoPlay muted={isMuted} loop playsInline className="w-full h-full object-contain" />
              <button 
                onClick={onToggleMute} 
                onMouseEnter={e => hover(e, true)} 
                onMouseLeave={e => hover(e, false)} 
                className="absolute bottom-6 right-6 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white uppercase tracking-widest outline-none"
              >
                {isMuted ? "Muted" : "Audio ON"}
              </button>
            </div>
          )}

          {/* Navigation Overlay (Visible on Hover) */}
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Prev Button */}
            <button 
              onClick={() => onNavigate("prev")} 
              onMouseEnter={e => hover(e, true)} 
              onMouseLeave={e => hover(e, false)} 
              className="pointer-events-auto p-4 rounded-full bg-black/40 border border-white/10 text-white outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button 
              onClick={() => onNavigate("next")} 
              onMouseEnter={e => hover(e, true)} 
              onMouseLeave={e => hover(e, false)} 
              className="pointer-events-auto p-4 rounded-full bg-black/40 border border-white/10 text-white outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="w-full md:w-[380px] shrink-0 p-8 flex flex-col bg-[#0d0d0d] border-l border-white/5 shadow-inner">
          <span className="w-fit px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 uppercase mb-6 tracking-widest">
            {item.category}
          </span>
          
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">
            {item.title}
          </h2>
          
          <p className="text-white/50 text-sm leading-relaxed mb-auto font-light">
            {item.description}
          </p>

          {/* Footer Tip Section */}
          <div className="mt-8 pt-6 border-t border-white/5 opacity-40 font-mono text-[9px] uppercase tracking-tight">
            <p className="text-white/50 mb-1 leading-relaxed">
              Tip: Use arrow keys to navigate in modal, ESC to close. Videos autoplay muted when visible.
            </p>
            <p className="text-primary italic font-bold tracking-[0.15em]">
              Practice Tool
            </p>
          </div>

          <button 
            onClick={onClose} 
            onMouseEnter={e => hover(e, true)} 
            onMouseLeave={e => hover(e, false)} 
            className="mt-8 w-full py-4 rounded-xl border border-white/10 bg-white/5 text-[10px] font-mono text-white uppercase tracking-[0.2em] outline-none"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;