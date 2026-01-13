import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Gamepad2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  minecraftNick: z.string()
    .min(3, "Nick musi mieć minimum 3 znaki")
    .max(16, "Nick może mieć maksymalnie 16 znaków")
    .regex(/^[a-zA-Z0-9_]+$/, "Nick może zawierać tylko litery, cyfry i podkreślnik"),
  discordNick: z.string()
    .min(2, "Nick Discord musi mieć minimum 2 znaki")
    .max(32, "Nick Discord może mieć maksymalnie 32 znaki"),
  age: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 10 && num <= 99;
    }, "Wiek musi być liczbą między 10 a 99"),
  name: z.string()
    .min(2, "Imię musi mieć minimum 2 znaki")
    .max(50, "Imię może mieć maksymalnie 50 znaków"),
  email: z.string()
    .email("Podaj prawidłowy adres email")
    .max(255, "Email może mieć maksymalnie 255 znaków"),
  challenge: z.string().min(1, "Wybierz wyzwanie"),
  message: z.string().max(500, "Wiadomość może mieć maksymalnie 500 znaków").optional(),
});

type FormData = z.infer<typeof formSchema>;

const challenges = [
  "Speedrun Challenge",
  "Hardcore Survival",
  "Build Battle",
  "Mining Race",
  "Skyblock Challenge",
  "PvP Tournament",
];

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", data);
    toast.success("Zgłoszenie wysłane! Sprawdź swoją skrzynkę email.");
    setIsSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-card/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center py-16">
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
            <h3 className="font-pixel text-xl text-primary mb-4">ZGŁOSZENIE WYSŁANE!</h3>
            <p className="font-gaming text-lg text-muted-foreground">
              Dziękujemy za zgłoszenie! Odpowiemy na podany email najszybciej jak to możliwe.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-card/30 pixel-pattern">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h2 className="font-pixel text-xl md:text-2xl text-primary glow-text">
              ZGŁOŚ SIĘ!
            </h2>
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <p className="font-gaming text-lg text-muted-foreground">
            Chcesz wziąć udział w wyzwaniu? Wypełnij formularz poniżej!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card/80 p-6 md:p-8 rounded-lg pixel-border">
            {/* Minecraft Nick */}
            <div className="mb-5">
              <label className="block font-gaming text-sm text-foreground mb-2">
                Nick Minecraft *
              </label>
              <input
                {...register("minecraftNick")}
                type="text"
                placeholder="TwójNick123"
                className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {errors.minecraftNick && (
                <p className="text-redstone text-sm mt-1 font-gaming">{errors.minecraftNick.message}</p>
              )}
            </div>

            {/* Discord Nick */}
            <div className="mb-5">
              <label className="block font-gaming text-sm text-foreground mb-2">
                Nick Discord *
              </label>
              <input
                {...register("discordNick")}
                type="text"
                placeholder="username#1234 lub @username"
                className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {errors.discordNick && (
                <p className="text-redstone text-sm mt-1 font-gaming">{errors.discordNick.message}</p>
              )}
            </div>

            {/* Age and Name row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block font-gaming text-sm text-foreground mb-2">
                  Wiek *
                </label>
                <input
                  {...register("age")}
                  type="number"
                  min="10"
                  max="99"
                  placeholder="16"
                  className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {errors.age && (
                  <p className="text-redstone text-sm mt-1 font-gaming">{errors.age.message}</p>
                )}
              </div>
              <div>
                <label className="block font-gaming text-sm text-foreground mb-2">
                  Imię *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Jan"
                  className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {errors.name && (
                  <p className="text-redstone text-sm mt-1 font-gaming">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block font-gaming text-sm text-foreground mb-2">
                Adres Email *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="twoj@email.com"
                className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {errors.email && (
                <p className="text-redstone text-sm mt-1 font-gaming">{errors.email.message}</p>
              )}
            </div>

            {/* Challenge Select */}
            <div className="mb-5">
              <label className="block font-gaming text-sm text-foreground mb-2">
                Wybierz Wyzwanie *
              </label>
              <select
                {...register("challenge")}
                className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">-- Wybierz wyzwanie --</option>
                {challenges.map((challenge) => (
                  <option key={challenge} value={challenge}>
                    {challenge}
                  </option>
                ))}
              </select>
              {errors.challenge && (
                <p className="text-redstone text-sm mt-1 font-gaming">{errors.challenge.message}</p>
              )}
            </div>

            {/* Optional message */}
            <div className="mb-6">
              <label className="block font-gaming text-sm text-foreground mb-2">
                Dodatkowa wiadomość (opcjonalne)
              </label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Napisz coś o sobie lub dlaczego chcesz wziąć udział..."
                className="w-full px-4 py-3 rounded-lg input-minecraft text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
              />
              {errors.message && (
                <p className="text-redstone text-sm mt-1 font-gaming">{errors.message.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full pixel-button px-8 py-4 text-primary-foreground flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  WYSYŁANIE...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  WYŚLIJ ZGŁOSZENIE
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
