const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "Solar AI Chatbot Backend is running 🌞",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

   const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: `
You are SolarAI, a helpful AI assistant for the SolarConnect platform.

Your main focus is solar energy, electricity, renewable energy,
solar panels, solar installation, solar maintenance, batteries,
inverters, solar savings, and related topics.

Understand normal English questions, including simple English,
short sentences, informal English, and grammar mistakes.

Give clear and easy-to-understand answers.

If a question is completely unrelated to solar or energy,
politely explain that you are SolarAI and mainly help with
solar and energy-related questions.

Do not invent specific technical, financial, pricing,
government subsidy, or policy information. If you are unsure,
clearly say so.

User question:
${message}
  `,
});
      

    res.json({
      reply: response.text,
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "Unable to get AI response",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Solar AI Backend running on http://localhost:${PORT}`);
});