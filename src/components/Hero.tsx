import { Sword, Youtube, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pixel-pattern">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-dark/30 via-background to-background" />
      
      {/* Floating blocks decoration */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-grass rounded-sm animate-float opacity-20" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-12 h-12 bg-dirt rounded-sm animate-float opacity-20" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-stone rounded-sm animate-float opacity-20" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-diamond rounded-sm animate-float opacity-20" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main title */}
        <div className="mb-8">
          <h1 className="font-pixel text-2xl md:text-4xl lg:text-5xl text-primary glow-text mb-4 leading-relaxed">
            MINECRAFT
          </h1>
          <h2 className="font-pixel text-xl md:text-3xl lg:text-4xl text-foreground mb-6">
            CHALLENGES
          </h2>
        </div>
        
        {/* Creators */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12">
          <div className="flex items-center gap-3 bg-card/80 px-6 py-4 rounded-lg pixel-border">
            <Youtube className="w-8 h-8 text-redstone" />
            <span className="font-gaming text-xl md:text-2xl text-foreground">pixelowyPL</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Sword className="w-8 h-8 text-gold rotate-45" />
            <span className="font-pixel text-sm text-muted-foreground">VS</span>
            <Sword className="w-8 h-8 text-gold -rotate-45" />
          </div>
          
          <div className="flex items-center gap-3 bg-card/80 px-6 py-4 rounded-lg pixel-border">
            <Users className="w-8 h-8 text-diamond" />
            <span className="font-gaming text-xl md:text-2xl text-foreground">Inexus</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="font-gaming text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Dołącz do nas w epickich wyzwaniach Minecraft! 
          Zarejestruj się i weź udział w niesamowitych challenge'ach!
        </p>
        
        {/* CTA Button */}
        <a 
          href="#challenges" 
          className="inline-block pixel-button px-8 py-4 text-primary-foreground"
        >
          ZOBACZ WYZWANIA
        </a>
      </div>
      
      {/* Bottom grass decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-grass-dark to-grass opacity-30" />
    </section>
  );
};

export default Hero;
