require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://tutorlink-bangladesh.netlify.app",
      "https://tutorlink-frontend-two.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
  }),
);
app.use(express.json({ limit: "10mb" }));

// 1. MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// 2. API Routes
try {
  app.use("/api/tutors", require("./routes/tutors"));
  app.use("/api/users", require("./routes/users"));
  app.use("/api/bookings", require("./routes/bookings"));
} catch (error) {
  console.log(
    "⚠️ Warning: Some route files are missing. Check your /routes folder.",
  );
}

// 3. Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// 4. AI Chatbot Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const RELAY_URL =
      "https://ais-dev-cfoiby2hu3ph6yzfj27muq-869931025748.asia-northeast1.run.app/api/v1/chat/completions";

    const response = await fetch(RELAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.OPENAI_API_KEY,
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
      console.log("RelayKey API Error:", data.error);
      botReply =
        "I'm having trouble connecting to my AI brain right now. Please try again later!";
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Server Error:", error);

    res.json({
      reply:
        "I'm currently in maintenance mode! But I can tell you that TutorLink Bangladesh has amazing Math, Physics, and English tutors. Please use the search bar to find one!",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
