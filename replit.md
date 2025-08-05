# FlashKademy - Educational Flash Cards Application

## Overview

FlashKademy is a comprehensive K-8 educational flash card Progressive Web App (PWA) with gamification features, 3D custom avatars, sibling competitions, and multi-subject content. The application provides an engaging learning experience for students across different grade levels with features like spaced repetition, achievements, progress tracking, interactive quizzes, and family-based competitive learning.

### Key Features
- **Guest Mode**: Visitors can use basic flash cards and quizzes without registration - COMPLETED
- **Member Mode**: Full feature access with profile saving, progress tracking, and achievements
- **Dual Authentication**: Seamless switching between guest and member experiences - COMPLETED
- **PWA Support**: Full offline functionality and cross-platform compatibility
- **Welcome Interface**: Clear display of member benefits vs guest limitations - COMPLETED
- **3D Avatar System**: Detailed 3D SVG avatars with realistic lighting and diverse character designs - COMPLETED
- **Learning Companion**: Growing avatar that evolves with student progress and achievements - COMPLETED
- **Sibling Competitions**: Challenge system with leaderboards, team goals, and family competitions - COMPLETED

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**August 5, 2025 - Mobile App Store Conversion Completed**
- Successfully converted PWA to native iOS and Android applications using Capacitor
- Created complete mobile app structure with Xcode and Android Studio projects
- Configured mobile-specific features: splash screens, status bars, keyboard handling, and app state management
- Built comprehensive app store deployment guide with pricing strategy ($9.99-14.99/month) and revenue forecasts ($450K-1.2M year 1)
- Added mobile initialization code and platform detection for seamless PWA-to-native transition
- Generated app store descriptions, competitive analysis, and technical deployment instructions
- App ready for app store submission with unique 3D avatars and family competition system as key differentiators

**August 5, 2025 - 3D Avatar System and Competition Features Completed**
- Replaced flat emoji avatars with detailed 3D SVG avatars featuring realistic lighting, facial features, and personality
- Created 4 unique 3D avatars with diverse skin tones, hairstyles, eye colors, and dimensional styling effects
- Enhanced subject card contrast significantly with black text, drop shadows, and white badge backgrounds for WCAG compliance
- Implemented comprehensive sibling competition system with 4 challenge types (Speed Round, Accuracy Battle, Streak Challenge, Subject Mastery)
- Built family leaderboards with weekly points, streak masters, and accuracy rankings with 3D avatar integration
- Created collaborative goal system for family learning targets with progress tracking and rewards
- Extended database schema with competition tables for challenges, leaderboards, goals, and achievements
- Added competition API endpoints for creating challenges, accepting battles, and tracking team goals
- Integrated competitions page with trophy icon in bottom navigation menu

**August 4, 2025 - Personalized Learning Avatar System Completed**
- Created comprehensive learning avatar that grows with student progress (5 stages: Seedling → Flowering Scholar)
- Added avatar progression based on points, level, and study streaks with experience calculation
- Built unlockable accessories system (glasses, graduation cap, medal, crown) and mood customization
- Integrated learning companion prominently on home page with dedicated section
- Added small avatar widget to study screens for real-time encouragement during learning
- Updated database schema with avatarGrowth JSON field to store avatar progression data
- Created API endpoints for saving and updating avatar growth progress
- Fixed profile page layout issue by separating learning avatar into dedicated section
- Resolved red vertical line styling conflict in profile page layout

**August 4, 2025 - Quiz Functionality Completed**
- Fixed quiz start button issue - all quiz modes now properly display start screens
- Implemented proper quiz flow: Mode Selection → Subject/Grade Selection → Quiz Preview → Start Quiz → Questions → Results
- Added loading states and error handling for quiz initialization
- Fixed React Query URL construction to use proper query parameters
- Created randomized multiple choice questions using real flashcard data as options
- Correct answers now appear in random positions (A, B, C, or D) instead of always being option A
- All quiz modes working: Timed Quiz, Practice Quiz, and Mixed Review
- Enhanced quiz scoring and progress tracking with proper answer validation

**July 29, 2025 - Application Fixes and Accessibility Improvements**
- Fixed deprecated tsx loader flag causing app startup failures
- App now running successfully with proper database integration
- Implemented comprehensive high-contrast accessibility improvements:
  - Improved text contrast ratios across all components
  - Enhanced color scheme with darker text and better readability
  - Added dark mode support for navigation and UI components
  - Improved badge and button contrast for accessibility compliance
  - Enhanced flash card text with drop shadows for better visibility
- Restored all contrast improvements that had been reverted
- Updated UI component styling for WCAG compliance

**July 29, 2025 - Database Integration Completed**
- Migrated from in-memory storage to PostgreSQL database
- Implemented comprehensive database schema with relations
- Added DatabaseStorage class with full CRUD operations
- Successfully deployed database schema using Drizzle migrations
- All flash cards, user progress, achievements, and quiz data now persist in database

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
- **ORM**: Drizzle ORM for type-safe database operations - COMPLETED
- **Database**: PostgreSQL (configured for Neon Database) - COMPLETED
- **Migrations**: Drizzle Kit for schema management - COMPLETED
- **Connection**: @neondatabase/serverless for serverless database connections - COMPLETED
- **Storage**: DatabaseStorage implementation with full CRUD operations - COMPLETED

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