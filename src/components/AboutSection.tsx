import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. OPTIMALIZÁCIA: Statické dáta presunuté mimo komponent, aby sa nevytvárali pri každom renderi
const learningPath = [
  { title: "Transistors", desc: "The building blocks of all digital electronics" },
  { title: "Logic Gates", desc: "AND, OR, NOT and beyond" },
  { title: "ALU", desc: "Arithmetic Logic Unit - the brain's calculator" },
  { title: "Registers", desc: "Memory at the speed of light" },
  { title: "Simple CLI", desc: "Your first computer" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<SVGSVGElement>(null);

  // 2. OPTIMALIZÁCIA: Použitie useLayoutEffect (namiesto useEffect) pre zabránenie prebliknutiu
  useLayoutEffect(() => {
    // 3. OPTIMALIZÁCIA: Použitie gsap.context pre automatický cleanup (memory leaks)
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const diagram = diagramRef.current;

      // Ochrana, ak by refs ešte neboli načítané
      if (!section || !content || !diagram) return;

      // Animate content
      // Animujeme priamo children, vďaka ctx sú selektory bezpečné
      gsap.fromTo(
        content.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate diagram paths & nodes
      // Selektory fungujú v rámci diagramRef vďaka kontextu alebo priamemu volaniu
      const paths = diagram.querySelectorAll(".diagram-path");
      const nodes = diagram.querySelectorAll(".diagram-node");

      gsap.set(paths, { strokeDasharray: 500, strokeDashoffset: 500 });

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: diagram,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        nodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: diagram,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef); // Scope pre gsap.context

    // DÔLEŽITÉ: Cleanup funkcia, ktorá zruší všetky animácie a triggery pri odchode zo stránky
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-5" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={contentRef}>
            <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-primary border border-primary/30 rounded-full uppercase mb-6">
              What is this?
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Learn Digital</span>
              <br />
              <span className="text-primary neon-text">Electronics</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Project_Logic-gates is an interactive educational platform designed to teach
              you digital electronics from the absolute fundamentals. Starting with
              transistors, you'll progressively build your understanding until you can
              construct a working computer.
            </p>

            <div className="space-y-4">
              {learningPath.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-mono text-sm text-primary font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Diagram */}
          <div className="relative">
            <svg
              ref={diagramRef}
              viewBox="0 0 400 500"
              className="w-full max-w-md mx-auto"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(160, 100%, 50%)" />
                </linearGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connection paths */}
              <path
                className="diagram-path"
                d="M200 60 L200 140"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                filter="url(#nodeGlow)"
              />
              <path
                className="diagram-path"
                d="M200 180 L200 240"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                filter="url(#nodeGlow)"
              />
              <path
                className="diagram-path"
                d="M200 280 L200 340"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                filter="url(#nodeGlow)"
              />
              <path
                className="diagram-path"
                d="M200 380 L200 440"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                filter="url(#nodeGlow)"
              />

              {/* Nodes */}
              {[
                { y: 40, label: "Transistors" },
                { y: 160, label: "Logic Gates" },
                { y: 260, label: "ALU" },
                { y: 360, label: "Registers" },
                { y: 460, label: "CLI Computer" },
              ].map((node, i) => (
                <g key={i} className="diagram-node">
                  <rect
                    x="100"
                    y={node.y - 20}
                    width="200"
                    height="40"
                    rx="8"
                    fill="hsl(220, 15%, 8%)"
                    stroke="hsl(180, 100%, 50%)"
                    strokeWidth="2"
                    filter="url(#nodeGlow)"
                  />
                  <text
                    x="200"
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-foreground font-display text-sm"
                  >
                    {node.label}
                  </text>
                  {i < 4 && (
                    <polygon
                      points={`200,${node.y + 35} 195,${node.y + 25} 205,${node.y + 25}`}
                      fill="hsl(160, 100%, 50%)"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;