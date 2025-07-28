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
  GRADES,
  SUBJECTS
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private flashCards: Map<string, FlashCard> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private studySessions: Map<string, StudySession> = new Map();
  private quizzes: Map<string, Quiz> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize achievements
    const achievementsData = [
      {
        id: "math-master",
        name: "Math Master",
        description: "Complete 50 math problems correctly",
        icon: "🔢",
        type: "badge",
        condition: { subject: "math", correctAnswers: 50 },
        points: 100,
        rarity: "common"
      },
      {
        id: "word-wizard",
        name: "Word Wizard",
        description: "Learn 100 vocabulary words",
        icon: "📚",
        type: "badge",
        condition: { subject: "vocabulary", correctAnswers: 100 },
        points: 150,
        rarity: "rare"
      },
      {
        id: "science-star",
        name: "Science Star",
        description: "Master 25 science facts",
        icon: "🔬",
        type: "trophy",
        condition: { subject: "science", correctAnswers: 25 },
        points: 200,
        rarity: "epic"
      },
      {
        id: "geography-guru",
        name: "Geography Guru",
        description: "Know 30 geography facts",
        icon: "🌍",
        type: "medal",
        condition: { subject: "geography", correctAnswers: 30 },
        points: 120,
        rarity: "rare"
      }
    ];

    achievementsData.forEach(achievement => {
      this.achievements.set(achievement.id, achievement as Achievement);
    });

    // Initialize flash cards for each grade and subject
    this.initializeFlashCards();
  }

  private initializeFlashCards() {
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

    cardData.forEach(card => {
      const id = randomUUID();
      this.flashCards.set(id, {
        id,
        ...card,
        createdAt: new Date()
      } as FlashCard);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      ...insertUser,
      points: 0,
      level: 1,
      streak: 0,
      avatar: "1",
      settings: {},
      lastStudyDate: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Flash card methods
  async getFlashCards(filters: {
    grade?: string;
    subject?: string;
    limit?: number;
    offset?: number;
  }): Promise<FlashCard[]> {
    let cards = Array.from(this.flashCards.values());
    
    if (filters.grade) {
      cards = cards.filter(card => card.grade === filters.grade);
    }
    
    if (filters.subject) {
      cards = cards.filter(card => card.subject === filters.subject);
    }
    
    if (filters.offset) {
      cards = cards.slice(filters.offset);
    }
    
    if (filters.limit) {
      cards = cards.slice(0, filters.limit);
    }
    
    return cards;
  }

  async getFlashCard(id: string): Promise<FlashCard | undefined> {
    return this.flashCards.get(id);
  }

  async createFlashCard(card: InsertFlashCard): Promise<FlashCard> {
    const id = randomUUID();
    const flashCard: FlashCard = {
      id,
      ...card,
      type: card.type || "text",
      difficulty: card.difficulty || 1,
      imageUrl: card.imageUrl || null,
      audioUrl: card.audioUrl || null,
      choices: card.choices || null,
      tags: card.tags || null,
      createdAt: new Date()
    };
    this.flashCards.set(id, flashCard);
    return flashCard;
  }

  // User progress methods
  async getUserProgress(userId: string, cardId: string): Promise<UserProgress | undefined> {
    const key = `${userId}-${cardId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const key = `${progress.userId}-${progress.cardId}`;
    const existing = this.userProgress.get(key);
    
    const id = existing?.id || randomUUID();
    const updatedProgress: UserProgress = {
      id,
      ...progress,
      correctCount: progress.correctCount || 0,
      incorrectCount: progress.incorrectCount || 0,
      easiness: progress.easiness || 250,
      interval: progress.interval || 1,
      repetitions: progress.repetitions || 0,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + (progress.interval || 1) * 24 * 60 * 60 * 1000)
    };
    
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  async getUserProgressBySubject(userId: string, subject: string, grade: string): Promise<UserProgress[]> {
    const cards = await this.getFlashCards({ subject, grade });
    const cardIds = cards.map(card => card.id);
    
    return Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId && cardIds.includes(progress.cardId)
    );
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
    
    return userAchievements.map(ua => ({
      ...ua,
      achievement: this.achievements.get(ua.achievementId)!
    }));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const id = randomUUID();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: new Date()
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Study session methods
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const id = randomUUID();
    const studySession: StudySession = {
      id,
      ...session,
      cardsStudied: session.cardsStudied || 0,
      correctAnswers: session.correctAnswers || 0,
      totalTime: session.totalTime || 0,
      pointsEarned: session.pointsEarned || 0,
      completedAt: new Date()
    };
    this.studySessions.set(id, studySession);
    return studySession;
  }

  async getUserStudySessions(userId: string, limit = 10): Promise<StudySession[]> {
    return Array.from(this.studySessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
      .slice(0, limit);
  }

  // Quiz methods
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const newQuiz: Quiz = {
      id,
      ...quiz,
      answers: quiz.answers || null,
      score: quiz.score || 0,
      timeLimit: quiz.timeLimit || null,
      timeSpent: quiz.timeSpent || 0,
      isCompleted: quiz.isCompleted || false,
      createdAt: new Date(),
      completedAt: null
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | undefined> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return undefined;
    
    const updatedQuiz = { ...quiz, ...updates };
    if (updates.isCompleted) {
      updatedQuiz.completedAt = new Date();
    }
    
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async getUserQuizzes(userId: string, limit = 10): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter(quiz => quiz.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
