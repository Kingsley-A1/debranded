# DEBRANDED Backend Architecture & Development Guide

## Architecture Overview

The DEBRANDED backend acts as the central brain of our operations. It handles secure routing, massive data processing, cross-platform integrations, and powers our specialized microservices.

### Tech Stack

- **Framework**: Node.js with NestJS (Recommended for enterprise scalability, strict architecture, and built-in GraphQL/REST support) or Express.
- **Database**: CockroachDB (Distributed SQL).
- **API Paradigm**: GraphQL (for flexible Client Portal data fetching) and REST (for webhooks and external integrations).
- **Microservice**: The Antigravity Agent (Analytics & Automation).

## Core Principles

1. **Separation of Concerns**: Controllers handle routing, services handle business logic, and repositories handle database interactions.
2. **Resilience & Scalability**: Designed to handle massive traffic spikes. CockroachDB ensures our database has no single point of failure globally.
3. **Data Integrity & Server-Side Security**: With the death of client-side tracking, the backend is the single source of truth for all conversion data (CAPI).
4. **Real-time Asynchronous Processing**: Utilizing message queues (e.g., Redis/Kafka/RabbitMQ) for the Antigravity Agent to process behavioral events without blocking the main event loop.

## The Antigravity Agent (Core Growth Engine)

A proprietary centralized analytics and automation microservice.

- **Data Ingestion**: Receives streams of user behavior data (clicks, VSL watch time, drop-offs) from the frontend via Next.js API routes.
- **Aggregation**: Combines metrics from Meta Pixel, TikTok Pixel, and Google Analytics.
- **Trigger System**: Rules-engine that monitors for specific conditions (e.g., a high-ticket tech founder hesitates on the checkout page for > 60 seconds).
- **Automation Execution**: Dispatches a webhook to the WhatsApp Business API to deliver a personalized, high-converting recovery message.

## Brand Integration & Conversion Tracking (CAPI)

- **Server-Side Tracking implementation**:
  - Expose API endpoints that the Next.js frontend calls with user event data.
  - The backend securely formats and forwards this data to Meta Conversions API and TikTok Events API using encrypted server-side tokens.
  - Guarantees 100% accurate data attribution against iOS updates and ad blockers.

## Resources & Development Guide

- **Phase 1: Project Setup**: Initialize NestJS/Express project. Configure TypeScript, ESLint, and Prettier. Set up environment variables for development, staging, and production.
- **Phase 2: Database Connection**: Integrate Prisma ORM or TypeORM with CockroachDB. Define schemas for Users, Brands, Campaigns, and Tracking Events.
- **Phase 3: Authentication**: Implement JWT-based secure login using Passport.js for the Client Portal.
- **Phase 4: CAPI Integration**: Build the tracking modules mapping to Meta and TikTok API specifications.
- **Phase 5: The Antigravity Agent**: Develop the webhook listening architecture and the WhatsApp Business API integration.

### Recommended Libraries

- `prisma` (ORM - highly recommended for CockroachDB compatibility and type safety)
- `@nestjs/graphql` & `apollo-server-express`
- `axios` or `fetch` for CAPI requests
- `twilio` or official Meta WhatsApp Business API SDK
