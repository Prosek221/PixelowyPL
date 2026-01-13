import { Pickaxe, Skull, Castle, Flame, Mountain, Swords } from "lucide-react";
import ChallengeCard from "./ChallengeCard";
import speedrunImg from "@/assets/challenge-speedrun.jpg";
import hardcoreImg from "@/assets/challenge-hardcore.jpg";
import buildImg from "@/assets/challenge-build.jpg";
import miningImg from "@/assets/challenge-mining.jpg";
import skyblockImg from "@/assets/challenge-skyblock.jpg";
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
    title: "Hardcore Survival",
    description: "100 dni na hardcorze bez umierania. Czy uda się przetrwać najgorsze noce?",
    icon: Skull,
    difficulty: "ekstremalny" as const,
    image: hardcoreImg,
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
    title: "Skyblock Challenge",
    description: "Zacznij na małej wyspie w niebie i rozbuduj ją do potężnej bazy!",
    icon: Mountain,
    difficulty: "średni" as const,
    image: skyblockImg,
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
          <h2 className="font-pixel text-xl md:text-3xl text-primary glow-text mb-4">
            NASZE WYZWANIA
          </h2>
          <p className="font-gaming text-lg text-muted-foreground max-w-xl mx-auto">
            Wybierz wyzwanie i zgłoś się do udziału! Każdy challenge to niesamowita przygoda!
          </p>
        </div>
        
        {/* Challenges grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.title} {...challenge} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
