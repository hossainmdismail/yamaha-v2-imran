# Yamaha Ride Personality Experience - WORKPLAN

## Phase 1: Setup & Configuration
- [x] Initialize Next.js project with App Router, TypeScript, NO Tailwind (Vanilla CSS).
- [x] Install dependencies: `mysql2`, `zod`, `jose` (for JWT auth), `@google/genai`, `multer`.
- [x] Setup `.env.example` with placeholders for AI, Database, OTP, and Admin.
- [x] Create initial database schema (`schema.sql`).
- **Acceptance Criteria**: Project runs locally. `.env.example` is complete. Schema covers all required tables (Users, Generations, Rules, Prompts, Bikes).
- **Dependencies**: Node.js, MySQL installed.

## Phase 2: Database & Backend Core
- [x] Setup MySQL connection pool in `lib/server/mysql.ts`.
- [x] Implement database initialization script.
- [x] Implement Admin Authentication API (JWT login, session validation).
- **Acceptance Criteria**: DB connection is successful. Admin can obtain a valid JWT token.
- **Dependencies**: Phase 1.

## Phase 3: OTP Service & Flow
- [x] Implement BulkSMSBD integration (`lib/server/bulksmsbd.ts`).
- [x] Implement Send OTP API (Rate limited, DB record).
- [x] Implement Verify OTP API.
- **Acceptance Criteria**: System can generate 4-6 digit OTP, send via BulkSMSBD API, and verify against database within an expiry window.
- **Dependencies**: Phase 2.

## Phase 4: Quiz & Rule Engine
- [x] Create Admin APIs to manage Rules, Prompts, and Bikes.
- [x] Create Quiz submission API (calculate persona/bike based on DB rules).
- **Acceptance Criteria**: Admin can add/edit rules mapping quiz traits to bikes. API returns correct bike/persona based on quiz answers.
- **Dependencies**: Phase 2.

## Phase 5: Gemini AI Service
- [x] Implement Gemini image generation (`gemini-3.1-flash-image-preview`) in `lib/server/gemini.ts`.
- [x] Implement Gemini text generation (`gemini-2.5-flash`) for persona copy.
- [x] Create main Generation API (handles photo upload, calls Gemini, saves result).
- **Acceptance Criteria**: API successfully receives an image, constructs prompt with rules, calls Gemini API, and returns a cinematic 4:5 image.
- **Dependencies**: Phase 4.

## Phase 6: Frontend - User Flow
- [x] Landing page / Lead capture form (`/`).
- [x] OTP verification UI.
- [x] Quiz interface (under 60s).
- [x] Photo upload & Generation loading state.
- [x] Persona Card reveal page (`/result/[id]`).
- **Acceptance Criteria**: Mobile-first responsive UI. User can seamlessly progress from Lead Capture -> OTP -> Quiz -> Upload -> AI Generation -> Shareable Result.
- **Dependencies**: Phase 3, Phase 4, Phase 5.

## Phase 7: Frontend - Admin Dashboard
- [x] Admin Login Page (`/admin/login`).
- [x] Dashboard / Analytics overview.
- [x] User & Lead Export view.
- [x] Bike & Rule Engine Management view.
- [x] Prompt Management view.
- **Acceptance Criteria**: Admin can login securely, view metrics, export leads (CSV), edit rules, and manage bike data.
- **Dependencies**: Phase 2.

## Phase 8: Polish & Deliver
- [x] Add animations, transitions, and micro-interactions.
- [x] Perform security audit (rate limits, inputs, PII).
- [x] Finalize README.md with setup instructions.
- **Acceptance Criteria**: App looks premium, cinematic, and brand-safe. Code is clean and production-ready.
- **Dependencies**: Phase 6, Phase 7.

---
**Blockers/Issues Notes:**
- *None currently.*
