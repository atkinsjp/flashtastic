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

ABSOLUTELY CRITICAL: The wrong answers MUST be contextually related to the same topic as the correct answer. NEVER use random numbers, letters, or unrelated words.

WRONG ANSWER QUALITY CONTROL:
- For geography questions: ALL 4 choices must be from the same category (all oceans, all countries, all capitals, etc.)
- For math questions: ALL 4 choices must be reasonable numbers for that type of problem
- For science questions: ALL 4 choices must be related scientific concepts
- For vocabulary: ALL 4 choices must be words from the same category or topic
- For history: ALL 4 choices must be historical figures, dates, or events from the same era

GOOD Examples:
- Question: "What is the largest ocean?" 
  Correct: "Pacific Ocean"
  Wrong: "Atlantic Ocean", "Indian Ocean", "Arctic Ocean" (all oceans)
- Question: "What is the capital of France?"
  Correct: "Paris"
  Wrong: "London", "Berlin", "Madrid" (all European capitals)
- Question: "What is 8 × 7?"
  Correct: "56"
  Wrong: "48", "63", "64" (all reasonable multiplication results)

BAD Examples to AVOID:
- Question: "What is the largest ocean?" 
  NEVER use: "one", "two", "three" (these are not oceans!)
- Question: "What is the capital of France?"
  NEVER use: "red", "big", "happy" (these are not cities!)

DOUBLE-CHECK: Before finalizing each question, verify all 4 answer choices belong to the same category/topic.

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