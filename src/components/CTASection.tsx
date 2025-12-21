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
    <section id="survey" ref={sectionRef} className="relative py-32 overflow-hidden bg-background transform-gpu">
      {/* CSS pre plynulú animáciu tlačidla */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gentleFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gentle-flow {
          background-size: 200% 200%;
          animation: gentleFlow 6s ease-in-out infinite;
        }
      `}} />

      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Circuit decoration */}
      <svg className="absolute inset-0 w-full h-full opacity-10 z-0 pointer-events-none" preserveAspectRatio="none">
        <defs>
          <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
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
              Coming Soon
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">This is Just the</span>
            <br />
            <span className="text-primary neon-text">Beginning</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            What you've experienced is a demo of an upcoming full-featured digital
            electronics learning platform. Help shape the future of this project by
            sharing your thoughts and suggestions.
          </p>

          <div className="glass-panel rounded-2xl p-8 mb-8 border border-white/5 backdrop-blur-sm bg-card/30 shadow-xl">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              We'd Love Your Feedback
            </h3>
            <p className="text-muted-foreground mb-6">
              Take a quick survey to help us understand what features matter most to you.
              Your input will directly influence the development roadmap.
            </p>

            {/* Plynulé tlačidlo (Gentle Flow) */}
            <a
              href="https://forms.gle/F8NYDLqyKaUw44N69"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-primary via-secondary to-primary animate-gentle-flow text-primary-foreground font-display font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 30px hsl(180, 100%, 50%, 0.3), 0 0 60px hsl(160, 100%, 50%, 0.2)",
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Take the Survey
            </a>
          </div>

          {/* VRÁTENÉ VŠETKY TRI IKONKY POD PANELOM */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">~2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm">Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Your voice matters</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;