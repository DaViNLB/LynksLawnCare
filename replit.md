# Replit.md

## Overview

This is a full-stack lawn care service application built with React, Express, and Drizzle ORM. The application provides a professional website for Lynks Lawn Care (lynkslawncare.com), a Delaware-based lawn care business, featuring service listings, pricing calculations, booking functionality, and payment processing through Stripe integration.

## User Preferences

Preferred communication style: Simple, everyday language.
Business Domain: lynkslawncare.com
Business Name: Lynks Lawn Care

Recent Changes:
- Updated all branding from GreenScape Pro to Lynks Lawn Care (January 27, 2025)
- Updated domain references to lynkslawncare.com throughout the application
- Updated meta tags and SEO information for the new brand
- Fixed TypeScript errors in booking and checkout components
- Made Stripe integration optional for future setup (January 27, 2025)
- Updated hero section: darker green leaf icon, lawn background with mowing lines
- Made "View Services" button text visible, removed customer stats and testimonials
- Integrated PostgreSQL database with Drizzle ORM (January 27, 2025)
- Integrated Google Maps JavaScript API with interactive service area map (January 27, 2025)
- Updated contact information: phone (302) 469-0503, email Davinlynksservices@gmail.com (January 27, 2025)
- Simplified services to single "Lawn Mowing & Maintenance" service at $30/visit (January 27, 2025)
- Added subscription options: weekly, bi-weekly, monthly, quarterly, yearly (January 27, 2025)
- Removed "Read Reviews" button from About section (January 27, 2025)
- Updated pricing calculator for residential properties under 0.1 acre base pricing (January 27, 2025)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with development server integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Payment Processing**: Stripe integration for payment intents
- **Data Storage**: PostgreSQL database with Drizzle ORM integration for persistent data storage

### Data Storage Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in shared directory for type safety across frontend/backend
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Database Schema
The application uses three main entities:
- **Users**: Authentication and user management
- **Bookings**: Service booking records with payment tracking
- **Contacts**: Contact form submissions and inquiries

### Core Services
- **Lawn Mowing & Maintenance**: Single professional service offering with subscription options (weekly, bi-weekly, monthly, quarterly, yearly) starting at $30/visit for residential properties under 0.1 acre

### Payment System
- Stripe integration for secure payment processing
- Payment intent creation with booking association
- Automatic price calculation based on service type and property size

### UI Components
- Comprehensive shadcn/ui component library implementation
- Custom components for business-specific functionality (Hero, Services, Testimonials, etc.)
- Responsive design with mobile-first approach

## Data Flow

1. **Service Discovery**: Users browse services and pricing through the homepage
2. **Price Calculation**: Interactive pricing calculator provides estimates based on service type and property size
3. **Booking Creation**: Users submit booking requests through the booking form
4. **Payment Processing**: Bookings redirect to Stripe checkout for payment completion
5. **Contact Management**: Separate contact form for general inquiries

### API Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Retrieve booking details
- `POST /api/create-payment-intent` - Initialize Stripe payment
- `POST /api/contacts` - Submit contact inquiries

## External Dependencies

### Payment Processing
- **Stripe**: Complete payment infrastructure with React Stripe.js components
- **Environment Variables**: Separate public/secret keys for frontend/backend

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Management**: Environment-based database URL configuration

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first styling framework
- **React Hook Form**: Form validation and management

### Development Tools
- **Vite**: Fast development server with HMR
- **TypeScript**: Full type safety across the application
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend bundles to `dist/index.js` with ESBuild
- Static asset serving in production mode

### Environment Configuration
- Development: Vite dev server with Express API
- Production: Compiled Express server serving static React build
- Database: Environment-based PostgreSQL connection

### Development Workflow
- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build both frontend and backend for production
- `npm run db:push`: Push database schema changes via Drizzle

The application follows a standard full-stack pattern with clear separation between frontend presentation, backend API logic, and data persistence layers. The architecture supports easy scaling and maintenance while providing a robust foundation for the lawn care business operations.