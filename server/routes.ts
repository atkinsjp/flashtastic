import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

  // Flash cards routes
  app.get("/api/flashcards", async (req, res) => {
    try {
      const { grade, subject, limit, offset } = req.query;
      const cards = await storage.getFlashCards({
        grade: grade as string,
        subject: subject as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(cards);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
