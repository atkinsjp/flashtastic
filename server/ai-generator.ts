import { GoogleGenAI } from "@google/genai";
import type { FlashCard } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface GenerateQuestionsRequest {
  subject: string;
  grade: string;
  count: number;
}

export async function generateQuestions({ subject, grade, count }: GenerateQuestionsRequest): Promise<FlashCard[]> {
  try {
    const systemPrompt = `You are an expert K-8 educator creating flash cards for ${subject} at grade ${grade} level.

Generate exactly ${count} educational flash card questions appropriate for grade ${grade} students.

For each question, provide:
- A clear, age-appropriate question
- A correct answer (keep answers concise, 1-3 words when possible)
- The subject and grade level

Guidelines:
- Questions should be challenging but appropriate for grade ${grade}
- Use vocabulary and concepts suitable for ${grade} grade students
- For math: focus on operations, facts, and concepts appropriate for the grade
- For vocabulary: use words students should know at this level
- For science: basic concepts and facts suitable for elementary students
- For geography: countries, capitals, states, landmarks appropriate for the grade
- For history: key events, figures, and dates suitable for elementary level
- Keep answers short and specific

Respond with JSON in this exact format:
{
  "questions": [
    {
      "question": "What is 7 × 8?",
      "answer": "56",
      "subject": "${subject}",
      "grade": "${grade}",
      "type": "text"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: `Generate ${count} ${subject} flash card questions for grade ${grade} students.`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(rawJson);
    
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid response format from Gemini");
    }

    // Convert to FlashCard format with generated IDs
    const flashCards: FlashCard[] = data.questions.map((q: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      question: q.question,
      answer: q.answer,
      subject: subject,
      grade: grade,
      type: q.type || "text",
      imageUrl: null,
      difficulty: "medium",
      tags: []
    }));

    return flashCards;

  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw new Error(`Failed to generate questions: ${error}`);
  }
}