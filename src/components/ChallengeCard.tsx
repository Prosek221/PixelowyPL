import { LucideIcon } from "lucide-react";

interface ChallengeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: "łatwy" | "średni" | "trudny" | "ekstremalny";
  image: string;
}

const difficultyColors = {
  łatwy: "bg-emerald text-primary-foreground",
  średni: "bg-gold text-primary-foreground", 
  trudny: "bg-redstone text-foreground",
  ekstremalny: "bg-gradient-to-r from-redstone to-diamond text-foreground",
};

const ChallengeCard = ({ title, description, icon: Icon, difficulty, image }: ChallengeCardProps) => {
  return (
    <div className="challenge-card rounded-lg group cursor-pointer animate-glow-pulse">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Difficulty badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full font-pixel text-xs uppercase ${difficultyColors[difficulty]}`}>
          {difficulty}
        </div>
        
        {/* Icon */}
        <div className="absolute bottom-3 left-3 w-12 h-12 bg-primary/90 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-pixel text-base text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="font-minecraft text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ChallengeCard;
