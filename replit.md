# Overview

This is a modern pizzeria website for "Monfasani Hermanos" built with a React frontend and Express backend. The application features a complete pizza ordering system with an integrated appointment scheduling system for takeaway and delivery orders. The system manages products (pizzas and empanadas), promotions, and customer orders with time slot management to control restaurant capacity.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling
- **State Management**: React hooks for local state, TanStack Query for server state
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints for products, orders, calendar slots, and promotions
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

## Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Database Schema
- **Products**: Pizza and empanada catalog with pricing and availability
- **Orders**: Customer orders with delivery/pickup modes and scheduling
- **Order Items**: Line items linking orders to products with quantities
- **Calendar Slots**: Time slot management for order scheduling with capacity limits
- **Promotions**: Marketing offers and special deals
- **Settings**: Configurable system parameters

## Authentication and Authorization
- Simple session-based authentication without complex user management
- No role-based access control implemented (single-tenant pizzeria)

## Business Logic Features
- **Order Scheduling**: Time slot booking system with configurable capacity limits
- **Delivery Management**: Address validation and delivery radius checking
- **Inventory Tracking**: Product availability and stock management
- **Pricing System**: Dynamic pricing with promotional offers

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript
- **Backend Framework**: Express.js with TypeScript support
- **Build Tools**: Vite, ESBuild for production builds

## Database and ORM
- **Database**: PostgreSQL via Neon (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation and type safety

## UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icons, React Icons for brand icons
- **Fonts**: Google Fonts (Inter, Playfair Display, Italiana)

## State Management and Data Fetching
- **Server State**: TanStack React Query for API data management
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schemas for runtime type checking

## Development and Deployment
- **Development**: Replit-specific tooling for cloud development
- **Session Management**: Connect-pg-simple for PostgreSQL sessions
- **Email**: SendGrid for transactional emails
- **Utilities**: date-fns for date manipulation, clsx for conditional styling

## Optional Integrations
- **WhatsApp Integration**: Direct messaging for orders
- **Maps**: Contact section with location display
- **Analytics**: Ready for integration with tracking services