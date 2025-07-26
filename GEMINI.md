# Gemini Project Context

This file provides context for the Gemini AI assistant to understand the project better.

## Project Overview

This is a Next.js project named "advonex". It's a PWA, a platform for lawyers and clients. This project has a separate nestjs(nesjs+prisma+psql) backend. This nextjs project is strictly frontend only.

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** Shadcn/UI, Radix UI
- **ORM:** Prisma
- **Validation:** Zod
- **Forms:** React Hook Form

## Key Directories

- `src/app/`: Main application routes.
  - `src/app/client/`: Client-facing pages.
  - `src/app/lawyer/`: Lawyer-facing pages.
  - `src/app/login/`: Login page.
- `src/components/`: Reusable React components.
  - `src/components/ui/`: UI components from Shadcn/UI.
  - `src/components/auth/`: Authentication-related components.
- `src/lib/`: Utility functions and libraries.
- `src/services/`: Services for interacting with APIs.
- `src/data/`: Mock data and other data sources.
- `public/`: Static assets.

## Commands

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## Coding Conventions or rules to follow:

- The project uses TypeScript. Please maintain type safety.
- Use the components from `src/components/ui/` for new UI elements or if not there then create here.
- Do not make assumptions, ask the user whenever needed.
- always create a <taskname>-plan.md file in instructions/output folder for each task, and only proceed with implementations after the user's approval.
- check the files/guides in the instruction/input for info regarding backend api usage.
- go through all related code/files/functions: in src/contexts and src/utils to understand the codebase and plan implementation that uses functions existing in these files rather than writing everything from scratch.
- Write clean and readable code with proper comments explaining what's going on.
- If needed extract/optimize code/relevant-parts into other places(new files in same directory) if a single file exceeds 200-300 lines.
- show me your plan before you begin implementations.
- DO NOT make any assumptions, ask me whatever/whenever you need to before/during implementation.
- You should and can use existing code but, DO NOT modify existing codebase without permission or explicit command to do so(ask for permission first to modify existing codebase when needed). Create a permissions section in the plan file where i can provide permission for modifications needed, so that when you start implementing a plan you can see if modification requests are allowed by me.
- instuction/input contains info I provide to you and instructions/output is where plans/info created by you exist.
