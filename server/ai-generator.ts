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
- Three plausible wrong answers that are contextually related to the topic but clearly incorrect
- The subject and grade level

CRITICAL: The wrong answers must be related to the same topic/concept as the correct answer, not random unrelated terms.

Examples:
- For "What is the longest river in the world?" 
  Correct: "Nile River"
  Wrong: "Amazon River", "Mississippi River", "Congo River" (all rivers, not random words)
- For "What is 2 squared?"
  Correct: "4"
  Wrong: "6", "8", "9" (all numbers, not random math terms)
- For "What is the opposite of hot?"
  Correct: "cold"
  Wrong: "warm", "cool", "freezing" (all temperature-related words)

Guidelines:
- Questions should be challenging but appropriate for grade ${grade}
- Use vocabulary and concepts suitable for ${grade} grade students
- For math: focus on operations, facts, and concepts appropriate for the grade
- For vocabulary: use words students should know at this level
- For science: basic concepts and facts suitable for elementary students
- For geography: countries, capitals, states, landmarks appropriate for the grade
- For history: key events, figures, and dates suitable for elementary level
- Keep answers short and specific
- Make wrong answers plausible but clearly incorrect
- Ensure all 4 choices are topically related

Respond with JSON in this exact format:
{
  "questions": [
    {
      "question": "What is 7 × 8?",
      "answer": "56",
      "wrongAnswers": ["42", "48", "64"],
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
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                  wrongAnswers: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3
                  },
                  subject: { type: "string" },
                  grade: { type: "string" },
                  type: { type: "string" }
                },
                required: ["question", "answer", "wrongAnswers", "subject", "grade"]
              }
            }
          },
          required: ["questions"]
        }
      },
      contents: `Generate ${count} ${subject} flash card questions for grade ${grade} students with contextually related multiple choice options.`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    console.log("Raw Gemini response:", rawJson);

    let data;
    try {
      data = JSON.parse(rawJson);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw JSON that failed to parse:", rawJson);
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Failed to parse JSON response: ${errorMessage}`);
    }
    
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
      difficulty: 2,
      tags: [],
      // Store the AI-generated wrong answers for use in multiple choice
      choices: q.wrongAnswers || null
    }));

    return flashCards;

  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw new Error(`Failed to generate questions: ${error}`);
  }
}