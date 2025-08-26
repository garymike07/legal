import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['citizen', 'lawyer', 'prisoner', 'admin']);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('citizen'),
  verified: boolean("verified").default(false),
  bio: text("bio"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legal documents categories
export const documentCategoryEnum = pgEnum('document_category', [
  'constitutional', 'civil', 'criminal', 'family', 'property', 'business', 'employment', 'human_rights'
]);

// Legal documents table
export const legalDocuments = pgTable("legal_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: documentCategoryEnum("category").notNull(),
  difficultyLevel: integer("difficulty_level").notNull().default(1), // 1-5 scale
  language: varchar("language", { length: 10 }).default('en'),
  tags: text("tags").array(),
  sourceUrl: varchar("source_url"),
  isOfficial: boolean("is_official").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum question status
export const questionStatusEnum = pgEnum('question_status', ['open', 'answered', 'closed']);

// Forum questions table
export const forumQuestions = pgTable("forum_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: documentCategoryEnum("category").notNull(),
  status: questionStatusEnum("status").default('open'),
  viewsCount: integer("views_count").default(0),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum answers table
export const forumAnswers = pgTable("forum_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").references(() => forumQuestions.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  expertVerified: boolean("expert_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Case status enum
export const caseStatusEnum = pgEnum('case_status', ['active', 'pending', 'closed', 'appealed']);

// Legal cases table (for lawyers)
export const legalCases = pgTable("legal_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lawyerId: varchar("lawyer_id").references(() => users.id).notNull(),
  clientName: varchar("client_name").notNull(),
  clientContact: varchar("client_contact"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").notNull(),
  status: caseStatusEnum("status").default('active'),
  courtName: varchar("court_name"),
  caseNumber: varchar("case_number"),
  nextHearing: timestamp("next_hearing"),
  documents: text("documents").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document templates table
export const documentTemplates = pgTable("document_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").notNull(),
  template: jsonb("template").notNull(), // JSON structure for form fields
  htmlTemplate: text("html_template"), // HTML template for document generation
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated documents table
export const generatedDocuments = pgTable("generated_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  templateId: varchar("template_id").references(() => documentTemplates.id).notNull(),
  title: varchar("title").notNull(),
  formData: jsonb("form_data").notNull(),
  pdfUrl: varchar("pdf_url"),
  docxUrl: varchar("docx_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Legal aid applications table
export const legalAidApplications = pgTable("legal_aid_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  caseDescription: text("case_description").notNull(),
  financialStatus: jsonb("financial_status").notNull(),
  supportingDocuments: text("supporting_documents").array(),
  status: varchar("status").default('pending'), // pending, approved, rejected
  assignedLawyerId: varchar("assigned_lawyer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  forumQuestions: many(forumQuestions),
  forumAnswers: many(forumAnswers),
  legalCases: many(legalCases),
  generatedDocuments: many(generatedDocuments),
  legalAidApplications: many(legalAidApplications),
}));

export const forumQuestionsRelations = relations(forumQuestions, ({ one, many }) => ({
  user: one(users, {
    fields: [forumQuestions.userId],
    references: [users.id],
  }),
  answers: many(forumAnswers),
}));

export const forumAnswersRelations = relations(forumAnswers, ({ one }) => ({
  question: one(forumQuestions, {
    fields: [forumAnswers.questionId],
    references: [forumQuestions.id],
  }),
  user: one(users, {
    fields: [forumAnswers.userId],
    references: [users.id],
  }),
}));

export const legalCasesRelations = relations(legalCases, ({ one }) => ({
  lawyer: one(users, {
    fields: [legalCases.lawyerId],
    references: [users.id],
  }),
}));

export const generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  user: one(users, {
    fields: [generatedDocuments.userId],
    references: [users.id],
  }),
  template: one(documentTemplates, {
    fields: [generatedDocuments.templateId],
    references: [documentTemplates.id],
  }),
}));

export const legalAidApplicationsRelations = relations(legalAidApplications, ({ one }) => ({
  user: one(users, {
    fields: [legalAidApplications.userId],
    references: [users.id],
  }),
  assignedLawyer: one(users, {
    fields: [legalAidApplications.assignedLawyerId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  bio: true,
  location: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments);
export const insertForumQuestionSchema = createInsertSchema(forumQuestions);
export const insertForumAnswerSchema = createInsertSchema(forumAnswers);
export const insertLegalCaseSchema = createInsertSchema(legalCases);
export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates);
export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments);
export const insertLegalAidApplicationSchema = createInsertSchema(legalAidApplications);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type ForumQuestion = typeof forumQuestions.$inferSelect;
export type InsertForumQuestion = z.infer<typeof insertForumQuestionSchema>;
export type ForumAnswer = typeof forumAnswers.$inferSelect;
export type InsertForumAnswer = z.infer<typeof insertForumAnswerSchema>;
export type LegalCase = typeof legalCases.$inferSelect;
export type InsertLegalCase = z.infer<typeof insertLegalCaseSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type LegalAidApplication = typeof legalAidApplications.$inferSelect;
export type InsertLegalAidApplication = z.infer<typeof insertLegalAidApplicationSchema>;
