# Kenya Legal Aid Platform

## Overview

This is a comprehensive legal aid platform for Kenya that provides access to constitutional resources, legal documents, and community support. The platform serves three primary user types: citizens seeking legal information, lawyers managing cases and providing advice, and imprisoned individuals accessing their rights and legal procedures. The application features an interactive Constitution explorer, document generation tools, a Q&A forum for legal questions, and specialized dashboards for different user roles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom design system featuring neuomorphic design elements and dark theme

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM with PostgreSQL using Neon serverless database
- **Authentication**: Replit Auth integration with OpenID Connect and Passport.js
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful API with structured error handling and request logging middleware

### Database Schema
- **User Management**: Users table with role-based access (citizen, lawyer, prisoner, admin)
- **Legal Documents**: Categorized legal documents with full-text search capabilities
- **Forum System**: Questions and answers with voting, categories, and status tracking
- **Case Management**: Lawyer case tracking with client information and court details
- **Document Generation**: Template-based document creation with user customization
- **Legal Aid Applications**: Support for legal aid request processing

### Authentication & Authorization
- **Primary Auth**: Replit Auth with OpenID Connect for seamless integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Role-Based Access**: Different user roles with appropriate permission levels
- **Route Protection**: Middleware-based authentication checks with automatic redirects

### Key Design Patterns
- **Monorepo Structure**: Shared types and schemas between client and server in `/shared` directory
- **Type Safety**: End-to-end TypeScript with Zod schemas for runtime validation
- **Component Architecture**: Reusable UI components with consistent design system
- **Error Handling**: Centralized error handling with user-friendly messages and automatic retry logic
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Drizzle Kit**: Database migrations and schema management

### Authentication Services
- **Replit Auth**: Primary authentication provider with OpenID Connect
- **Passport.js**: Authentication middleware for Express

### AI Integration
- **OpenAI API**: GPT-5 integration for legal document summaries and question analysis
- **Legal Analysis**: AI-powered categorization and complexity assessment of legal questions

### UI & Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **shadcn/ui**: Pre-built component library for consistent design system
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### External APIs & Resources
- **Kenya Law Database**: Integration with official legal document repository
- **Constitution References**: Links to official Constitution of Kenya 2010 documents
- **National Legal Aid Service**: Integration points for legal aid applications