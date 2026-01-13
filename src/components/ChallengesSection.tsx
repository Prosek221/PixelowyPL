import { Pickaxe, Castle, Flame, Swords } from "lucide-react";
import ChallengeCard from "./ChallengeCard";
import speedrunImg from "@/assets/challenge-speedrun.jpg";
import buildImg from "@/assets/challenge-build.jpg";
import miningImg from "@/assets/challenge-mining.jpg";
import pvpImg from "@/assets/challenge-pvp.jpg";

const challenges = [
  {
    title: "Speedrun Challenge",
    description: "Kto szybciej pokona Ender Dragona? Wielki wyścig z czasem w czystym świecie survival!",
    icon: Flame,
    difficulty: "trudny" as const,
    image: speedrunImg,
  },
  {
    title: "Build Battle",
    description: "30 minut na zbudowanie najlepszej konstrukcji. Widzowie głosują na zwycięzcę!",
    icon: Castle,
    difficulty: "średni" as const,
    image: buildImg,
  },
  {
    title: "Mining Race",
    description: "Kto pierwszy wykopie pełen zestaw diamentowych narzędzi i zbroi?",
    icon: Pickaxe,
    difficulty: "łatwy" as const,
    image: miningImg,
  },
  {
    title: "PvP Tournament",
    description: "Wielki turniej 1v1! Walcz o tytuł mistrza PvP naszego serwera!",
    icon: Swords,
    difficulty: "trudny" as const,
    image: pvpImg,
  },
];

const ChallengesSection = () => {
  return (
    <section id="challenges" className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-2xl md:text-4xl text-primary glow-text mb-4 animate-fade-in-up">
            NASZE WYZWANIA
          </h2>
          <p className="font-minecraft text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Wybierz wyzwanie i zgłoś się do udziału! Każdy challenge to niesamowita przygoda!
          </p>
        </div>
        
        {/* Challenges grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {challenges.map((challenge, index) => (
            <div key={challenge.title} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
              <ChallengeCard {...challenge} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
