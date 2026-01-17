import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to handle-submission-response");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const submissionId = url.searchParams.get('id');
    const action = url.searchParams.get('action');

    console.log("Processing action:", action, "for submission:", submissionId);

    if (!submissionId || !action) {
      return new Response(
        generateHtmlResponse("❌ Błąd", "Brak wymaganych parametrów", false),
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    if (action !== 'accept' && action !== 'reject') {
      return new Response(
        generateHtmlResponse("❌ Błąd", "Nieprawidłowa akcja", false),
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get the submission
    const { data: submission, error: fetchError } = await supabase
      .from('challenge_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("Fetch error:", fetchError);
      return new Response(
        generateHtmlResponse("❌ Błąd", "Nie znaleziono zgłoszenia", false),
        { status: 404, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    // Check if already processed
    if (submission.status !== 'pending') {
      return new Response(
        generateHtmlResponse(
          "⚠️ Już przetworzone", 
          `To zgłoszenie zostało już ${submission.status === 'accepted' ? 'zaakceptowane' : 'odrzucone'}.`,
          false
        ),
        { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    // Update the submission status
    const { error: updateError } = await supabase
      .from('challenge_submissions')
      .update({ status: newStatus })
      .eq('id', submissionId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error(`Failed to update submission: ${updateError.message}`);
    }

    console.log("Updated submission status to:", newStatus);

    // Send email to participant
    const isAccepted = action === 'accept';
    const emailSubject = isAccepted 
      ? `🎉 Zostałeś zaakceptowany! - ${submission.challenge}`
      : `Informacja o zgłoszeniu - ${submission.challenge}`;

    const emailHtml = isAccepted ? `
      <div style="font-family: 'Courier New', monospace; background-color: #1a1a2e; color: #00ff88; padding: 20px; border-radius: 10px;">
        <h1 style="color: #00ff88; text-align: center;">🎉 GRATULACJE! 🎉</h1>
        
        <p style="text-align: center; font-size: 20px;">
          Cześć <strong style="color: #ffd93d;">${submission.name}</strong>!
        </p>

        <div style="background-color: #2a2a4e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="font-size: 18px; margin: 0;">Twoje zgłoszenie do wyzwania:</p>
          <h2 style="color: #00ff88; margin: 15px 0;">${submission.challenge}</h2>
          <p style="font-size: 24px; margin: 0;">zostało <span style="color: #00ff88; font-weight: bold;">ZAAKCEPTOWANE!</span> ✅</p>
        </div>

        <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #ffd93d; margin-top: 0;">📋 Co dalej?</h3>
          <p>Skontaktujemy się z Tobą wkrótce na Discord: <strong style="color: #7289da;">${submission.discord_nick}</strong></p>
          <p>Przygotuj się na epickie wyzwanie! 🎮</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888;">Do zobaczenia w grze! 🎯</p>
          <p style="color: #ffd93d; font-size: 18px;">Pixelek & Inexus</p>
        </div>
      </div>
    ` : `
      <div style="font-family: 'Courier New', monospace; background-color: #1a1a2e; color: #00ff88; padding: 20px; border-radius: 10px;">
        <h1 style="color: #ff6b6b; text-align: center;">Informacja o zgłoszeniu</h1>
        
        <p style="text-align: center; font-size: 20px;">
          Cześć <strong style="color: #ffd93d;">${submission.name}</strong>!
        </p>

        <div style="background-color: #2a2a4e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p>Niestety, tym razem nie zostałeś wybrany do udziału w wyzwaniu:</p>
          <h2 style="color: #ff6b6b; margin: 15px 0;">${submission.challenge}</h2>
        </div>

        <div style="background-color: #2a2a4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p>Nie martw się! Możesz zawsze spróbować ponownie przy następnym wyzwaniu. 💪</p>
          <p>Obserwuj nasz kanał na YouTube, żeby nie przegapić kolejnych okazji!</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #888;">Powodzenia następnym razem! 🎯</p>
          <p style="color: #ffd93d; font-size: 18px;">Pixelek & Inexus</p>
        </div>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Minecraft Challenge <onboarding@resend.dev>",
        to: [submission.email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const emailData = await emailRes.json();
    console.log("Participant email response:", emailData);

    if (!emailRes.ok) {
      console.error("Failed to send email:", emailData);
    }

    const successMessage = isAccepted 
      ? `Zgłoszenie ${submission.minecraft_nick} zostało zaakceptowane i email został wysłany!`
      : `Zgłoszenie ${submission.minecraft_nick} zostało odrzucone i email został wysłany.`;

    return new Response(
      generateHtmlResponse(
        isAccepted ? "✅ Zaakceptowano!" : "❌ Odrzucono",
        successMessage,
        true
      ),
      { status: 200, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in handle-submission-response:", error);
    return new Response(
      generateHtmlResponse("❌ Błąd", error.message, false),
      { status: 500, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  }
};

function generateHtmlResponse(title: string, message: string, success: boolean): string {
  const bgColor = success ? '#00ff88' : '#ff6b6b';
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          background-color: #1a1a2e;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .container {
          background-color: #2a2a4e;
          padding: 40px;
          border-radius: 15px;
          text-align: center;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        h1 {
          color: ${bgColor};
          font-size: 2em;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2em;
          line-height: 1.6;
          color: #ccc;
        }
        .icon {
          font-size: 4em;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${success ? '🎮' : '⚠️'}</div>
        <h1>${title}</h1>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
