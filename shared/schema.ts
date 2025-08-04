import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  grade: varchar("grade", { length: 2 }).notNull(),
  avatar: text("avatar").default("1"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastStudyDate: timestamp("last_study_date"),
  settings: jsonb("settings").default({}),
  avatarGrowth: jsonb("avatar_growth").default({
    stage: 1, // 1: Seedling, 2: Sprout, 3: Young Plant, 4: Mature Plant, 5: Flowering
    experience: 0,
    unlocks: [],
    accessories: [],
    mood: "happy"
  }),
  userType: varchar("user_type", { length: 10 }).default("student"), // student, parent
  parentId: varchar("parent_id").references(() => users.id), // for linking students to parents
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const parentStudentLinks = pgTable("parent_student_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  relationship: varchar("relationship", { length: 20 }).default("parent"), // parent, guardian, tutor
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const flashCards = pgTable("flash_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  grade: varchar("grade", { length: 2 }).notNull(),
  difficulty: integer("difficulty").default(1),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  type: varchar("type", { length: 20 }).default("text"), // text, image, audio, multiple_choice
  choices: jsonb("choices"), // for multiple choice questions
  tags: jsonb("tags").default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cardId: varchar("card_id").notNull().references(() => flashCards.id),
  correctCount: integer("correct_count").default(0),
  incorrectCount: integer("incorrect_count").default(0),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review"),
  easiness: integer("easiness").default(250), // spaced repetition factor
  interval: integer("interval").default(1), // days until next review
  repetitions: integer("repetitions").default(0),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // badge, trophy, medal
  condition: jsonb("condition").notNull(), // requirements to unlock
  points: integer("points").default(0),
  rarity: varchar("rarity", { length: 20 }).default("common"), // common, rare, epic, legendary
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").default(sql`now()`),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: varchar("subject", { length: 50 }).notNull(),
  grade: varchar("grade", { length: 2 }).notNull(),
  mode: varchar("mode", { length: 20 }).notNull(), // flashcard, timed_quiz, practice_quiz, mixed
  cardsStudied: integer("cards_studied").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalTime: integer("total_time").default(0), // in seconds
  pointsEarned: integer("points_earned").default(0),
  completedAt: timestamp("completed_at").default(sql`now()`),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: varchar("subject", { length: 50 }).notNull(),
  grade: varchar("grade", { length: 2 }).notNull(),
  mode: varchar("mode", { length: 20 }).notNull(), // timed, untimed, mixed
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers"),
  score: integer("score").default(0),
  totalQuestions: integer("total_questions").notNull(),
  timeLimit: integer("time_limit"), // in seconds, null for untimed
  timeSpent: integer("time_spent").default(0),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFlashCardSchema = createInsertSchema(flashCards).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  completedAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type FlashCard = typeof flashCards.$inferSelect;
export type InsertFlashCard = z.infer<typeof insertFlashCardSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

// Enums and constants
export const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8'] as const;
export const SUBJECTS = [
  'vocabulary',
  'math',
  'science',
  'geography',
  'history',
  'biology',
  'health',
  'fitness',
  'music',
  'geometry'
] as const;

export const QUIZ_MODES = ['timed', 'untimed', 'mixed'] as const;
export const STUDY_MODES = ['flashcard', 'timed_quiz', 'practice_quiz', 'mixed'] as const;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
  studySessions: many(studySessions),
  quizzes: many(quizzes),
}));

export const flashCardsRelations = relations(flashCards, ({ many }) => ({
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  flashCard: one(flashCards, {
    fields: [userProgress.cardId],
    references: [flashCards.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  user: one(users, {
    fields: [quizzes.userId],
    references: [users.id],
  }),
}));
