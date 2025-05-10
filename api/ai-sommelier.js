const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST erlaubt" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Frage fehlt" });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du bist ein Sommelier in einem Online-Weinshop. Antworte klar, freundlich und mit konkreten Empfehlungen aus dem Shop-Sortiment. Antworte auf Deutsch."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7
    });

    const response = chatCompletion.choices[0].message.content;
    return res.status(200).json({ answer: response });
  } catch (error) {
    console.error("Fehler bei OpenAI:", error);
    return res.status(500).json({ message: "Fehler bei der KI-Antwort." });
  }
};
