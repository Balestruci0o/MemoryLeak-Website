import { useEffect, useRef } from "react";
import gsap from "gsap";

const Logo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Funkcia pre hladký scroll nahor
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      ref={logoRef} 
      onClick={scrollToTop} // Pridaný event handler
      className="flex items-center gap-3 group cursor-pointer"
    >
      {/* <div className="relative w-10 h-10">
        <img src="src/assets/maskot.png" alt="" />
      </div> */}
      
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold tracking-wider text-foreground">
          Project_
        </span>
        <span className="font-display text-sm font-semibold tracking-widest text-primary neon-text transition-colors group-hover:text-primary/80">
          MemoryLeak
        </span>
      </div>
    </div>
  );
};

export default Logo;