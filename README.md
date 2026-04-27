# Yamaha Ride Personality Experience

A mobile-first AI microsite where users can submit leads, verify their phone number, take a personality quiz, upload a photo, and generate a cinematic AI persona card using Gemini.

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Database**: MySQL (using `mysql2`)
- **AI**: Google Gen AI SDK (`@google/genai`) with Gemini models
- **OTP Provider**: BulkSMSBD
- **Authentication**: JWT (using `jose`)
- **Styling**: Vanilla CSS (CSS Modules)

## Features
1. **Lead Capture & OTP Verification** (Rate Limited & Secure)
2. **Dynamic Quiz** (Maps user traits to bikes)
3. **AI Image Generation** (Generates 4:5 cinematic portraits)
4. **Admin Dashboard** (Manage bikes, rules, prompts, and view stats)

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Setup Instructions

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Database Setup:**
   Create a MySQL database (e.g., `yamaha_ai`).

3. **Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in the placeholders:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Ensure you provide valid Gemini API keys, DB credentials, BulkSMSBD keys, and Admin credentials.

4. **Initialize Database:**
   Import `src/lib/server/schema.sql` into your MySQL database to create the tables. You can do this via your SQL client or CLI:
   \`\`\`bash
   mysql -u root -p yamaha_ai < src/lib/server/schema.sql
   \`\`\`

5. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access Application:**
   - User site: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login`

## Configuration (via Admin Dashboard)
Before users can successfully complete the flow, you must log in to the admin dashboard and:
1. Add at least one **Bike**.
2. Add at least one **Rule** (mapping quiz traits to a bike).
3. Set an active **Prompt**.

## Note for Production
- In a production environment, you should replace the local filesystem saving (`public/uploads`) in the generation API with cloud storage like AWS S3.
- Adjust `NODE_ENV` to `production` so secure cookies work properly.
