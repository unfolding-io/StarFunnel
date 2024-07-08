import type { APIRoute } from "astro";
export const prerender = false;

let { POSTMARK_SERVER_TOKEN, FROM_EMAIL_ADDRESS, TO_EMAIL_ADDRESS } = import.meta.env;

export const POST: APIRoute = async ({ site, params, request }) => {
  if (!POSTMARK_SERVER_TOKEN || !FROM_EMAIL_ADDRESS|| !TO_EMAIL_ADDRESS)
    return Response.json({
      error: "Missing Postmark configuration, please check your .env file.",
    });

   const { email, name, message, topicEmail } = await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
  };

const emailObject = {
    From: FROM_EMAIL_ADDRESS,
    To: topicEmail ? topicEmail : TO_EMAIL_ADDRESS,
    Subject: `Contact Form: ${name} ${email}`,
    TextBody: message,
    "MessageStream": "broadcast",
  };

   
  try {
    const resp = await fetch(`https://api.postmarkapp.com/email`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(emailObject),
    });

    let response = await resp.json();

    

    return Response.json({
      statusCode: resp?.ok ? 200 : response.ErrorCode,
      status: resp?.ok ? "ok" : "error",
      body: resp?.ok? "Your message was sent successfully! We'll be in touch.": response.Message,
    });
  } catch (error) {
    console.debug(error);
    return new Response(
      JSON.stringify({
        message: "error",
      }),
      {
        status: 500,
      },
    );
  }
};
