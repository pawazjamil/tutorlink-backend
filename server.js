// Make sure this URL matches exactly what RelayKey gave you!
const RELAY_URL = "https://api.relaykey.com/v1/chat/completions";

const response = await fetch(RELAY_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // RelayKey might need Bearer instead of X-API-Key
    "X-API-Key": process.env.OPENAI_API_KEY, // Keep this just in case
  },
  body: JSON.stringify({
    model: "gpt-4o-mini", // Changed from gpt-3.5-turbo as it's better supported
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant for TutorLink Bangladesh.",
      },
      { role: "user", content: message },
    ],
  }),
});
