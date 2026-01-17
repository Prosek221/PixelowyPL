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

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Save submission to database
    const { data: savedSubmission, error: dbError } = await supabase
      .from('challenge_submissions')
      .insert({
        minecraft_nick: submission.minecraftNick,
        discord_nick: submission.discordNick,
        age: parseInt(submission.age),
        name: submission.name,
        email: submission.email,
        challenge: submission.challenge,
        message: submission.message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Saved submission with ID:", savedSubmission.id);

    // Generate accept/reject URLs
    const baseUrl = "https://puyvxddhruuqjibujkaz.supabase.co/functions/v1";
    const acceptUrl = `${baseUrl}/handle-submission-response?id=${savedSubmission.id}&action=accept`;
    const rejectUrl = `${baseUrl}/handle-submission-response?id=${savedSubmission.id}&action=reject`;

    // Send email to the site owner with accept/reject buttons
    const ownerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Minecraft Challenge <onboarding@resend.dev>",
        to: ["jasiukruczek13@gmail.com"],
        subject: `🎮 Nowe zgłoszenie: ${submission.minecraftNick} - ${submission.challenge}`,
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

            <div style="text-align: center; margin: 30px 0;">
              <h2 style="color: #ffd93d;">⚡ Akcja:</h2>
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 10px;">
                    <a href="${acceptUrl}" style="display: inline-block; background-color: #00ff88; color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">✅ AKCEPTUJ</a>
                  </td>
                  <td style="padding: 10px;">
                    <a href="${rejectUrl}" style="display: inline-block; background-color: #ff6b6b; color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">❌ ODRZUĆ</a>
                  </td>
                </tr>
              </table>
            </div>

            <p style="text-align: center; color: #888; margin-top: 30px;">
              ID zgłoszenia: ${savedSubmission.id}
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Submission saved and email sent",
        submissionId: savedSubmission.id
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
