import {
  users,
  legalDocuments,
  forumQuestions,
  forumAnswers,
  legalCases,
  documentTemplates,
  generatedDocuments,
  legalAidApplications,
  type User,
  type UpsertUser,
  type LegalDocument,
  type InsertLegalDocument,
  type ForumQuestion,
  type InsertForumQuestion,
  type ForumAnswer,
  type InsertForumAnswer,
  type LegalCase,
  type InsertLegalCase,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type GeneratedDocument,
  type InsertGeneratedDocument,
  type LegalAidApplication,
  type InsertLegalAidApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, sql, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legal documents operations
  getLegalDocuments(filters?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<LegalDocument[]>;
  getLegalDocument(id: string): Promise<LegalDocument | undefined>;
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;
  updateLegalDocument(id: string, updates: Partial<InsertLegalDocument>): Promise<LegalDocument>;
  
  // Forum operations
  getForumQuestions(filters?: { category?: string; status?: string; limit?: number; offset?: number }): Promise<(ForumQuestion & { user: User; answersCount: number })[]>;
  getForumQuestion(id: string): Promise<(ForumQuestion & { user: User }) | undefined>;
  createForumQuestion(question: InsertForumQuestion): Promise<ForumQuestion>;
  updateForumQuestion(id: string, updates: Partial<InsertForumQuestion>): Promise<ForumQuestion>;
  
  getForumAnswers(questionId: string): Promise<(ForumAnswer & { user: User })[]>;
  createForumAnswer(answer: InsertForumAnswer): Promise<ForumAnswer>;
  updateForumAnswer(id: string, updates: Partial<InsertForumAnswer>): Promise<ForumAnswer>;
  
  // Legal cases operations (for lawyers)
  getLegalCases(lawyerId: string, filters?: { status?: string; limit?: number; offset?: number }): Promise<LegalCase[]>;
  getLegalCase(id: string): Promise<LegalCase | undefined>;
  createLegalCase(legalCase: InsertLegalCase): Promise<LegalCase>;
  updateLegalCase(id: string, updates: Partial<InsertLegalCase>): Promise<LegalCase>;
  
  // Document templates operations
  getDocumentTemplates(category?: string): Promise<DocumentTemplate[]>;
  getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined>;
  
  // Generated documents operations
  getUserGeneratedDocuments(userId: string): Promise<(GeneratedDocument & { template: DocumentTemplate })[]>;
  createGeneratedDocument(document: InsertGeneratedDocument): Promise<GeneratedDocument>;
  
  // Legal aid applications
  getLegalAidApplications(filters?: { status?: string; limit?: number; offset?: number }): Promise<(LegalAidApplication & { user: User })[]>;
  getUserLegalAidApplications(userId: string): Promise<LegalAidApplication[]>;
  createLegalAidApplication(application: InsertLegalAidApplication): Promise<LegalAidApplication>;
  updateLegalAidApplication(id: string, updates: Partial<InsertLegalAidApplication>): Promise<LegalAidApplication>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Legal documents operations
  async getLegalDocuments(filters?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<LegalDocument[]> {
    let query = db.select().from(legalDocuments);
    
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(legalDocuments.category, filters.category as any));
    }
    if (filters?.search) {
      conditions.push(
        or(
          like(legalDocuments.title, `%${filters.search}%`),
          like(legalDocuments.content, `%${filters.search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(legalDocuments.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getLegalDocument(id: string): Promise<LegalDocument | undefined> {
    const [document] = await db.select().from(legalDocuments).where(eq(legalDocuments.id, id));
    return document;
  }

  async createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument> {
    const [created] = await db.insert(legalDocuments).values(document).returning();
    return created;
  }

  async updateLegalDocument(id: string, updates: Partial<InsertLegalDocument>): Promise<LegalDocument> {
    const [updated] = await db
      .update(legalDocuments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(legalDocuments.id, id))
      .returning();
    return updated;
  }

  // Forum operations
  async getForumQuestions(filters?: { category?: string; status?: string; limit?: number; offset?: number }): Promise<(ForumQuestion & { user: User; answersCount: number })[]> {
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(forumQuestions.category, filters.category as any));
    }
    if (filters?.status) {
      conditions.push(eq(forumQuestions.status, filters.status as any));
    }

    const baseQuery = db
      .select({
        id: forumQuestions.id,
        userId: forumQuestions.userId,
        title: forumQuestions.title,
        content: forumQuestions.content,
        category: forumQuestions.category,
        status: forumQuestions.status,
        viewsCount: forumQuestions.viewsCount,
        upvotes: forumQuestions.upvotes,
        downvotes: forumQuestions.downvotes,
        featured: forumQuestions.featured,
        createdAt: forumQuestions.createdAt,
        updatedAt: forumQuestions.updatedAt,
        user: users,
        answersCount: sql<number>`(SELECT COUNT(*) FROM ${forumAnswers} WHERE ${forumAnswers.questionId} = ${forumQuestions.id})`.as('answers_count'),
      })
      .from(forumQuestions)
      .leftJoin(users, eq(forumQuestions.userId, users.id));

    let query = baseQuery;
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(forumQuestions.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    const results = await query;
    return results.map(result => ({
      ...result,
      user: result.user!,
      answersCount: Number(result.answersCount),
    }));
  }

  async getForumQuestion(id: string): Promise<(ForumQuestion & { user: User }) | undefined> {
    const [result] = await db
      .select({
        question: forumQuestions,
        user: users,
      })
      .from(forumQuestions)
      .leftJoin(users, eq(forumQuestions.userId, users.id))
      .where(eq(forumQuestions.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.question,
      user: result.user!,
    };
  }

  async createForumQuestion(question: InsertForumQuestion): Promise<ForumQuestion> {
    const [created] = await db.insert(forumQuestions).values(question).returning();
    return created;
  }

  async updateForumQuestion(id: string, updates: Partial<InsertForumQuestion>): Promise<ForumQuestion> {
    const [updated] = await db
      .update(forumQuestions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forumQuestions.id, id))
      .returning();
    return updated;
  }

  async getForumAnswers(questionId: string): Promise<(ForumAnswer & { user: User })[]> {
    const results = await db
      .select({
        answer: forumAnswers,
        user: users,
      })
      .from(forumAnswers)
      .leftJoin(users, eq(forumAnswers.userId, users.id))
      .where(eq(forumAnswers.questionId, questionId))
      .orderBy(desc(forumAnswers.upvotes), desc(forumAnswers.createdAt));
    
    return results.map(result => ({
      ...result.answer,
      user: result.user!,
    }));
  }

  async createForumAnswer(answer: InsertForumAnswer): Promise<ForumAnswer> {
    const [created] = await db.insert(forumAnswers).values(answer).returning();
    return created;
  }

  async updateForumAnswer(id: string, updates: Partial<InsertForumAnswer>): Promise<ForumAnswer> {
    const [updated] = await db
      .update(forumAnswers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forumAnswers.id, id))
      .returning();
    return updated;
  }

  // Legal cases operations
  async getLegalCases(lawyerId: string, filters?: { status?: string; limit?: number; offset?: number }): Promise<LegalCase[]> {
    let query = db.select().from(legalCases).where(eq(legalCases.lawyerId, lawyerId));
    
    if (filters?.status) {
      query = query.where(and(
        eq(legalCases.lawyerId, lawyerId),
        eq(legalCases.status, filters.status as any)
      ));
    }
    
    query = query.orderBy(desc(legalCases.updatedAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getLegalCase(id: string): Promise<LegalCase | undefined> {
    const [case_] = await db.select().from(legalCases).where(eq(legalCases.id, id));
    return case_;
  }

  async createLegalCase(legalCase: InsertLegalCase): Promise<LegalCase> {
    const [created] = await db.insert(legalCases).values(legalCase).returning();
    return created;
  }

  async updateLegalCase(id: string, updates: Partial<InsertLegalCase>): Promise<LegalCase> {
    const [updated] = await db
      .update(legalCases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(legalCases.id, id))
      .returning();
    return updated;
  }

  // Document templates operations
  async getDocumentTemplates(category?: string): Promise<DocumentTemplate[]> {
    let query = db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true));
    
    if (category) {
      query = query.where(and(
        eq(documentTemplates.isActive, true),
        eq(documentTemplates.category, category as any)
      ));
    }
    
    return await query.orderBy(asc(documentTemplates.name));
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template;
  }

  // Generated documents operations
  async getUserGeneratedDocuments(userId: string): Promise<(GeneratedDocument & { template: DocumentTemplate })[]> {
    const results = await db
      .select({
        document: generatedDocuments,
        template: documentTemplates,
      })
      .from(generatedDocuments)
      .leftJoin(documentTemplates, eq(generatedDocuments.templateId, documentTemplates.id))
      .where(eq(generatedDocuments.userId, userId))
      .orderBy(desc(generatedDocuments.createdAt));
    
    return results.map(result => ({
      ...result.document,
      template: result.template!,
    }));
  }

  async createGeneratedDocument(document: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const [created] = await db.insert(generatedDocuments).values(document).returning();
    return created;
  }

  // Legal aid applications
  async getLegalAidApplications(filters?: { status?: string; limit?: number; offset?: number }): Promise<(LegalAidApplication & { user: User })[]> {
    let query = db
      .select({
        application: legalAidApplications,
        user: users,
      })
      .from(legalAidApplications)
      .leftJoin(users, eq(legalAidApplications.userId, users.id));
    
    if (filters?.status) {
      query = query.where(eq(legalAidApplications.status, filters.status));
    }
    
    query = query.orderBy(desc(legalAidApplications.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    const results = await query;
    return results.map(result => ({
      ...result.application,
      user: result.user!,
    }));
  }

  async getUserLegalAidApplications(userId: string): Promise<LegalAidApplication[]> {
    return await db
      .select()
      .from(legalAidApplications)
      .where(eq(legalAidApplications.userId, userId))
      .orderBy(desc(legalAidApplications.createdAt));
  }

  async createLegalAidApplication(application: InsertLegalAidApplication): Promise<LegalAidApplication> {
    const [created] = await db.insert(legalAidApplications).values(application).returning();
    return created;
  }

  async updateLegalAidApplication(id: string, updates: Partial<InsertLegalAidApplication>): Promise<LegalAidApplication> {
    const [updated] = await db
      .update(legalAidApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(legalAidApplications.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
