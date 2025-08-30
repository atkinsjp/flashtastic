# FlashTastic - Educational Flash Cards Application

## Overview
FlashTastic is a comprehensive K-8 educational flash card Progressive Web App (PWA) designed to provide an engaging learning experience. It incorporates gamification features, 3D custom avatars, sibling competitions, and multi-subject content. The platform offers features like spaced repetition, achievements, progress tracking, and interactive quizzes, aiming to foster family-based competitive learning. Key capabilities include a Guest Mode for basic flashcards and quizzes, a Member Mode with full feature access and progress saving, seamless dual authentication, and full PWA support for offline functionality. The application also features an evolving 3D avatar system that grows with student progress.

## Project Status
**GOOGLE PLAY UPDATE SUBMITTED** (August 2025) - Successfully fixed Google Play device compatibility issue and submitted version 4.0.0.0 for review. Fixed AndroidManifest.xml with explicit hardware feature declarations (all marked as not required) and screen size support. Built using PWABuilder to avoid local Android build complexities. App now supports broad range of Android devices and awaits Google Play approval.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **PWA Features**: Service Worker implementation for offline functionality
- **Build Tool**: Vite for development and build processes
- **UI/UX Decisions**: Incorporates detailed 3D SVG avatars with realistic lighting, animated learning paths (Foundation → Practice → Challenge → Mastery), visual feedback, and framer-motion animations for smooth transitions. Design emphasizes high contrast and accessibility (WCAG compliance) with dark mode support. Subject cards feature black text, drop shadows, and white badge backgrounds.

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Development**: Hot module replacement with Vite integration

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for serverless database connections
- **Storage**: DatabaseStorage implementation with full CRUD operations
- **Data Models**: Comprehensive schema includes Users (with points, levels, streaks), FlashCards (with subject/grade categorization), UserProgress (for spaced repetition), Achievements, StudySessions, and Quizzes.

### System Design Choices
- **Dual Mode System**: Guest mode provides immediate access without persistence, while Member mode offers full profile management and progress tracking.
- **Authentication**: Utilizes React Context API for seamless state management and local storage for user preferences.
- **AI Integration**: Gemini 2.5 API is used for an AI-powered study buddy chatbot, providing personalized tutoring with age-appropriate responses, and for unlimited AI-powered question generation across subjects and grades.
- **Gamification**: Includes a comprehensive sibling competition system with 4 challenge types (Speed Round, Accuracy Battle, Streak Challenge, Subject Mastery), family leaderboards, collaborative goal tracking, and an achievement system with unlockable badges.
- **Pricing Strategy**: Three-tier model with Free (5 quizzes/day, 3 flashcard sets), Young Pro ($4.99/month or $49.99/year - unlimited practice, progress tracking, avatars, competitions), Premium ($9.99/month or $99.99/year - adds AI study buddy, unlimited AI questions, analytics), and Family Plan ($13.99/month or $139.99/year - Premium features for up to 4 children). All annual plans offer 17% savings. Frontend implements dynamic pricing display with monthly/yearly toggle and plan selection interface.
- **Mobile Conversion**: The PWA is convertible to native iOS and Android applications using Capacitor, including platform-specific features like splash screens and app state management.

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.5 API

### Development Dependencies
- **Build System**: Vite
- **Linting**: TypeScript compiler

### PWA Dependencies
- **Service Worker**: Custom implementation
- **Offline Storage**: Browser APIs
- **Mobile Integration**: Capacitor (for iOS and Android app conversion)