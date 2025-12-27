import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Power Line - rastie počas celého scrollu sekcie
      gsap.fromTo(".power-line", 
        { scaleY: 0 }, 
        { 
          scaleY: 1, 
          ease: "none", 
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1,
          }
        }
      );

      // 2. Focus System
      const textBlocks = gsap.utils.toArray(".reveal-block");
      textBlocks.forEach((block: any, index: number) => {
        const isFirst = index === 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: isFirst ? "top 85%" : "top 75%",
            end: "bottom 10%", 
            scrub: 0.5,
          }
        });

        tl.to(block, { 
          opacity: 1, 
          filter: "blur(0px)", 
          y: 0, 
          duration: 1 
        }) 
        .to(block, { 
          opacity: 1, 
          filter: "blur(0px)", 
          duration: 4 
        })
        .to(block, { 
          opacity: 0.1, 
          filter: "blur(10px)", 
          duration: 1 
        });
      });

      // 3. Statické zobrazenie tagov
      gsap.from(".static-tags", {
        opacity: 0,
        y: 10,
        duration: 1,
        scrollTrigger: {
          trigger: ".static-tags",
          start: "top 95%",
          toggleActions: "play none none reverse"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-48 overflow-hidden bg-background font-body" // Rajdhani ako základ
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center self-stretch">
            {/* JetBrains Mono pre tech popisky */}
            <div className="font-mono text-[10px] text-primary/40 mb-4 italic select-none uppercase tracking-widest">Init</div>
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-primary/30" />
            <div className="w-2 h-2 rounded-full border border-primary shadow-[0_0_10px_#3b82f6]" />
            <div className="power-line w-[2px] flex-grow bg-primary origin-top shadow-[0_0_15px_#3b82f6] relative" />
            <div className="font-mono text-[10px] text-primary/40 mt-4 italic select-none uppercase tracking-widest">End</div>
          </div>

          <div className="lg:col-span-11 max-w-4xl">
            <div className="pl-4 md:pl-12 border-l border-white/5 space-y-32">
              
              {/* BLOK 1 - Mission Statement */}
              <div className="reveal-block opacity-10 filter blur-[10px] translate-y-4">
                <span className="inline-block px-4 py-1.5 text-[10px] font-mono font-semibold tracking-widest text-primary border border-primary/30 rounded-full uppercase mb-6">
                  01_Purpose
                </span>
                {/* Orbitron pre nadpisy */}
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 uppercase italic leading-tight tracking-tight">
                  Removes the <br /> 
                  <span className="text-primary neon-text">Mystery</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                  MemoryLeak is an interactive learning game that removes the mystery behind computers. 
                  Instead of memorizing concepts or watching diagrams, you construct everything step by step.
                </p>
              </div>

              {/* BLOK 2 - Process */}
              <div className="reveal-block opacity-10 filter blur-[10px] translate-y-4">
                <div className="flex items-center gap-4 mb-4 text-primary/50 uppercase font-mono text-[10px] tracking-widest">
                   <div className="h-px w-10 bg-primary/30" />
                   <span>02_Process</span>
                </div>
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                    You begin with individual transistors, turn them into logic gates, combine them into circuits, 
                    and slowly assemble an entire computer that behaves exactly as real hardware does.
                  </p>

                  <p className="text-primary/60 font-mono text-[10px] italic uppercase tracking-wider">
                    // Every system you touch exists because you built it.
                  </p>
                </div>
              </div>

              {/* FOCUS BLOK 3 */}
              <div className="reveal-block opacity-10 filter blur-[10px] translate-y-4">
                <div className="grid md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                  <div className="space-y-3 font-mono text-[11px] text-foreground/50 italic leading-relaxed">
                    <p>Every system exists because you built it.</p>
                    <p>Every instruction works because you understand it.</p>
                  </div>
                  
                  <div className="md:text-right">
                    {/* Orbitron pre dramatický efekt */}
                    <h3 className="text-primary neon-text font-display text-3xl md:text-4xl font-black uppercase italic leading-none tracking-tighter">
                      No shortcuts. <br />
                      No black boxes. <br />
                      No “magic”.
                    </h3>
                  </div>
                </div>
              </div>

              {/* STATICKÉ TAGY - JetBrains Mono */}
              <div className="static-tags flex flex-wrap gap-8 pt-10 border-t border-white/5 font-mono text-[10px] tracking-[0.3em] text-primary/40 uppercase">
                {["Sandbox Mode", "Levels", "Turing Complete"].map(tag => (
                  <span key={tag} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary/40 rounded-full shadow-[0_0_5px_#3b82f6]" />
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;