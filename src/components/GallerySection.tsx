import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GalleryHeroSlider from "./gallery/GalleryHeroSlider";
import GalleryGrid from "./gallery/GalleryGrid";
import MediaModal from "./gallery/MediaModal";
import { useGallery } from "./gallery/useGallery";

gsap.registerPlugin(ScrollTrigger);

const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<SVGSVGElement>(null);

  const {
    galleryItems,
    isModalOpen,
    modalItem,
    isMuted,
    prefersReducedMotion,
    openModal,
    closeModal,
    navigateModal,
    toggleMute,
  } = useGallery();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Background circuit animation
    if (decorRef.current) {
      const paths = decorRef.current.querySelectorAll(".circuit-line");
      const dots = decorRef.current.querySelectorAll(".circuit-node");

      gsap.fromTo(
        paths,
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          duration: 3,
          stagger: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="gallery-showcase"
      ref={sectionRef}
      className="relative py-15 bg-gradient-to-b from-background via-card/30 to-background overflow-hidden"
    >
      {/* Background circuit decoration */}
      <svg
        ref={decorRef}
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
            <stop offset="50%" stopColor="hsl(160, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(60, 100%, 50%)" />
          </linearGradient>
        </defs>

        {/* Horizontal lines */}
        {[...Array(6)].map((_, i) => (
          <path
            key={`h-${i}`}
            className="circuit-line"
            d={`M0 ${150 + i * 150} Q ${300 + i * 50} ${130 + i * 150} ${600 + i * 100} ${150 + i * 150} T 1200 ${150 + i * 150}`}
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="1"
            strokeDasharray="1000"
          />
        ))}

        {/* Vertical lines */}
        {[...Array(8)].map((_, i) => (
          <path
            key={`v-${i}`}
            className="circuit-line"
            d={`M${100 + i * 150} 0 Q ${90 + i * 150} 300 ${100 + i * 150} 600 T ${100 + i * 150} 1200`}
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="1"
            strokeDasharray="1000"
          />
        ))}

        {/* Circuit nodes */}
        {[...Array(12)].map((_, i) => (
          <circle
            key={`node-${i}`}
            className="circuit-node"
            cx={100 + (i % 4) * 300}
            cy={150 + Math.floor(i / 4) * 200}
            r="4"
            fill="hsl(180, 100%, 50%)"
          />
        ))}
      </svg>

      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-primary border border-primary/30 rounded-full uppercase mb-6">
            Project Gallery
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Showcase &</span>{" "}
            <span className="text-primary neon-text">Creations</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Explore project builds, walkthroughs, and demonstrations. See digital
            circuits come to life through interactive creations.
          </p>
        </div>

        {/* Hero slider */}
        <GalleryHeroSlider
          items={galleryItems}
          onItemClick={openModal}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Grid */}
        <GalleryGrid
          items={galleryItems}
          onItemClick={openModal}
          prefersReducedMotion={prefersReducedMotion}
          isMuted={isMuted}
        />

        {/* Accessibility note */}
        <div className="mt-8 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">Tip:</span> Use arrow keys to navigate in modal, ESC to close.
            Videos autoplay muted when visible.
          </p>
        </div>
      </div>

      {/* Modal */}
      <MediaModal
        item={modalItem}
        isOpen={isModalOpen}
        isMuted={isMuted}
        onClose={closeModal}
        onNavigate={navigateModal}
        onToggleMute={toggleMute}
        prefersReducedMotion={prefersReducedMotion}
      />
    </section>
  );
};

export default GallerySection;
