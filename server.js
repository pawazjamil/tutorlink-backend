// 4. AI Chatbot Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ YOUR EXACT RELAYKEY URL
    const RELAY_URL =
      "https://ais-dev-cfoiby2hu3ph6yzfj27muq-869931025748.asia-northeast1.run.app/api/v1/chat/completions";

    // Try to reach RelayKey
    const response = await fetch(RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.OPENAI_API_KEY, // Ensure this is your rk_live_ key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for TutorLink Bangladesh.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("RelayKey Response:", data);

    let botReply = "Sorry, I didn't catch that.";
    if (data.choices && data.choices[0] && data.choices[0].message) {
      botReply = data.choices[0].message.content;
    } else if (data.response) {
      botReply = data.response;
    } else if (data.message) {
      botReply = data.message;
    } else if (data.error) {
      // If RelayKey sends an error, we log it but don't crash
      console.log("RelayKey API Error:", data.error);
      botReply =
        "I'm having trouble connecting to my AI brain right now. Please try again later!";
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Server Error:", error);

    // ✅ FALLBACK: If the fetch fails (network error), send this instead of crashing
    res.json({
      reply:
        "I'm currently in maintenance mode! But I can tell you that TutorLink Bangladesh has amazing Math, Physics, and English tutors. Please use the search bar to find one!",
    });
  }
});
