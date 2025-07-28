# FlashKademy - Educational Flash Cards Application

## Overview

FlashKademy is a comprehensive K-8 educational flash card Progressive Web App (PWA) with gamification features, custom avatars, and multi-subject content. The application provides an engaging learning experience for students across different grade levels with features like spaced repetition, achievements, progress tracking, and interactive quizzes.

### Key Features
- **Guest Mode**: Visitors can use basic flash cards and quizzes without registration - COMPLETED
- **Member Mode**: Full feature access with profile saving, progress tracking, and achievements
- **Dual Authentication**: Seamless switching between guest and member experiences - COMPLETED
- **PWA Support**: Full offline functionality and cross-platform compatibility
- **Welcome Interface**: Clear display of member benefits vs guest limitations - COMPLETED
- **Avatar System**: Default avatars with customization for members - COMPLETED

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

## Key Components

### Data Models
The application uses a comprehensive schema defined in `shared/schema.ts`:
- **Users**: Student profiles with progress tracking, points, levels, and streaks
- **FlashCards**: Educational content with subject/grade categorization and multimedia support
- **UserProgress**: Spaced repetition tracking with easiness factors and review intervals
- **Achievements**: Gamification system with unlockable badges and rewards
- **StudySessions**: Session tracking for analytics and progress monitoring
- **Quizzes**: Interactive quiz functionality with different modes

### UI Components
Built using shadcn/ui component system:
- **Navigation**: Bottom navigation bar for mobile-first design
- **Cards**: Interactive flash card components with flip animations
- **Modals**: Achievement popups, avatar customization, quiz selection
- **Progress**: Visual progress indicators and charts
- **Forms**: Grade/subject selection and user profile management

### PWA Features
- **Service Worker**: Caches static assets and API responses for offline use
- **Manifest**: App installation and standalone mode configuration
- **Offline Support**: Critical functionality available without internet connection

## Data Flow

### Learning Flow
1. **Grade Selection**: Students choose their grade level (K-8)
2. **Subject Selection**: Pick from vocabulary, math, science, geography, etc.
3. **Study Mode**: Interactive flash cards with spaced repetition algorithm
4. **Progress Tracking**: Automatic tracking of correct/incorrect answers
5. **Achievement System**: Unlock badges and rewards based on performance

### API Architecture
- **RESTful Endpoints**: `/api/users`, `/api/flashcards`, `/api/progress`, etc.
- **Query Integration**: TanStack Query for efficient data fetching and caching
- **Type Safety**: Shared types between frontend and backend via `shared/` directory

### Authentication & Sessions
- **Dual Mode System**: Guest mode (temporary) and Member mode (persistent)
- **Guest Mode**: Immediate access with basic features, no data persistence
- **Member Mode**: Full profile management with progress tracking and achievements
- **Authentication Context**: React Context API for seamless state management
- **Local Storage**: User preferences and authentication state persistence

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography

### Development Dependencies
- **Build System**: Vite with TypeScript support
- **Linting**: TypeScript compiler for type checking
- **Hot Reload**: Vite's HMR for development efficiency

### PWA Dependencies
- **Service Worker**: Custom implementation for caching strategies
- **Offline Storage**: Browser APIs for offline data persistence

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild compiles Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations for schema deployment

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Express server serves static files and API
- **Database**: Environment variable configuration for database URL

### Scaling Considerations
- **Static Assets**: Optimized for CDN deployment
- **API Performance**: Efficient database queries with Drizzle ORM
- **PWA Caching**: Aggressive caching for improved performance

The application follows a modern full-stack architecture with strong type safety, efficient data management, and excellent user experience through PWA features. The modular component structure and shared type definitions ensure maintainability and developer productivity.