import { Youtube, MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/80 border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel text-sm text-primary mb-2">MINECRAFT CHALLENGES</h3>
            <p className="font-minecraft text-lg text-muted-foreground">
              pixelowyPL & Inexus
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@pixelowyPL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-redstone transition-all duration-300 group hover:scale-110"
              title="pixelowyPL"
            >
              <Youtube className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="https://youtube.com/@Inexus"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-diamond transition-all duration-300 group hover:scale-110"
              title="Inexus"
            >
              <Youtube className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-accent transition-all duration-300 group hover:scale-110"
              title="Discord"
            >
              <MessageCircle className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-muted-foreground font-minecraft text-lg">
            <span>Stworzone z</span>
            <Heart className="w-5 h-5 text-redstone animate-pulse" />
            <span>w 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
