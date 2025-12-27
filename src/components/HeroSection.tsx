import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mascotRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Úvodný setup
      gsap.set(mascotRef.current, { y: 100, opacity: 0, rotation: 15 });

      // 2. Animácia pri príchode
      const tl = gsap.timeline({ delay: 0.5 });
      tl.to(mascotRef.current, {
        y: 0,
        opacity: 1,
        rotation: -5,
        duration: 1.2,
        ease: "back.out(1.7)"
      });

      // 3. OPTIMALIZOVANÝ POHYB
      const xTo = gsap.quickTo(mascotRef.current, "x", { duration: 0.8, ease: "power2.out" });
      const yTo = gsap.quickTo(mascotRef.current, "y", { duration: 0.8, ease: "power2.out" });
      const rotTo = gsap.quickTo(mascotRef.current, "rotation", { duration: 0.8, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xMove = (clientX / innerWidth - 0.5) * 40;
        const yMove = (clientY / innerHeight - 0.5) * 30;
        const rot = (clientX / innerWidth - 0.5) * 20;

        xTo(xMove + 20);
        yTo(yMove - 10);
        rotTo(rot - 5);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      
      {/* NOVÉ POZADIE START */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-10 z-0 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ctaGrid)" />
      </svg>
      {/* NOVÉ POZADIE END */}

      <div className="relative z-10 container mx-auto px-6 text-center">
        
        <div className="hero-animate mb-6">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-secondary border border-secondary/30 rounded-full uppercase">
            Digital Logic Education Platform
          </span>
        </div>

        <div className="relative inline-block mb-8">
          <div 
            ref={mascotRef}
            className="absolute -top-20 -right-12 md:-top-32 md:-right-24 w-32 md:w-48 lg:w-64 pointer-events-none will-change-transform"
            style={{ zIndex: -1 }}
          >
            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
            <img 
              src="/assets/maskot.png" 
              alt="Mascot" 
              className="w-full h-auto drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]"
            />
            
            <div 
              ref={bubbleRef}
              className="absolute -top-10 -left-10 bg-primary text-black font-mono text-[10px] px-2 py-1 rounded-md font-bold rotate-[-10deg] opacity-0"
            >
              01001000 01001001!
            </div>
          </div>

          <h1 className="hero-animate font-display text-6xl md:text-8xl lg:text-9xl font-black leading-none select-none">
            <span className="text-primary neon-text">MemoryLeak</span>
          </h1>
        </div>

        <p className="hero-animate max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body mb-10 leading-relaxed">
          Start with transistors, end with a working assembly-level computer. Learn by building, not memorizing.
        </p>

        <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollToSection("#about")} className="btn-neon btn-neon-green text-sm">
              About MemoryLeak
          </button>
          <button onClick={() => scrollToSection("#gallery-showcase")} className="btn-neon text-sm">
              Open Gallery
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <svg className="w-6 h-6 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;