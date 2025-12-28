import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const learningPaths = [
  {
    id: "01",
    label: "Structured",
    title: "Guided Lessons",
    desc: "Follow interactive, step-by-step lessons that guide you from individual transistors to complete digital systems. Each lesson builds directly on circuits you have already constructed.",
    tag: "LEARNING_MODE_STRUCTURED"
  },
  {
    id: "02",
    label: "Contextual",
    title: "Learn While Building",
    desc: "Every component in the sandbox explains itself. Hover or inspect any element to see what it does, how it works internally, and how it’s used — without interrupting your workflow.",
    tag: "LEARNING_MODE_CONTEXT"
  },
  {
    id: "03",
    label: "Assistant",
    title: "AI Learning Assistant",
    desc: "An integrated AI assistant that understands your circuit. Ask why a signal behaves a certain way, get explanations, or receive guidance when something doesn’t work as expected.",
    tag: "LEARNING_MODE_AI"
  }
];

const LearningPathsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%", 
        pin: true,
        anticipatePin: 1, 
        scrub: 0.5,
        snap: {
          snapTo: 1 / (learningPaths.length - 1),
          delay: 0.1, 
          duration: { min: 0.2, max: 0.4 },
          ease: "power1.inOut"
        },
        onUpdate: (self) => {
          const index = Math.round(self.progress * (learningPaths.length - 1));
          setActiveIndex((prev) => (prev !== index ? index : prev));
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (index: number) => {
    if (!scrollTriggerRef.current) return;
    
    const st = scrollTriggerRef.current;
    const progress = index / (learningPaths.length - 1);
    const scrollToPoint = st.start + (st.end - st.start) * progress;

    window.scrollTo({
      top: scrollToPoint,
      behavior: "smooth"
    });
  };

  return (
    <section 
      id="learning" 
      ref={containerRef} 
      className="h-screen w-full bg-background flex items-center justify-center overflow-hidden border-y border-white/5 will-change-transform"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-4">
          <div className="mb-12">
            <span className="font-mono text-[10px] text-primary/40 uppercase tracking-[0.4em] mb-2 block">System_Interface</span>
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase italic leading-none">
              Learning <br /> <span className="text-primary neon-text">Logic</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {learningPaths.map((path, i) => (
              <button 
                key={path.id}
                onClick={() => handleNavClick(i)}
                className={`flex items-center gap-4 group transition-all duration-300 ${i === activeIndex ? 'translate-x-2' : 'opacity-20 hover:opacity-50'}`}
              >
                <span className="font-mono text-[10px] text-primary">{path.id}</span>
                <div className={`h-[2px] transition-all duration-500 ${i === activeIndex ? 'w-10 bg-primary shadow-[0_0_10px_#3b82f6]' : 'w-4 bg-white/20'}`} />
                <span className="font-display text-lg uppercase italic font-bold tracking-tight">{path.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="relative bg-black/40 border border-white/10 p-8 md:p-12 backdrop-blur-xl shadow-2xl lg:overflow-visible">
            <div className="absolute top-0 left-0 w-full px-6 py-2 border-b border-white/5 flex justify-between font-mono text-[8px] uppercase tracking-[0.3em] text-white/20">
              <span>Path_Selection</span>
              <span className="text-primary/60">{learningPaths[activeIndex].tag}</span>
            </div>

            <div className="min-h-[250px] flex flex-col justify-center mt-4 relative">
              <div key={activeIndex} className="animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-xl">
                  <h3 className="font-display text-4xl md:text-5xl font-black uppercase italic mb-6 leading-none">
                    {learningPaths[activeIndex].title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-body leading-relaxed italic">
                    "{learningPaths[activeIndex].desc}"
                  </p>
                  
                  <div className="mt-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    <div className="font-mono text-[9px] text-primary/40 uppercase">Ready_to_init</div>
                  </div>
                </div>

                {/* MASKOT - viditeľný len na desktope (lg a vyššie) */}
                {activeIndex === 2 && (
                  <div className="hidden lg:block absolute -right-20 -bottom-24 pointer-events-none select-none">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-60" />
                      <img 
                        src="/assets/maskot_pointing.png" 
                        alt="AI Assistant Mascot"
                        className="w-80 h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/40" />
          </div>
        </div>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
         {learningPaths.map((_, i) => (
           <div 
            key={i} 
            onClick={() => handleNavClick(i)}
            className={`w-1 h-8 cursor-pointer transition-all duration-500 ${i === activeIndex ? 'bg-primary shadow-[0_0_8px_#3b82f6]' : 'bg-white/5 hover:bg-white/20'}`} 
           />
         ))}
      </div>
    </section>
  );
};

export default LearningPathsSection;