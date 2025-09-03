import {
  type User,
  type InsertUser,
  type FlashCard,
  type InsertFlashCard,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type StudySession,
  type InsertStudySession,
  type Quiz,
  type InsertQuiz,
  type ContentReport,
  type InsertContentReport,
  GRADES,
  SUBJECTS
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Flash cards
  getFlashCards(filters: {
    grade?: string;
    subject?: string;
    limit?: number;
    offset?: number;
  }): Promise<FlashCard[]>;
  getFlashCard(id: string): Promise<FlashCard | undefined>;
  createFlashCard(card: InsertFlashCard): Promise<FlashCard>;

  // User progress
  getUserProgress(userId: string, cardId: string): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgressBySubject(userId: string, subject: string, grade: string): Promise<UserProgress[]>;

  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;

  // Study sessions
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string, limit?: number): Promise<StudySession[]>;

  // Quizzes
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | undefined>;
  getUserQuizzes(userId: string, limit?: number): Promise<Quiz[]>;

  // Content Reports
  createContentReport(report: InsertContentReport): Promise<ContentReport>;
  getContentReports(userId?: string, status?: string): Promise<ContentReport[]>;
  updateContentReportStatus(id: string, status: string, moderatorNotes?: string): Promise<ContentReport | undefined>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users,
  flashCards,
  userProgress,
  achievements,
  userAchievements,
  studySessions,
  quizzes,
  contentReports
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    try {
      // Check if data already exists
      const existingAchievements = await db.select().from(achievements).limit(1);
      if (existingAchievements.length > 0) {
        return; // Data already initialized
      }
    } catch (error) {
      // Tables don't exist yet, continue with initialization
    }

    // Initialize achievements
    const achievementsData = [
      {
        name: "Math Master",
        description: "Complete 50 math problems correctly",
        icon: "🔢",
        type: "badge",
        condition: { subject: "math", correctAnswers: 50 },
        points: 100,
        rarity: "common"
      },
      {
        name: "Word Wizard",
        description: "Learn 100 vocabulary words",
        icon: "📚",
        type: "badge",
        condition: { subject: "vocabulary", correctAnswers: 100 },
        points: 150,
        rarity: "rare"
      },
      {
        name: "Science Star",
        description: "Master 25 science facts",
        icon: "🔬",
        type: "trophy",
        condition: { subject: "science", correctAnswers: 25 },
        points: 200,
        rarity: "epic"
      },
      {
        name: "Geography Guru",
        description: "Know 30 geography facts",
        icon: "🌍",
        type: "medal",
        condition: { subject: "geography", correctAnswers: 30 },
        points: 120,
        rarity: "rare"
      }
    ];

    try {
      await db.insert(achievements).values(achievementsData);
      // Initialize flash cards for each grade and subject
      await this.initializeFlashCards();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  private async initializeFlashCards() {
    const cardData = [
      // Kindergarten - Vocabulary with images
      {
        question: "What animal is this?",
        answer: "CAT",
        subject: "vocabulary",
        grade: "K",
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "image",
        tags: ["animals", "pets"]
      },
      {
        question: "What color is this?",
        answer: "RED",
        subject: "vocabulary",
        grade: "K",
        difficulty: 1,
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        type: "image",
        tags: ["colors"]
      },

      // Grade 1 - Simple math
      {
        question: "What is 2 + 3?",
        answer: "5",
        subject: "math",
        grade: "1",
        difficulty: 1,
        type: "text",
        tags: ["addition", "basic"]
      },
      {
        question: "What is 5 - 2?",
        answer: "3",
        subject: "math",
        grade: "1",
        difficulty: 1,
        type: "text",
        tags: ["subtraction", "basic"]
      },

      // Grade 2 - Science
      {
        question: "What do plants need to grow?",
        answer: "Water, sunlight, and air",
        subject: "science",
        grade: "2",
        difficulty: 2,
        type: "text",
        tags: ["plants", "biology"]
      },
      {
        question: "How many legs does a spider have?",
        answer: "8",
        subject: "science",
        grade: "2",
        difficulty: 2,
        type: "text",
        tags: ["animals", "insects"]
      },

      // Grade 3 - Geography
      {
        question: "What is the largest ocean?",
        answer: "Pacific Ocean",
        subject: "geography",
        grade: "3",
        difficulty: 3,
        type: "text",
        tags: ["oceans", "world"]
      },
      {
        question: "Which continent has penguins?",
        answer: "Antarctica",
        subject: "geography",
        grade: "3",
        difficulty: 3,
        type: "text",
        tags: ["continents", "animals"]
      },

      // Grade 4 - History
      {
        question: "Who was the first President of the United States?",
        answer: "George Washington",
        subject: "history",
        grade: "4",
        difficulty: 4,
        type: "text",
        tags: ["presidents", "america"]
      },

      // Grade 5 - Advanced Math
      {
        question: "What is 12 × 8?",
        answer: "96",
        subject: "math",
        grade: "5",
        difficulty: 5,
        type: "text",
        tags: ["multiplication", "advanced"]
      },

      // Music
      {
        question: "How many strings does a guitar have?",
        answer: "6",
        subject: "music",
        grade: "3",
        difficulty: 3,
        type: "text",
        tags: ["instruments"]
      },

      // Health
      {
        question: "How many hours of sleep should kids get each night?",
        answer: "8-10 hours",
        subject: "health",
        grade: "4",
        difficulty: 4,
        type: "text",
        tags: ["sleep", "wellness"]
      }
    ];

    try {
      await db.insert(flashCards).values(cardData);
    } catch (error) {
      console.error('Error initializing flash cards:', error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId));
    return result[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0] || undefined;
  }

  // Flash card methods
  async getFlashCards(filters: {
    grade?: string;
    subject?: string;
    limit?: number;
    offset?: number;
  }): Promise<FlashCard[]> {
    let query = db.select().from(flashCards);
    
    // Apply filters
    const conditions = [];
    if (filters.grade) {
      conditions.push(eq(flashCards.grade, filters.grade));
    }
    if (filters.subject) {
      conditions.push(eq(flashCards.subject, filters.subject));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }
    
    return await query;
  }

  async getFlashCard(id: string): Promise<FlashCard | undefined> {
    const [card] = await db.select().from(flashCards).where(eq(flashCards.id, id));
    return card || undefined;
  }

  async createFlashCard(card: InsertFlashCard): Promise<FlashCard> {
    const [flashCard] = await db
      .insert(flashCards)
      .values(card)
      .returning();
    return flashCard;
  }

  // User progress methods
  async getUserProgress(userId: string, cardId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.cardId, cardId)));
    return progress || undefined;
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgress(progress.userId, progress.cardId);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({
          ...progress,
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + (progress.interval || 1) * 24 * 60 * 60 * 1000)
        })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          ...progress,
          lastReviewed: new Date(),
          nextReview: new Date(Date.now() + (progress.interval || 1) * 24 * 60 * 60 * 1000)
        })
        .returning();
      return created;
    }
  }

  async getUserProgressBySubject(userId: string, subject: string, grade: string): Promise<UserProgress[]> {
    const cards = await this.getFlashCards({ subject, grade });
    const cardIds = cards.map(card => card.id);
    
    return await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.cardId, cardIds[0])));
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return await db
      .select()
      .from(userAchievements)
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .then(rows => rows.map(row => ({
        ...row.user_achievements!,
        achievement: row.achievements!
      })));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        unlockedAt: new Date()
      })
      .returning();
    return userAchievement;
  }

  // Study session methods
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [studySession] = await db
      .insert(studySessions)
      .values(session)
      .returning();
    return studySession;
  }

  async getUserStudySessions(userId: string, limit = 10): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(studySessions.completedAt)
      .limit(limit);
  }

  // Quiz methods
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db
      .insert(quizzes)
      .values(quiz)
      .returning();
    return newQuiz;
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | undefined> {
    const updateData = { ...updates };
    if (updates.isCompleted) {
      updateData.completedAt = new Date();
    }
    
    const [quiz] = await db
      .update(quizzes)
      .set(updateData)
      .where(eq(quizzes.id, id))
      .returning();
    return quiz || undefined;
  }

  async getUserQuizzes(userId: string, limit = 10): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(quizzes.createdAt)
      .limit(limit);
  }

  // Content reporting methods
  async createContentReport(report: InsertContentReport): Promise<ContentReport> {
    const [contentReport] = await db
      .insert(contentReports)
      .values(report)
      .returning();
    return contentReport;
  }

  async getContentReports(userId?: string, status?: string): Promise<ContentReport[]> {
    let conditions = [];
    
    if (userId) {
      conditions.push(eq(contentReports.userId, userId));
    }
    
    if (status) {
      conditions.push(eq(contentReports.status, status));
    }

    const query = db.select().from(contentReports);
    
    if (conditions.length > 0) {
      return await query
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(contentReports.createdAt);
    }

    return await query.orderBy(contentReports.createdAt);
  }

  async updateContentReportStatus(id: string, status: string, moderatorNotes?: string): Promise<ContentReport | undefined> {
    const updateData: any = { 
      status, 
      reviewedAt: new Date() 
    };
    
    if (moderatorNotes) {
      updateData.moderatorNotes = moderatorNotes;
    }

    const [report] = await db
      .update(contentReports)
      .set(updateData)
      .where(eq(contentReports.id, id))
      .returning();
    return report || undefined;
  }
}

export const storage = new DatabaseStorage();
