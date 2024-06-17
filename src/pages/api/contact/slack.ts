import type { APIRoute } from "astro";
export const prerender = false;

const { SLACK_CHANNEL_ID, SLACK_TOKEN } = import.meta.env;

export const POST: APIRoute = async ({ site, params, request }) => {
  if (!SLACK_CHANNEL_ID || !SLACK_TOKEN)
    return Response.json({
      error: "Missing Slack configuration, please check your .env file.",
    });

  const formUrl = "https://slack.com/api/chat.postMessage";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    Authorization: `Bearer ${SLACK_TOKEN}`,
  };

  const { email, message, topicChannel } =
    await request.json();

  if (!email || email === "") return Response.json({ error: "Missing email" });
  if (!message || message === "")
    return Response.json({ error: "Missing message" });


  const data = {
    channel: topicChannel ? topicChannel : SLACK_CHANNEL_ID,
    text: `Contact Form submission \n \n ${message}`,
    icon_emoji: ":ok_hand:",
  };
  try {
    const resp = await fetch(formUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const response = await resp.json();

    return Response.json({
      statusCode: 200,
      status: !!response?.ok ? "ok" : "error",
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
