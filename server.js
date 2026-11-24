// 4. AI Chatbot Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Use the RelayKey base URL from your dashboard
    const RELAY_URL =
      "https://ais-dev-cfoiby2hu3ph6yzfj27muq-869931025748.asia-northeast1.run.app/api/v1/chat/completions";

    const response = await fetch(RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.OPENAI_API_KEY, // Reads the rk_live_ key from Render Env
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or "gpt-3.5-turbo" depending on what RelayKey supports
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

    // Print the response in Render logs to debug if needed
    console.log("RelayKey Response:", data);

    let botReply = "Sorry, I didn't catch that.";
    if (data.choices && data.choices[0] && data.choices[0].message) {
      botReply = data.choices[0].message.content;
    } else if (data.response) {
      botReply = data.response;
    } else if (data.message) {
      botReply = data.message;
    } else if (data.error) {
      botReply = "API Error: " + data.error.message;
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Server Error:", error);
    res
      .status(500)
      .json({ reply: "Failed to reach AI server. Check terminal." });
  }
});
