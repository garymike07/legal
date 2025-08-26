import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertLegalDocumentSchema, insertForumQuestionSchema, insertForumAnswerSchema, insertLegalCaseSchema } from "@shared/schema";
import { generateLegalSummary, analyzeLegalQuestion, generateDocumentContent } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Legal documents routes
  app.get('/api/legal-documents', async (req, res) => {
    try {
      const { category, search, limit = '20', offset = '0' } = req.query;
      const documents = await storage.getLegalDocuments({
        category: category as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(documents);
    } catch (error) {
      console.error("Error fetching legal documents:", error);
      res.status(500).json({ message: "Failed to fetch legal documents" });
    }
  });

  app.get('/api/legal-documents/:id', async (req, res) => {
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

  app.post('/api/legal-documents', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertLegalDocumentSchema.parse(req.body);
      const document = await storage.createLegalDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating legal document:", error);
      res.status(500).json({ message: "Failed to create legal document" });
    }
  });

  // Forum routes
  app.get('/api/forum/questions', async (req, res) => {
    try {
      const { category, status, limit = '20', offset = '0' } = req.query;
      const questions = await storage.getForumQuestions({
        category: category as string,
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(questions);
    } catch (error) {
      console.error("Error fetching forum questions:", error);
      res.status(500).json({ message: "Failed to fetch forum questions" });
    }
  });

  app.get('/api/forum/questions/:id', async (req, res) => {
    try {
      const question = await storage.getForumQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      // Increment view count
      const currentViews = question.viewsCount ?? 0;
      await storage.updateForumQuestion(req.params.id, {
        viewsCount: currentViews + 1,
      });
      
      res.json(question);
    } catch (error) {
      console.error("Error fetching forum question:", error);
      res.status(500).json({ message: "Failed to fetch forum question" });
    }
  });

  app.post('/api/forum/questions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumQuestionSchema.parse({
        ...req.body,
        userId,
      });
      const question = await storage.createForumQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating forum question:", error);
      res.status(500).json({ message: "Failed to create forum question" });
    }
  });

  app.get('/api/forum/questions/:id/answers', async (req, res) => {
    try {
      const answers = await storage.getForumAnswers(req.params.id);
      res.json(answers);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
      res.status(500).json({ message: "Failed to fetch forum answers" });
    }
  });

  app.post('/api/forum/questions/:id/answers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertForumAnswerSchema.parse({
        ...req.body,
        userId,
        questionId: req.params.id,
      });
      const answer = await storage.createForumAnswer(validatedData);
      res.status(201).json(answer);
    } catch (error) {
      console.error("Error creating forum answer:", error);
      res.status(500).json({ message: "Failed to create forum answer" });
    }
  });

  // Voting routes
  app.post('/api/forum/questions/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { type } = req.body; // 'up' or 'down'
      const question = await storage.getForumQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const safeUp = question.upvotes ?? 0;
      const safeDown = question.downvotes ?? 0;

      const updates = type === 'up' 
        ? { upvotes: safeUp + 1 }
        : { downvotes: safeDown + 1 };

      const updated = await storage.updateForumQuestion(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error voting on question:", error);
      res.status(500).json({ message: "Failed to vote on question" });
    }
  });

  app.post('/api/forum/answers/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { type } = req.body; // 'up' or 'down'
      const answer = await storage.getForumAnswers(req.params.id);
      if (!answer.length) {
        return res.status(404).json({ message: "Answer not found" });
      }

      const currentAnswer = answer[0];
      const safeUp = currentAnswer.upvotes ?? 0;
      const safeDown = currentAnswer.downvotes ?? 0;

      const updates = type === 'up' 
        ? { upvotes: safeUp + 1 }
        : { downvotes: safeDown + 1 };

      const updated = await storage.updateForumAnswer(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error voting on answer:", error);
      res.status(500).json({ message: "Failed to vote on answer" });
    }
  });

  // Legal cases routes (for lawyers)
  app.get('/api/cases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'lawyer') {
        return res.status(403).json({ message: "Access denied. Lawyers only." });
      }

      const { status, limit = '20', offset = '0' } = req.query;
      const cases = await storage.getLegalCases(userId, {
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(cases);
    } catch (error) {
      console.error("Error fetching legal cases:", error);
      res.status(500).json({ message: "Failed to fetch legal cases" });
    }
  });

  app.post('/api/cases', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'lawyer') {
        return res.status(403).json({ message: "Access denied. Lawyers only." });
      }

      const validatedData = insertLegalCaseSchema.parse({
        ...req.body,
        lawyerId: userId,
      });
      const case_ = await storage.createLegalCase(validatedData);
      res.status(201).json(case_);
    } catch (error) {
      console.error("Error creating legal case:", error);
      res.status(500).json({ message: "Failed to create legal case" });
    }
  });

  app.get('/api/cases/:id', isAuthenticated, async (req: any, res) => {
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

  // Document templates routes
  app.get('/api/document-templates', async (req, res) => {
    try {
      const { category } = req.query;
      const templates = await storage.getDocumentTemplates(category as string);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching document templates:", error);
      res.status(500).json({ message: "Failed to fetch document templates" });
    }
  });

  app.get('/api/document-templates/:id', async (req, res) => {
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

  // Generated documents routes
  app.get('/api/generated-documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserGeneratedDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching generated documents:", error);
      res.status(500).json({ message: "Failed to fetch generated documents" });
    }
  });

  app.post('/api/generate-document', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { templateId, formData, title } = req.body;
      
      // In a real implementation, you would generate PDF/DOCX files here
      // For now, we'll just store the form data
      const document = await storage.createGeneratedDocument({
        userId,
        templateId,
        title,
        formData,
        pdfUrl: null,
        docxUrl: null,
      });
      
      res.status(201).json(document);
    } catch (error) {
      console.error("Error generating document:", error);
      res.status(500).json({ message: "Failed to generate document" });
    }
  });

  // Legal aid applications routes
  app.get('/api/legal-aid/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role === 'admin') {
        // Admin can see all applications
        const { status, limit = '20', offset = '0' } = req.query;
        const applications = await storage.getLegalAidApplications({
          status: status as string,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        });
        res.json(applications);
      } else {
        // Users can only see their own applications
        const applications = await storage.getUserLegalAidApplications(userId);
        res.json(applications);
      }
    } catch (error) {
      console.error("Error fetching legal aid applications:", error);
      res.status(500).json({ message: "Failed to fetch legal aid applications" });
    }
  });

  // AI-powered API routes
  app.post('/api/ai/legal-summary', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const summary = await generateLegalSummary(text);
      res.json({ summary });
    } catch (error) {
      console.error("Error generating legal summary:", error);
      res.status(500).json({ message: "Failed to generate legal summary" });
    }
  });

  app.post('/api/ai/analyze-question', async (req, res) => {
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

  app.post('/api/ai/generate-document', async (req, res) => {
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

  // Constitution search route (proxy to Kenya Law API)
  app.get('/api/constitution/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query required" });
      }

      // This would integrate with Kenya Law API or local constitution database
      // For now, returning mock structure
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

      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes((q as string).toLowerCase()) ||
        result.content.toLowerCase().includes((q as string).toLowerCase())
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
