import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { message } = req.body;

  if (!message || message.length > 300) {
    return res.status(400).json({ error: "Ungültige Eingabe" });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Du bist ein virtueller Sommelier für den Onlineshop WineStudio. Du empfiehlst passende Weine aus dem Sortiment zu Speisen und beantwortest nur Fragen zum Thema Wein und Genuss. Andere Fragen ignorierst du freundlich.",
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content || "Keine Empfehlung gefunden.";
  res.status(200).json({ reply });
}
