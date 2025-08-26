var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/app.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  caseStatusEnum: () => caseStatusEnum,
  documentCategoryEnum: () => documentCategoryEnum,
  documentTemplates: () => documentTemplates,
  forumAnswers: () => forumAnswers,
  forumAnswersRelations: () => forumAnswersRelations,
  forumQuestions: () => forumQuestions,
  forumQuestionsRelations: () => forumQuestionsRelations,
  generatedDocuments: () => generatedDocuments,
  generatedDocumentsRelations: () => generatedDocumentsRelations,
  insertDocumentTemplateSchema: () => insertDocumentTemplateSchema,
  insertForumAnswerSchema: () => insertForumAnswerSchema,
  insertForumQuestionSchema: () => insertForumQuestionSchema,
  insertGeneratedDocumentSchema: () => insertGeneratedDocumentSchema,
  insertLegalAidApplicationSchema: () => insertLegalAidApplicationSchema,
  insertLegalCaseSchema: () => insertLegalCaseSchema,
  insertLegalDocumentSchema: () => insertLegalDocumentSchema,
  insertUserSchema: () => insertUserSchema,
  legalAidApplications: () => legalAidApplications,
  legalAidApplicationsRelations: () => legalAidApplicationsRelations,
  legalCases: () => legalCases,
  legalCasesRelations: () => legalCasesRelations,
  legalDocuments: () => legalDocuments,
  questionStatusEnum: () => questionStatusEnum,
  sessions: () => sessions,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var userRoleEnum = pgEnum("user_role", ["citizen", "lawyer", "prisoner", "admin"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("citizen"),
  verified: boolean("verified").default(false),
  bio: text("bio"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var documentCategoryEnum = pgEnum("document_category", [
  "constitutional",
  "civil",
  "criminal",
  "family",
  "property",
  "business",
  "employment",
  "human_rights"
]);
var legalDocuments = pgTable("legal_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  category: documentCategoryEnum("category").notNull(),
  difficultyLevel: integer("difficulty_level").notNull().default(1),
  // 1-5 scale
  language: varchar("language", { length: 10 }).default("en"),
  tags: text("tags").array(),
  sourceUrl: varchar("source_url"),
  isOfficial: boolean("is_official").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var questionStatusEnum = pgEnum("question_status", ["open", "answered", "closed"]);
var forumQuestions = pgTable("forum_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: documentCategoryEnum("category").notNull(),
  status: questionStatusEnum("status").default("open"),
  viewsCount: integer("views_count").default(0),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var forumAnswers = pgTable("forum_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").references(() => forumQuestions.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isAccepted: boolean("is_accepted").default(false),
  expertVerified: boolean("expert_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var caseStatusEnum = pgEnum("case_status", ["active", "pending", "closed", "appealed"]);
var legalCases = pgTable("legal_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lawyerId: varchar("lawyer_id").references(() => users.id).notNull(),
  clientName: varchar("client_name").notNull(),
  clientContact: varchar("client_contact"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").notNull(),
  status: caseStatusEnum("status").default("active"),
  courtName: varchar("court_name"),
  caseNumber: varchar("case_number"),
  nextHearing: timestamp("next_hearing"),
  documents: text("documents").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var documentTemplates = pgTable("document_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").notNull(),
  template: jsonb("template").notNull(),
  // JSON structure for form fields
  htmlTemplate: text("html_template"),
  // HTML template for document generation
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var generatedDocuments = pgTable("generated_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  templateId: varchar("template_id").references(() => documentTemplates.id).notNull(),
  title: varchar("title").notNull(),
  formData: jsonb("form_data").notNull(),
  pdfUrl: varchar("pdf_url"),
  docxUrl: varchar("docx_url"),
  createdAt: timestamp("created_at").defaultNow()
});
var legalAidApplications = pgTable("legal_aid_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  caseDescription: text("case_description").notNull(),
  financialStatus: jsonb("financial_status").notNull(),
  supportingDocuments: text("supporting_documents").array(),
  status: varchar("status").default("pending"),
  // pending, approved, rejected
  assignedLawyerId: varchar("assigned_lawyer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  forumQuestions: many(forumQuestions),
  forumAnswers: many(forumAnswers),
  legalCases: many(legalCases),
  generatedDocuments: many(generatedDocuments),
  legalAidApplications: many(legalAidApplications)
}));
var forumQuestionsRelations = relations(forumQuestions, ({ one, many }) => ({
  user: one(users, {
    fields: [forumQuestions.userId],
    references: [users.id]
  }),
  answers: many(forumAnswers)
}));
var forumAnswersRelations = relations(forumAnswers, ({ one }) => ({
  question: one(forumQuestions, {
    fields: [forumAnswers.questionId],
    references: [forumQuestions.id]
  }),
  user: one(users, {
    fields: [forumAnswers.userId],
    references: [users.id]
  })
}));
var legalCasesRelations = relations(legalCases, ({ one }) => ({
  lawyer: one(users, {
    fields: [legalCases.lawyerId],
    references: [users.id]
  })
}));
var generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  user: one(users, {
    fields: [generatedDocuments.userId],
    references: [users.id]
  }),
  template: one(documentTemplates, {
    fields: [generatedDocuments.templateId],
    references: [documentTemplates.id]
  })
}));
var legalAidApplicationsRelations = relations(legalAidApplications, ({ one }) => ({
  user: one(users, {
    fields: [legalAidApplications.userId],
    references: [users.id]
  }),
  assignedLawyer: one(users, {
    fields: [legalAidApplications.assignedLawyerId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  bio: true,
  location: true
});
var insertLegalDocumentSchema = createInsertSchema(legalDocuments);
var insertForumQuestionSchema = createInsertSchema(forumQuestions);
var insertForumAnswerSchema = createInsertSchema(forumAnswers);
var insertLegalCaseSchema = createInsertSchema(legalCases);
var insertDocumentTemplateSchema = createInsertSchema(documentTemplates);
var insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments);
var insertLegalAidApplicationSchema = createInsertSchema(legalAidApplications);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, asc, like, and, or, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations (mandatory for Replit Auth)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Legal documents operations
  async getLegalDocuments(filters) {
    let query = db.select().from(legalDocuments);
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(legalDocuments.category, filters.category));
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
  async getLegalDocument(id) {
    const [document] = await db.select().from(legalDocuments).where(eq(legalDocuments.id, id));
    return document;
  }
  async createLegalDocument(document) {
    const [created] = await db.insert(legalDocuments).values(document).returning();
    return created;
  }
  async updateLegalDocument(id, updates) {
    const [updated] = await db.update(legalDocuments).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(legalDocuments.id, id)).returning();
    return updated;
  }
  // Forum operations
  async getForumQuestions(filters) {
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(forumQuestions.category, filters.category));
    }
    if (filters?.status) {
      conditions.push(eq(forumQuestions.status, filters.status));
    }
    const baseQuery = db.select({
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
      answersCount: sql2`(SELECT COUNT(*) FROM ${forumAnswers} WHERE ${forumAnswers.questionId} = ${forumQuestions.id})`.as("answers_count")
    }).from(forumQuestions).leftJoin(users, eq(forumQuestions.userId, users.id));
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
    return results.map((result) => ({
      ...result,
      user: result.user,
      answersCount: Number(result.answersCount)
    }));
  }
  async getForumQuestion(id) {
    const [result] = await db.select({
      question: forumQuestions,
      user: users
    }).from(forumQuestions).leftJoin(users, eq(forumQuestions.userId, users.id)).where(eq(forumQuestions.id, id));
    if (!result) return void 0;
    return {
      ...result.question,
      user: result.user
    };
  }
  async createForumQuestion(question) {
    const [created] = await db.insert(forumQuestions).values(question).returning();
    return created;
  }
  async updateForumQuestion(id, updates) {
    const [updated] = await db.update(forumQuestions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(forumQuestions.id, id)).returning();
    return updated;
  }
  async getForumAnswers(questionId) {
    const results = await db.select({
      answer: forumAnswers,
      user: users
    }).from(forumAnswers).leftJoin(users, eq(forumAnswers.userId, users.id)).where(eq(forumAnswers.questionId, questionId)).orderBy(desc(forumAnswers.upvotes), desc(forumAnswers.createdAt));
    return results.map((result) => ({
      ...result.answer,
      user: result.user
    }));
  }
  async createForumAnswer(answer) {
    const [created] = await db.insert(forumAnswers).values(answer).returning();
    return created;
  }
  async updateForumAnswer(id, updates) {
    const [updated] = await db.update(forumAnswers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(forumAnswers.id, id)).returning();
    return updated;
  }
  // Legal cases operations
  async getLegalCases(lawyerId, filters) {
    let query = db.select().from(legalCases).where(eq(legalCases.lawyerId, lawyerId));
    if (filters?.status) {
      query = query.where(and(
        eq(legalCases.lawyerId, lawyerId),
        eq(legalCases.status, filters.status)
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
  async getLegalCase(id) {
    const [case_] = await db.select().from(legalCases).where(eq(legalCases.id, id));
    return case_;
  }
  async createLegalCase(legalCase) {
    const [created] = await db.insert(legalCases).values(legalCase).returning();
    return created;
  }
  async updateLegalCase(id, updates) {
    const [updated] = await db.update(legalCases).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(legalCases.id, id)).returning();
    return updated;
  }
  // Document templates operations
  async getDocumentTemplates(category) {
    let query = db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true));
    if (category) {
      query = query.where(and(
        eq(documentTemplates.isActive, true),
        eq(documentTemplates.category, category)
      ));
    }
    return await query.orderBy(asc(documentTemplates.name));
  }
  async getDocumentTemplate(id) {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template;
  }
  // Generated documents operations
  async getUserGeneratedDocuments(userId) {
    const results = await db.select({
      document: generatedDocuments,
      template: documentTemplates
    }).from(generatedDocuments).leftJoin(documentTemplates, eq(generatedDocuments.templateId, documentTemplates.id)).where(eq(generatedDocuments.userId, userId)).orderBy(desc(generatedDocuments.createdAt));
    return results.map((result) => ({
      ...result.document,
      template: result.template
    }));
  }
  async createGeneratedDocument(document) {
    const [created] = await db.insert(generatedDocuments).values(document).returning();
    return created;
  }
  // Legal aid applications
  async getLegalAidApplications(filters) {
    let query = db.select({
      application: legalAidApplications,
      user: users
    }).from(legalAidApplications).leftJoin(users, eq(legalAidApplications.userId, users.id));
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
    return results.map((result) => ({
      ...result.application,
      user: result.user
    }));
  }
  async getUserLegalAidApplications(userId) {
    return await db.select().from(legalAidApplications).where(eq(legalAidApplications.userId, userId)).orderBy(desc(legalAidApplications.createdAt));
  }
  async createLegalAidApplication(application) {
    const [created] = await db.insert(legalAidApplications).values(application).returning();
    return created;
  }
  async updateLegalAidApplication(id, updates) {
    const [updated] = await db.update(legalAidApplications).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(legalAidApplications.id, id)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
var authEnabled = Boolean(
  process.env.REPLIT_DOMAINS && process.env.DATABASE_URL && process.env.SESSION_SECRET && process.env.REPL_ID
);
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  if (!authEnabled) {
    return (_req, _res, next) => next();
  }
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app) {
  if (!authEnabled) {
    app.get("/api/login", (_req, res) => res.redirect("/"));
    app.get("/api/callback", (_req, res) => res.redirect("/"));
    app.get("/api/logout", (_req, res) => res.redirect("/"));
    return;
  }
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  if (!authEnabled) {
    const devClaims = {
      sub: "dev-user",
      email: "dev@example.com",
      first_name: "Dev",
      last_name: "User",
      profile_image_url: ""
    };
    await storage.upsertUser({
      id: devClaims.sub,
      email: devClaims.email,
      firstName: devClaims.first_name,
      lastName: devClaims.last_name,
      profileImageUrl: devClaims.profile_image_url
    });
    req.user = {
      claims: devClaims,
      expires_at: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 365
      // 1 year
    };
    return next();
  }
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function generateLegalSummary(text2) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in Kenyan law. Provide clear, concise summaries of legal documents and constitutional provisions."
        },
        {
          role: "user",
          content: `Please provide a clear summary of this legal text for someone without legal training: ${text2}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });
    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error) {
    console.error("Error generating legal summary:", error);
    throw new Error("Unable to generate summary at this time.");
  }
}
async function analyzeLegalQuestion(question) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal AI assistant for Kenya. Analyze legal questions and categorize them. Respond with JSON in this format: { 'category': 'constitutional|civil|criminal|family|property|business|employment|human_rights', 'complexity': 1-5, 'suggestedResources': ['resource1', 'resource2'] }"
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      category: result.category || "civil",
      complexity: result.complexity || 3,
      suggestedResources: result.suggestedResources || ["Kenya Law Database", "Constitution of Kenya 2010"]
    };
  } catch (error) {
    console.error("Error analyzing legal question:", error);
    return {
      category: "civil",
      complexity: 3,
      suggestedResources: ["Kenya Law Database", "Constitution of Kenya 2010"]
    };
  }
}
async function generateDocumentContent(templateType, formData) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal document generator for Kenya. Create properly formatted legal documents based on the template type and form data provided. Ensure compliance with Kenyan law."
        },
        {
          role: "user",
          content: `Generate a ${templateType} document using this form data: ${JSON.stringify(formData)}`
        }
      ],
      max_tokens: 2e3,
      temperature: 0.1
    });
    return response.choices[0].message.content || "Error generating document content.";
  } catch (error) {
    console.error("Error generating document content:", error);
    throw new Error("Error generating document content.");
  }
}

// server/routes.ts
async function registerRoutes(app) {
  await setupAuth(app);
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app.get("/api/legal-documents", async (req, res) => {
    try {
      const { category, search, limit = "20", offset = "0" } = req.query;
      const documents = await storage.getLegalDocuments({
        category,
        search,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      res.json(documents);
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      res.status(500).json({ message: "Failed to fetch legal documents" });
    }
  });
  app.get("/api/legal-documents/:id", async (req, res) => {
    try {
      const document = await storage.getLegalDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error("Error fetching legal document:", error);
      res.status(500).json({ message: "Failed to fetch legal document" });
    }
  });
  app.post("/api/legal-documents", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLegalDocumentSchema.parse(req.body);
      const document = await storage.createLegalDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating legal document:", error);
      res.status(500).json({ message: "Failed to create legal document" });
    }
  });
  app.get("/api/forum/questions", async (req, res) => {
    try {
      const { category, status, limit = "20", offset = "0" } = req.query;
      const questions = await storage.getForumQuestions({
        category,
        status,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      res.json(questions);
    } catch (error) {
      console.error("Error fetching forum questions:", error);
      res.status(500).json({ message: "Failed to fetch forum questions" });
    }
  });
  app.get("/api/forum/questions/:id", async (req, res) => {
    try {
      const question = await storage.getForumQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      const currentViews = question.viewsCount ?? 0;
      await storage.updateForumQuestion(req.params.id, {
        viewsCount: currentViews + 1
      });
      res.json(question);
    } catch (error) {
      console.error("Error fetching forum question:", error);
      res.status(500).json({ message: "Failed to fetch forum question" });
    }
  });
  app.post("/api/forum/questions", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumQuestionSchema.parse({
        ...req.body,
        userId
      });
      const question = await storage.createForumQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating forum question:", error);
      res.status(500).json({ message: "Failed to create forum question" });
    }
  });
  app.get("/api/forum/questions/:id/answers", async (req, res) => {
    try {
      const answers = await storage.getForumAnswers(req.params.id);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
      res.status(500).json({ message: "Failed to fetch forum answers" });
    }
  });
  app.post("/api/forum/questions/:id/answers", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumAnswerSchema.parse({
        ...req.body,
        userId,
        questionId: req.params.id
      });
      const answer = await storage.createForumAnswer(validatedData);
      res.status(201).json(answer);
    } catch (error) {
      console.error("Error creating forum answer:", error);
      res.status(500).json({ message: "Failed to create forum answer" });
    }
  });
  app.post("/api/forum/questions/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const { type } = req.body;
      const question = await storage.getForumQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      const safeUp = question.upvotes ?? 0;
      const safeDown = question.downvotes ?? 0;
      const updates = type === "up" ? { upvotes: safeUp + 1 } : { downvotes: safeDown + 1 };
      const updated = await storage.updateForumQuestion(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error voting on question:", error);
      res.status(500).json({ message: "Failed to vote on question" });
    }
  });
  app.post("/api/forum/answers/:id/vote", isAuthenticated, async (req, res) => {
    try {
      const { type } = req.body;
      const answer = await storage.getForumAnswers(req.params.id);
      if (!answer.length) {
        return res.status(404).json({ message: "Answer not found" });
      }
      const currentAnswer = answer[0];
      const safeUp = currentAnswer.upvotes ?? 0;
      const safeDown = currentAnswer.downvotes ?? 0;
      const updates = type === "up" ? { upvotes: safeUp + 1 } : { downvotes: safeDown + 1 };
      const updated = await storage.updateForumAnswer(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error voting on answer:", error);
      res.status(500).json({ message: "Failed to vote on answer" });
    }
  });
  app.get("/api/cases", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role !== "lawyer") {
        return res.status(403).json({ message: "Access denied. Lawyers only." });
      }
      const { status, limit = "20", offset = "0" } = req.query;
      const cases = await storage.getLegalCases(userId, {
        status,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      res.json(cases);
    } catch (error) {
      console.error("Error fetching legal cases:", error);
      res.status(500).json({ message: "Failed to fetch legal cases" });
    }
  });
  app.post("/api/cases", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role !== "lawyer") {
        return res.status(403).json({ message: "Access denied. Lawyers only." });
      }
      const validatedData = insertLegalCaseSchema.parse({
        ...req.body,
        lawyerId: userId
      });
      const case_ = await storage.createLegalCase(validatedData);
      res.status(201).json(case_);
    } catch (error) {
      console.error("Error creating legal case:", error);
      res.status(500).json({ message: "Failed to create legal case" });
    }
  });
  app.get("/api/cases/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const case_ = await storage.getLegalCase(req.params.id);
      if (!case_) {
        return res.status(404).json({ message: "Case not found" });
      }
      if (case_.lawyerId !== userId) {
        return res.status(403).json({ message: "Access denied. Case belongs to another lawyer." });
      }
      res.json(case_);
    } catch (error) {
      console.error("Error fetching legal case:", error);
      res.status(500).json({ message: "Failed to fetch legal case" });
    }
  });
  app.get("/api/document-templates", async (req, res) => {
    try {
      const { category } = req.query;
      const templates = await storage.getDocumentTemplates(category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching document templates:", error);
      res.status(500).json({ message: "Failed to fetch document templates" });
    }
  });
  app.get("/api/document-templates/:id", async (req, res) => {
    try {
      const template = await storage.getDocumentTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching document template:", error);
      res.status(500).json({ message: "Failed to fetch document template" });
    }
  });
  app.get("/api/generated-documents", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserGeneratedDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching generated documents:", error);
      res.status(500).json({ message: "Failed to fetch generated documents" });
    }
  });
  app.post("/api/generate-document", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { templateId, formData, title } = req.body;
      const document = await storage.createGeneratedDocument({
        userId,
        templateId,
        title,
        formData,
        pdfUrl: null,
        docxUrl: null
      });
      res.status(201).json(document);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });
  app.get("/api/legal-aid/applications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role === "admin") {
        const { status, limit = "20", offset = "0" } = req.query;
        const applications = await storage.getLegalAidApplications({
          status,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
        res.json(applications);
      } else {
        const applications = await storage.getUserLegalAidApplications(userId);
        res.json(applications);
      }
    } catch (error) {
      console.error("Error fetching legal aid applications:", error);
      res.status(500).json({ message: "Failed to fetch legal aid applications" });
    }
  });
  app.post("/api/ai/legal-summary", async (req, res) => {
    try {
      const { text: text2 } = req.body;
      if (!text2) {
        return res.status(400).json({ message: "Text is required" });
      }
      const summary = await generateLegalSummary(text2);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating legal summary:", error);
      res.status(500).json({ message: "Failed to generate legal summary" });
    }
  });
  app.post("/api/ai/analyze-question", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      const analysis = await analyzeLegalQuestion(question);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing legal question:", error);
      res.status(500).json({ message: "Failed to analyze legal question" });
    }
  });
  app.post("/api/ai/generate-document", async (req, res) => {
    try {
      const { templateType, formData } = req.body;
      if (!templateType || !formData) {
        return res.status(400).json({ message: "Template type and form data are required" });
      }
      const content = await generateDocumentContent(templateType, formData);
      res.json({ content });
    } catch (error) {
      console.error("Error generating document content:", error);
      res.status(500).json({ message: "Failed to generate document content" });
    }
  });
  app.get("/api/constitution/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query required" });
      }
      const mockResults = [
        {
          id: "article-25",
          title: "Article 25: Fundamental rights and freedoms",
          content: "Every person has inherent dignity and the right to have that dignity respected and protected.",
          chapter: "Chapter 4: Bill of Rights",
          section: "25",
          relevance: 0.95
        },
        {
          id: "article-47",
          title: "Article 47: Fair administrative action",
          content: "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
          chapter: "Chapter 4: Bill of Rights",
          section: "47",
          relevance: 0.87
        }
      ];
      const filtered = mockResults.filter(
        (result) => result.title.toLowerCase().includes(q.toLowerCase()) || result.content.toLowerCase().includes(q.toLowerCase())
      );
      res.json(filtered);
    } catch (error) {
      console.error("Error searching constitution:", error);
      res.status(500).json({ message: "Failed to search constitution" });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: [
            "@tanstack/react-query",
            "zod",
            "wouter"
          ]
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) return "assets/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        }
      }
    },
    chunkSizeWarningLimit: 800
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/app.ts
async function createApp() {
  const app = express2();
  app.use(express2.json());
  app.use(express2.urlencoded({ extended: false }));
  app.use((req, res, next) => {
    const start = Date.now();
    const path3 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function(bodyJson) {
      capturedJsonResponse = bodyJson;
      return originalResJson.call(res, bodyJson);
    };
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path3.startsWith("/api")) {
        let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "\u2026";
        }
        log(logLine);
      }
    });
    next();
  });
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    try {
      serveStatic(app);
    } catch {
    }
  }
  return { app, server };
}

// server/index.ts
(async () => {
  const { app, server } = await createApp();
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
