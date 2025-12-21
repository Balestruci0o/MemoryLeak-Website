import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />

          <div className="flex items-center gap-8">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#demo"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Demo
            </a>
            <a
              href="#calculator"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Calculator
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MemoryLeak
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
