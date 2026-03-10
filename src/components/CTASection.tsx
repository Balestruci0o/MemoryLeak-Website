import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="try-alpha"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-background transform-gpu"
    >
      {/* CSS pre plynulú animáciu tlačidiel */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes gentleFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gentle-flow {
              background-size: 200% 200%;
              animation: gentleFlow 6s ease-in-out infinite;
            }
          `,
        }}
      />

      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Circuit decoration */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 z-0 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0H0v40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ctaGrid)" />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
              Alpha Test
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">The First Test Version is Here!</span>
            <br />
            <span className="text-primary neon-text">Try it now</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            This is the very first alpha version of our digital electronics learning platform. 
            Download the desktop app (.exe) or try the web version directly in your browser 
            and experiment with circuits, simulations and basic lessons.
          </p>

          <div className="glass-panel rounded-2xl p-8 mb-10 border border-white/5 backdrop-blur-sm bg-card/30 shadow-xl">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">
              Alpha Version 0.1 – Test Release
            </h3>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a
                href="/game_download/MemoryLeak_0.1.zip" 
                download
                className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-gradient-to-r from-primary via-secondary to-primary animate-gentle-flow text-primary-foreground font-display font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_hsl(180,100%,50%,0.4)] shadow-[0_0_30px_hsl(180,100%,50%,0.25)] min-w-[260px]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download .exe (Windows)
              </a>

              <a
                href="https://balestruci0o.itch.io/memory-leak" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-white/10 border border-white/20 text-white font-display font-semibold tracking-wide transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:scale-105 min-w-[260px]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Try Web Version
              </a>
            </div>

            <p className="text-sm text-muted-foreground mt-6 text-center">
              This is an early test version – expect bugs and incomplete features.
            </p>
          </div>

          {/* Small info icons */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground mt-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">~100 MB</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Windows 10+</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              <span className="text-sm">Alpha – Browser & Desktop</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;