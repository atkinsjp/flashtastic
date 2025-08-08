import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ChatRequest {
  message: string;
  subject?: string;
  grade?: string;
  recentTopics?: string[];
  conversationHistory?: Array<{
    content: string;
    sender: "user" | "buddy";
  }>;
}

interface ChatResponse {
  message: string;
  type: "text" | "suggestion" | "encouragement";
}

export async function generateStudyBuddyResponse({ 
  message, 
  subject = "general studies", 
  grade = "elementary", 
  recentTopics = [],
  conversationHistory = []
}: ChatRequest): Promise<ChatResponse> {
  try {
    // Build conversation context
    const contextMessages = conversationHistory
      .slice(-4) // Last 4 messages for context
      .map(msg => `${msg.sender === "user" ? "Student" : "Study Buddy"}: ${msg.content}`)
      .join("\n");

    const systemPrompt = `You are an enthusiastic, encouraging AI study buddy for grade ${grade} students learning ${subject}. 

Your personality:
- Friendly, patient, and encouraging
- Use age-appropriate language for grade ${grade} students
- Break down complex concepts into simple, digestible parts
- Use examples, analogies, and relatable comparisons
- Celebrate progress and effort, not just correct answers
- Make learning fun with creative explanations
- Ask follow-up questions to check understanding

Your capabilities:
- Explain concepts clearly with examples
- Generate practice questions
- Provide study tips and memory techniques
- Suggest learning activities
- Help with homework (guide, don't just give answers)
- Encourage when students are struggling
- Celebrate achievements

Guidelines:
- Keep responses concise but helpful (2-4 sentences usually)
- If student seems frustrated, be extra encouraging
- For math: use real-world examples and visual descriptions
- For reading: suggest fun ways to remember vocabulary
- For science: use simple experiments or analogies
- Always end with a question or encouragement to keep learning

Recent topics we've covered: ${recentTopics.join(", ") || "None yet"}

Conversation context:
${contextMessages}

Student's current message: ${message}

Respond as their encouraging study buddy. If they're asking for help with a concept, explain it clearly with examples. If they seem stuck, offer encouragement and different approaches.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: message,
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Determine response type based on content
    let responseType: "text" | "suggestion" | "encouragement" = "text";
    
    if (responseText.toLowerCase().includes("great job") || 
        responseText.toLowerCase().includes("awesome") || 
        responseText.toLowerCase().includes("excellent") ||
        responseText.toLowerCase().includes("you're doing")) {
      responseType = "encouragement";
    } else if (responseText.toLowerCase().includes("try this") || 
               responseText.toLowerCase().includes("here's an idea") || 
               responseText.toLowerCase().includes("suggestion")) {
      responseType = "suggestion";
    }

    return {
      message: responseText,
      type: responseType
    };

  } catch (error) {
    console.error("Error generating study buddy response:", error);
    
    // Fallback encouraging responses
    const fallbackResponses = [
      "That's a great question! Let me think about the best way to explain this to you. Could you tell me what part you're finding tricky?",
      "I love that you're asking questions - that's how we learn! Let's work through this together step by step.",
      "Don't worry if this feels challenging. Every expert was once a beginner! What would help you understand this better?",
      "You're doing great by asking for help! That shows you really want to learn. Let's figure this out together!"
    ];
    
    return {
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      type: "encouragement"
    };
  }
}

export async function generateStudyTips(subject: string, grade: string, topic?: string): Promise<string[]> {
  try {
    const systemPrompt = `Generate 3-5 practical, age-appropriate study tips for grade ${grade} students learning ${subject}${topic ? ` (specifically ${topic})` : ""}.

Tips should be:
- Fun and engaging for grade ${grade} students
- Practical and actionable
- Use memory techniques, games, or creative methods
- Be specific to the subject and grade level

Return as a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: `Generate study tips for ${subject} grade ${grade}${topic ? ` focusing on ${topic}` : ""}.`,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const tips = JSON.parse(rawJson);
    return Array.isArray(tips) ? tips : [tips];

  } catch (error) {
    console.error("Error generating study tips:", error);
    
    // Fallback tips based on subject
    const fallbackTips: Record<string, string[]> = {
      math: [
        "Practice a little bit every day - even 10 minutes helps!",
        "Use objects around you to practice counting and math problems",
        "Make up stories with math problems to make them more fun"
      ],
      vocabulary: [
        "Read your favorite books and look up new words",
        "Make flashcards with pictures to remember word meanings",
        "Use new words in sentences about things you love"
      ],
      science: [
        "Ask 'why' and 'how' questions about everything you see",
        "Try simple experiments at home with adult help",
        "Connect science to things you already know and like"
      ],
      default: [
        "Take breaks while studying to help your brain rest",
        "Teach someone else what you learned - it helps you remember!",
        "Make studying fun by turning it into games or stories"
      ]
    };
    
    return fallbackTips[subject.toLowerCase()] || fallbackTips.default;
  }
}