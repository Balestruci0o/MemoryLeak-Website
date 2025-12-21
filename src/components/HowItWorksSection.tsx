import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Understand the Basics",
    description: "Start with transistors - the fundamental building blocks. Learn how a simple switch can become the foundation of all computing.",
  },
  {
    number: "02",
    title: "Build Logic Gates",
    description: "Combine transistors to create AND, OR, NOT, XOR, and more. Watch how binary decisions form the basis of digital logic.",
  },
  {
    number: "03",
    title: "Construct Complex Circuits",
    description: "Use gates to build adders, multiplexers, encoders, and decoders. See how simple components create powerful circuits.",
  },
  {
    number: "04",
    title: "Design the ALU",
    description: "Build the Arithmetic Logic Unit - the heart of any processor. Perform addition, subtraction, and logical operations.",
  },
  {
    number: "05",
    title: "Create Memory Systems",
    description: "Implement registers and latches. Store data and create the memory architecture that makes computing possible.",
  },
  {
    number: "06",
    title: "Build Your Computer",
    description: "Combine everything into a working CLI computer. Execute commands, run programs, and witness your creation come to life.",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const section = sectionRef.current;
      const timeline = timelineRef.current;
      const line = lineRef.current;
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");

      if (!section || !timeline || !line) return;

      if (isDesktop) {
        // RESET PRE DESKTOP
        gsap.set(items, { opacity: 0, y: 10 }); // Menší y offset pre rýchlejší pocit "usadenia"
        gsap.set(".timeline-node", { scale: 0 });
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${timeline.scrollWidth}`,
            scrub: 0.4, // Mierne svižnejšie ako 0.5
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Pohyb timeline doľava
        tl.to(timeline, {
          x: () => -(timeline.scrollWidth - window.innerWidth),
          ease: "none",
        }, 0);

        // Rast vodiacej linky
        tl.to(line, {
          scaleX: 1,
          ease: "none",
        }, 0);

        // ANIMÁCIA KARIET - Zrýchlený nástup
        items.forEach((item, index) => {
          // KĽÚČOVÁ ZMENA: 
          // Namiesto (index / items.length) * 0.7 (čo rozťahovalo animáciu na celú dĺžku scrollu)
          // teraz používame progresívny fixný štart. Karty sa "vybalia" oveľa skôr.
          const appearanceStart = index * 0.08; 
          
          tl.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.1, // Kratšia duration pre promptnejší pocit
            ease: "power1.out",
          }, appearanceStart);

          const node = item.querySelector(".timeline-node");
          if (node) {
            tl.to(node, {
              scale: 1,
              ease: "back.out(2)",
              duration: 0.1,
            }, appearanceStart + 0.01);
          }
        });

      } else {
        // MOBIL LOGIKA
        items.forEach((item) => {
          gsap.fromTo(item, 
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%", // Skôr na mobile (keď je karta 10% od spodku)
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="how-it-works"
      ref={sectionRef} 
      className="relative min-h-screen lg:h-screen w-full bg-background flex flex-col overflow-x-hidden"
    >
      {/* Background efekty */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed lg:absolute">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 z-0 pointer-events-none fixed lg:absolute" preserveAspectRatio="none">
        <defs>
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ctaGrid)" />
      </svg>

      <div className="relative z-10 h-full flex flex-col py-10 lg:py-10">
        
        {/* Header */}
        <div className="container mx-auto px-6 text-center shrink-0 mt-4 md:mt-10 mb-10 lg:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-accent/10 border border-accent/30 mb-4 md:mb-6">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono font-semibold text-accent uppercase tracking-wider">
              The Journey
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-6xl font-bold mb-3">
            <span className="text-foreground">Build Your</span>{" "}
            <span className="text-primary neon-text">Computer</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            From transistors to a fully functional computer - follow the complete journey.
          </p>
        </div>

        {/* Timeline Area */}
        <div className="relative flex-grow flex lg:items-center w-full">
          <div
            ref={timelineRef}
            className="flex flex-col gap-8 px-6 w-full lg:absolute lg:left-0 lg:flex-row lg:items-center lg:h-full lg:gap-0 lg:px-0 lg:pl-[25vw] lg:pr-[20vw] lg:w-auto"
          >
            <div
              ref={lineRef}
              className="hidden lg:block absolute top-1/2 left-0 h-[1px] md:h-[2px] bg-primary/40 -translate-y-1/2"
              style={{ width: "100%" }}
            />

            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="timeline-item relative flex-shrink-0 w-full lg:w-[320px] lg:h-full flex lg:items-center justify-center lg:mx-10">
                  <div className="timeline-node hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-background border-2 border-primary items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      <div className="relative z-10 text-primary scale-75 md:scale-90">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="6" y="6" width="12" height="12" rx="1" />
                          <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" strokeLinecap="round" />
                        </svg>
                      </div>
                  </div>
                  
                  <div className={`relative w-full lg:absolute ${isEven ? 'lg:bottom-[60%]' : 'lg:top-[60%]'}`}>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-2xl mx-auto max-w-md lg:mx-2 will-change-transform">
                      <div className="bg-zinc-900 px-3 py-2 md:px-3 md:py-1.5 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">module_{step.number}.sh</span>
                      </div>
                      
                      <div className="p-4 font-mono text-left">
                        <h3 className="text-primary text-xs mb-2 flex items-center gap-2">
                          <span className="text-zinc-600 font-bold">{">"}</span>
                          {step.title}
                        </h3>
                        <p className="text-zinc-400 text-sm md:text-[11px] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className={`hidden lg:block absolute left-1/2 -translate-x-1/2 w-0 border-l border-dashed border-primary/30 h-12 md:h-20 ${isEven ? 'top-full' : 'bottom-full'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* <div className="hidden lg:block text-center shrink-0 mt-4 md:mt-6 relative z-10">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-accent/5 backdrop-blur-md rounded-full border border-accent/20">
             <span className="text-muted-foreground font-mono text-[7px] md:text-[8px] uppercase tracking-[0.2em]">
               Scroll horizontally to explore the journey
             </span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorksSection;