import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuestions } from "./ai-generator";
import { generateStudyBuddyResponse, generateStudyTips } from "./study-buddy";
import { 
  insertUserSchema, 
  insertFlashCardSchema, 
  insertUserProgressSchema,
  insertStudySessionSchema,
  insertQuizSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Avatar growth routes
  app.patch("/api/users/:id/avatar-growth", async (req, res) => {
    try {
      const { avatarGrowth } = req.body;
      const user = await storage.updateUser(req.params.id, { avatarGrowth });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ avatarGrowth: user.avatarGrowth });
    } catch (error) {
      res.status(500).json({ message: "Failed to update avatar growth" });
    }
  });

  // Parent dashboard routes
  app.get("/api/parent/:parentId/children", async (req, res) => {
    try {
      // Mock implementation - in real app would query parent-student relationships
      const mockChildren = [
        {
          id: "student-1",
          name: "Emma Johnson", 
          avatar: "1",
          grade: "2",
          points: 1247,
          level: 5,
          streak: 7,
          lastActive: new Date().toISOString(),
          weeklyGoal: 300,
          weeklyProgress: 245,
          strongSubjects: ["Math", "Science"],
          needsWork: ["Geography"],
          recentAchievements: 3
        },
        {
          id: "student-2",
          name: "Alex Johnson",
          avatar: "2", 
          grade: "5",
          points: 890,
          level: 3,
          streak: 4,
          lastActive: new Date().toISOString(),
          weeklyGoal: 240,
          weeklyProgress: 180,
          strongSubjects: ["Vocabulary", "History"],
          needsWork: ["Math", "Science"],
          recentAchievements: 1
        }
      ];
      res.json(mockChildren);
    } catch (error) {
      res.status(500).json({ message: "Failed to get children data" });
    }
  });

  app.get("/api/parent/:parentId/analytics", async (req, res) => {
    try {
      const { timeRange = "week", childId } = req.query;
      
      // Mock analytics data - in real app would aggregate from database
      const analyticsData = {
        weeklyData: [
          { day: "Mon", Emma: 45, Alex: 30, target: 40 },
          { day: "Tue", Emma: 52, Alex: 25, target: 40 },
          { day: "Wed", Emma: 38, Alex: 42, target: 40 },
          { day: "Thu", Emma: 41, Alex: 35, target: 40 },
          { day: "Fri", Emma: 55, Alex: 28, target: 40 },
          { day: "Sat", Emma: 28, Alex: 20, target: 40 },
          { day: "Sun", Emma: 35, Alex: 0, target: 40 }
        ],
        subjectProgress: [
          { subject: "Math", Emma: 85, Alex: 62 },
          { subject: "Science", Emma: 92, Alex: 58 },
          { subject: "Vocabulary", Emma: 78, Alex: 88 },
          { subject: "Geography", Emma: 65, Alex: 75 },
          { subject: "History", Emma: 82, Alex: 91 }
        ],
        monthlyTrend: [
          { month: "Oct", studyTime: 180, achievements: 8, accuracy: 78 },
          { month: "Nov", studyTime: 220, achievements: 12, accuracy: 82 },
          { month: "Dec", studyTime: 195, achievements: 15, accuracy: 85 },
          { month: "Jan", studyTime: 245, achievements: 18, accuracy: 88 }
        ]
      };
      
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics data" });
    }
  });

  app.get("/api/parent/:parentId/insights", async (req, res) => {
    try {
      // Mock insights data - in real app would use ML/analytics
      const insights = {
        learningPatterns: [
          {
            type: "peak_hours",
            title: "Peak Learning Hours",
            description: "Emma learns best between 4-6 PM with 92% accuracy",
            childId: "student-1",
            confidence: 0.85
          },
          {
            type: "consistency",
            title: "Consistency Improvement", 
            description: "Alex has maintained a 4-day streak, up from 2 days last week",
            childId: "student-2",
            confidence: 0.92
          }
        ],
        recommendations: [
          {
            type: "subject_focus",
            title: "Geography Practice",
            description: "Focus on geography practice - consider visual learning tools and maps",
            childId: "student-1",
            priority: "high"
          },
          {
            type: "math_improvement",
            title: "Math Skills",
            description: "Math improvement needed - try gamified math exercises and visual problems", 
            childId: "student-2",
            priority: "medium"
          }
        ]
      };
      
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get insights data" });
    }
  });

  // Sibling Competition routes
  app.get("/api/competitions/challenges/:userId", async (req, res) => {
    try {
      // Mock challenges data - in real app would query database
      const mockChallenges = [
        {
          id: "challenge-1",
          challengerId: "sibling-1",
          challengedId: "sibling-2",
          challengerName: "Emma",
          challengedName: "Alex",
          type: "speed_round",
          subject: "math",
          status: "active",
          targetScore: 20,
          challengerScore: 15,
          challengedScore: 12,
          timeRemaining: 3600,
          reward: { points: 100, badge: "Speed Demon" },
          createdAt: new Date().toISOString()
        }
      ];
      res.json(mockChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to get challenges" });
    }
  });

  app.post("/api/competitions/challenges", async (req, res) => {
    try {
      const challengeData = req.body;
      // Mock creation - in real app would save to database
      const newChallenge = {
        id: `challenge-${Date.now()}`,
        ...challengeData,
        status: "pending",
        challengerScore: 0,
        challengedScore: 0,
        createdAt: new Date().toISOString()
      };
      res.json(newChallenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  app.patch("/api/competitions/challenges/:challengeId/accept", async (req, res) => {
    try {
      // Mock accept challenge - in real app would update database
      const challengeId = req.params.challengeId;
      res.json({ id: challengeId, status: "active", message: "Challenge accepted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to accept challenge" });
    }
  });

  app.get("/api/competitions/leaderboards/:familyId", async (req, res) => {
    try {
      const mockLeaderboards = [
        {
          type: "weekly_points",
          title: "Weekly Champions",
          rankings: [
            { id: "sibling-1", name: "Emma", score: 245, rank: 1, change: 0, avatar: "1" },
            { id: "sibling-2", name: "Alex", score: 180, rank: 2, change: 0, avatar: "2" }
          ]
        },
        {
          type: "monthly_streak", 
          title: "Streak Masters",
          rankings: [
            { id: "sibling-1", name: "Emma", score: 7, rank: 1, change: 1, avatar: "1" },
            { id: "sibling-2", name: "Alex", score: 4, rank: 2, change: -1, avatar: "2" }
          ]
        }
      ];
      res.json(mockLeaderboards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboards" });
    }
  });

  app.get("/api/competitions/goals/:familyId", async (req, res) => {
    try {
      const mockGoals = [
        {
          id: "goal-1",
          title: "Family Math Masters",
          description: "Together earn 1000 points in Math this month",
          targetValue: 1000,
          currentValue: 650,
          participantIds: ["sibling-1", "sibling-2"],
          participants: ["Emma", "Alex"],
          status: "active",
          reward: { points: 200, badge: "Team Player" },
          dueDate: "2025-01-31T23:59:59Z"
        }
      ];
      res.json(mockGoals);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collaborative goals" });
    }
  });

  app.post("/api/competitions/goals", async (req, res) => {
    try {
      const goalData = req.body;
      const newGoal = {
        id: `goal-${Date.now()}`,
        ...goalData,
        currentValue: 0,
        status: "active",
        createdAt: new Date().toISOString()
      };
      res.json(newGoal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  // Flash cards routes with AI-first generation
  app.get("/api/flashcards", async (req, res) => {
    try {
      const { grade, subject, limit, offset, fresh } = req.query;
      const requestedLimit = limit ? parseInt(limit as string) : 10;
      
      // CRITICAL: AI-First Generation - No Fallbacks Allowed
      if (subject && subject !== "mixed" && grade) {
        console.log(`Generating fresh AI content for ${subject} grade ${grade}...`);
        
        const maxRetries = 3;
        let attempt = 0;
        
        while (attempt < maxRetries) {
          try {
            const aiCards = await generateQuestions({
              subject: subject as string,
              grade: grade as string,
              count: requestedLimit
            });
            
            if (aiCards && aiCards.length > 0) {
              console.log(`Successfully generated ${aiCards.length} AI cards`);
              res.json(aiCards);
              return;
            }
          } catch (aiError) {
            attempt++;
            console.error(`AI generation attempt ${attempt}/${maxRetries} failed:`, aiError);
            
            if (attempt < maxRetries) {
              console.log(`Retrying in 1 second...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        // If all retries failed, return error - NO FALLBACK DATA
        console.error("All AI generation attempts failed");
        res.status(503).json({ 
          error: "AI service temporarily unavailable",
          message: "Please try again in a moment. Our AI is generating personalized questions for you."
        });
        return;
      }

      // CRITICAL: No fallback to database - AI is required
      console.error("Reached fallback section - this should not happen in production");
      res.status(503).json({ 
        error: "AI service required",
        message: "Fresh content generation is required for the best learning experience."
      });
    } catch (error) {
      console.error("Flash cards endpoint error:", error);
      res.status(500).json({ message: "Failed to get flash cards" });
    }
  });

  app.get("/api/flashcards/:id", async (req, res) => {
    try {
      const card = await storage.getFlashCard(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Flash card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flash card" });
    }
  });

  // New endpoint for generating AI questions on demand
  app.post("/api/flashcards/generate", async (req, res) => {
    try {
      const { subject, grade, count = 10 } = req.body;
      
      if (!subject || !grade) {
        return res.status(400).json({ message: "Subject and grade are required" });
      }

      const aiCards = await generateQuestions({
        subject,
        grade,
        count: Math.min(count, 20) // Limit to 20 questions max per request
      });

      // Save generated cards to database
      const savedCards: any[] = [];
      for (const card of aiCards) {
        try {
          // Clean the card data to match expected schema
          const cleanCard = {
            question: card.question,
            answer: card.answer,
            subject: card.subject,
            grade: card.grade,
            difficulty: card.difficulty || 2,
            imageUrl: card.imageUrl || null,
            audioUrl: card.audioUrl || null,
            type: card.type || "text",
            choices: null,
            tags: [],
          };
          const savedCard = await storage.createFlashCard(cleanCard);
          savedCards.push(savedCard);
        } catch (saveError) {
          console.log("Card save failed, using generated card:", saveError);
          savedCards.push(card);
        }
      }

      res.json(savedCards);
    } catch (error) {
      console.error("AI generation endpoint error:", error);
      res.status(500).json({ message: "Failed to generate flash cards" });
    }
  });

  app.post("/api/flashcards", async (req, res) => {
    try {
      const cardData = insertFlashCardSchema.parse(req.body);
      const card = await storage.createFlashCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create flash card" });
    }
  });

  // User progress routes
  app.get("/api/users/:userId/progress/:cardId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId, req.params.cardId);
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const progress = await storage.updateUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const { subject, grade } = req.query;
      if (!subject || !grade) {
        return res.status(400).json({ message: "Subject and grade are required" });
      }
      const progress = await storage.getUserProgressBySubject(
        req.params.userId,
        subject as string,
        grade as string
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  app.post("/api/users/:userId/achievements/:achievementId", async (req, res) => {
    try {
      const userAchievement = await storage.unlockAchievement(
        req.params.userId,
        req.params.achievementId
      );
      res.status(201).json(userAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to unlock achievement" });
    }
  });

  // Study sessions routes
  app.post("/api/users/:userId/study-sessions", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId: req.params.userId
      });
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  app.get("/api/users/:userId/study-sessions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const sessions = await storage.getUserStudySessions(req.params.userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study sessions" });
    }
  });

  // Quiz routes
  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz" });
    }
  });

  app.patch("/api/quizzes/:id", async (req, res) => {
    try {
      const updates = req.body;
      const quiz = await storage.updateQuiz(req.params.id, updates);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quiz" });
    }
  });

  app.get("/api/users/:userId/quizzes", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const quizzes = await storage.getUserQuizzes(req.params.userId, limit);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user quizzes" });
    }
  });

  // Study Buddy AI Chat routes
  app.post("/api/study-buddy/chat", async (req, res) => {
    try {
      const { message, subject, grade, recentTopics, conversationHistory } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generateStudyBuddyResponse({
        message,
        subject,
        grade,
        recentTopics: recentTopics || [],
        conversationHistory: conversationHistory || []
      });

      res.json(response);
    } catch (error) {
      console.error("Study buddy chat error:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  app.get("/api/study-buddy/tips", async (req, res) => {
    try {
      const { subject, grade, topic } = req.query;
      
      if (!subject || !grade) {
        return res.status(400).json({ message: "Subject and grade are required" });
      }

      const tips = await generateStudyTips(
        subject as string,
        grade as string,
        topic as string | undefined
      );

      res.json({ tips });
    } catch (error) {
      console.error("Study tips generation error:", error);
      res.status(500).json({ message: "Failed to generate study tips" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
