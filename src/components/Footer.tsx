import { Youtube, MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/80 border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel text-sm text-primary mb-2">MINECRAFT CHALLENGES</h3>
            <p className="font-gaming text-muted-foreground text-sm">
              pixelowyPL & Inexus
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@pixelowyPL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-redstone transition-colors group"
            >
              <Youtube className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-accent transition-colors group"
            >
              <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-gaming">
            <span>Stworzone z</span>
            <Heart className="w-4 h-4 text-redstone" />
            <span>w 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
