# DEBRANDED Frontend Development Guide

## Architecture Overview

The DEBRANDED frontend is designed for aggressive SEO, blazing-fast load times, and a premium visual aesthetic. It comprises the main marketing site and the secure Client Portal.

### Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand (for portal state)
- **Data Fetching**: React Query (TanStack Query) / Apollo Client (if using GraphQL) & Next.js native `fetch` for SSR.
- **Tracking**: Next.js API Routes (Server-side tracking).

## Core Principles & Design Aesthetics

1. **The "Premium Tech" Vibe**:
   - Strict adherence to a highly customized dark-mode aesthetic.
   - Neon-accented highlights (electric blues, vivid purples, or neon greens).
   - Glassmorphism, smooth micro-animations, and dynamic interactions triggered by user behavior.
   - High-end typography (e.g., Inter, Space Grotesk, or Syncopate).
2. **Aggressive SEO & Performance**:
   - Heavy reliance on Next.js Server-Side Rendering (SSR) and Server Components.
   - Optimized images, edge caching, and semantic HTML to dominate search engine rankings.
3. **Behavioral Tracking Foundation**:
   - The UI must passively capture deep analytical insights (scroll depth, VSL watch time tracking, hover durations over pricing tables) and stream them to the Antigravity Agent.

## Key Modules

### Next.js API Routes & Server-Side Tracking

- **Purpose**: To bypass client-side ad blockers and Apple's Intelligent Tracking Prevention (ITP).
- **Implementation**: Instead of running Meta/TikTok pixel scripts entirely on the client, standard UI interactions (add to cart, form submission) trigger a standard Next.js API route (`/api/track`). This serverless function securely relays the event payload to the Node.js backend or directly to CAPI.

### The Client Portal

- **Purpose**: A transparent, secure dashboard for partner brands to monitor DEBRANDED's performance.
- **Features**:
  - Secure JWT-based authentication.
  - Real-time data visualization (Charts/Graphs using Recharts or Chart.js) fetched directly from CockroachDB.
  - Live metric displays: Revenue Generated, Current CPA (Cost Per Acquisition), and Active Campaign ROI.

### VSL (Video Sales Letter) Integration

- Custom video player components equipped with event listeners to track playback milestones (e.g., 25%, 50%, 75%, 100%). These milestones are transmitted to the Antigravity Agent to determine lead warmth and trigger WhatsApp recovery campaigns.

## Resources & Development Guide

- **Phase 1: Foundation**: Run `npx create-next-app@latest`. Configure Tailwind CSS with the custom dark-mode color palette. Set up root layout and font optimizations.
- **Phase 2: UI Component Library**: Build reusable, styled components (Buttons, Inputs, Cards) adhering strictly to the "premium tech" look. Implement animation libraries like Framer Motion or GSAP for scroll reveals and button hovers.
- **Phase 3: Client Portal Structure**: Create guarded routes using Next.js Middleware. Design the dashboard layout and data-fetching hooks.
- **Phase 4: Analytics Integration**: Develop the custom hook (`useTracking.ts`) that listens to user events and securely POSTs data to our self-hosted API routes.
- **Phase 5: Performance Auditing**: Achieve 90+ Lighthouse scores for Performance, Accessibility, Best Practices, and SEO.
