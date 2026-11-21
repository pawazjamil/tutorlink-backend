const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // Allows the browser to connect
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const RELAY_URL = "https://ais-dev-cfoiby2hu3ph6zyfz2j7mqu-869931825748.asia-east1.run.app/api/v1/chat/completions";

    const response = await fetch(RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for TutorLink Bangladesh." },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await response.json();
    
    // 🔍 THIS WILL PRINT IN YOUR TERMINAL SO WE CAN SEE THE REAL ERROR
    console.log("RelayKey Response:", data);

    // Try to extract the text based on different possible formats
    let botReply = "Sorry, I didn't catch that."; // fallback
    
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
    res.status(500).json({ reply: "Failed to reach AI server. Check terminal." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Chatbot backend running on http://localhost:${PORT}`));