import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChallengeSubmission {
  minecraftNick: string;
  discordNick: string;
  age: string;
  name: string;
  email: string;
  challenge: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-challenge-submission");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission: ChallengeSubmission = await req.json();
    console.log("Processing submission for:", submission.minecraftNick);

    // Validate required fields
    if (!submission.minecraftNick || !submission.discordNick || !submission.age || 
        !submission.name || !submission.email || !submission.challenge) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to the site owner
    const ownerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Minecraft Challenge <onboarding@resend.dev>",
        to: ["jasiukruczek13@gmail.com"],
        subject: `Nowe zgłoszenie do wyzwania: ${submission.challenge}`,
        html: `
          <div style="font-family: 'Courier New', monospace; background-color: #1a1a2e; color: #00ff88; padding: 20px; border-radius: 10px;">
            <h1 style="color: #ff6b6b; text-align: center;">🎮 Nowe Zgłoszenie do Wyzwania! 🎮</h1>
            
            <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #ffd93d; margin-top: 0;">📋 Dane uczestnika:</h2>
              <p><strong>Nick Minecraft:</strong> ${submission.minecraftNick}</p>
              <p><strong>Nick Discord:</strong> ${submission.discordNick}</p>
              <p><strong>Imię:</strong> ${submission.name}</p>
              <p><strong>Wiek:</strong> ${submission.age} lat</p>
              <p><strong>Email:</strong> ${submission.email}</p>
            </div>

            <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #ffd93d; margin-top: 0;">🏆 Wybrane wyzwanie:</h2>
              <p style="font-size: 18px; color: #00ff88;">${submission.challenge}</p>
            </div>

            ${submission.message ? `
            <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #ffd93d; margin-top: 0;">💬 Wiadomość:</h2>
              <p>${submission.message}</p>
            </div>
            ` : ''}

            <p style="text-align: center; color: #888; margin-top: 30px;">
              Wysłane przez formularz na stronie Minecraft Challenge
            </p>
          </div>
        `,
      }),
    });

    const ownerEmailData = await ownerEmailRes.json();
    console.log("Owner email response:", ownerEmailData);

    if (!ownerEmailRes.ok) {
      throw new Error(`Failed to send owner email: ${JSON.stringify(ownerEmailData)}`);
    }

    // Send confirmation email to the participant
    const participantEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Minecraft Challenge <onboarding@resend.dev>",
        to: [submission.email],
        subject: `Potwierdzenie zgłoszenia - ${submission.challenge}`,
        html: `
          <div style="font-family: 'Courier New', monospace; background-color: #1a1a2e; color: #00ff88; padding: 20px; border-radius: 10px;">
            <h1 style="color: #ff6b6b; text-align: center;">🎮 Dziękujemy za zgłoszenie! 🎮</h1>
            
            <p style="text-align: center; font-size: 18px;">
              Cześć <strong style="color: #ffd93d;">${submission.name}</strong>!
            </p>

            <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p>Twoje zgłoszenie do wyzwania:</p>
              <h2 style="color: #00ff88; margin: 10px 0;">${submission.challenge}</h2>
              <p>zostało przyjęte! ✅</p>
            </div>

            <p style="text-align: center;">
              Wkrótce skontaktujemy się z Tobą na Discord: <strong style="color: #7289da;">${submission.discordNick}</strong>
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #888;">Do zobaczenia w grze! 🎯</p>
              <p style="color: #ffd93d;">pixelowyPL & Inexus</p>
            </div>
          </div>
        `,
      }),
    });

    const participantEmailData = await participantEmailRes.json();
    console.log("Participant email response:", participantEmailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-challenge-submission function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
