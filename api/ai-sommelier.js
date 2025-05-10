const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  console.log("API aufgerufen mit Methode:", req.method);
  console.log("API-Key vorhanden:", !!process.env.OPENAI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ error: "Frage darf nicht leer sein." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein digitaler Sommelier. Beantworte Fragen zu Weinempfehlungen auf Basis von Speisen, Geschmäckern oder Anlässen. Empfiehl nur Weine aus unserem Shop, wenn möglich.",
        },
        { role: "user", content: question },
      ],
    });

    const reply = response.choices[0].message.content;

    return res.status(200).json({ answer: reply });
  } catch (error) {
    console.error("Fehler bei OpenAI-Request:", error.message);
    return res.status(500).json({ error: "KI-Antwort fehlgeschlagen." });
  }
};
