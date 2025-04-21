# Advonex Development Guide

## Core Principles

1. **Prisma Schema as Single Source of Truth**: Use Prisma-generated types throughout the application
2. **API-First Development**: All data operations go through API routes
3. **Lightweight State Management**: Use React Context and localStorage without external state libraries
4. **Separation of Concerns**: Clear boundaries between data, API, state, and UI layers

## Implementation Approaches

### Data Layer

- **Prisma Client**: Central database access point
- **Type Safety**: Leverage Prisma-generated types
- **Data Validation**: Validate all data at API boundaries using Zod

### API Layer

- **API Routes**: All database operations happen through Next.js API routes
- **Route Structure**: Organize by resource (users, lawyers, specializations)
- **Error Handling**: Consistent error response format

### State Management

- **React Context**: For global state (auth, theme)
- **Local Storage**: For session persistence
- **React Query**: For server state management and caching

### UI Layer

- **Component Hierarchy**: Presentational and container components
- **Form Handling**: Use react-hook-form with Zod validation
- **Responsive Design**: Mobile-first approach

## Detailed Implementation Instructions

### 1. Setting Up the Authentication System

1. Create API routes for authentication:




-------------------------------------------------------



I notice that the development-guide.md file appears to be truncated in the view you're seeing. Let me create a complete version of the file to ensure all the content is properly included.

```markdown:/Users/alexmercer/Desktop/Aified/advonex/development-guide.md
# Advonex Development Guide

## Core Principles

1. **Prisma Schema as Single Source of Truth**: Use Prisma-generated types throughout the application
2. **API-First Development**: All data operations go through API routes
3. **Lightweight State Management**: Use React Context and localStorage without external state libraries
4. **Separation of Concerns**: Clear boundaries between data, API, state, and UI layers

## Implementation Approaches

### Data Layer

- **Prisma Client**: Central database access point
- **Type Safety**: Leverage Prisma-generated types
- **Data Validation**: Validate all data at API boundaries using Zod

### API Layer

- **API Routes**: All database operations happen through Next.js API routes
- **Route Structure**: Organize by resource (users, lawyers, specializations)
- **Error Handling**: Consistent error response format

### State Management

- **React Context**: For global state (auth, theme)
- **Local Storage**: For session persistence
- **React Query**: For server state management and caching

### UI Layer

- **Component Hierarchy**: Presentational and container components
- **Form Handling**: Use react-hook-form with Zod validation
- **Responsive Design**: Mobile-first approach

## Detailed Implementation Instructions

### 1. Setting Up the Authentication System

1. Create API routes for authentication:
   ```
   /api/auth/register
   /api/auth/login
   /api/auth/logout
   ```

2. Create an AuthContext:
   ```typescript
   // src/context/auth-context.tsx
   import { createContext, useContext, useState, useEffect } from 'react'
   import { User } from '@prisma/client'
   
   type AuthContextType = {
     user: User | null
     login: (email: string, password: string) => Promise<void>
     logout: () => void
     isLoading: boolean
   }
   
   // Implementation details...
   ```

3. Implement localStorage persistence:
   ```typescript
   // On login success
   localStorage.setItem('user', JSON.stringify(userData))
   
   // On initial load
   useEffect(() => {
     const storedUser = localStorage.getItem('user')
     if (storedUser) {
       setUser(JSON.parse(storedUser))
     }
     setIsLoading(false)
   }, [])
   ```

### 2. Connecting UI to Database

1. Create API handlers for lawyer profiles:
   ```
   /api/lawyers - GET (list), POST (create)
   /api/lawyers/[id] - GET (detail), PUT (update), DELETE
   ```

2. Replace mock data with API calls:
   ```typescript
   // Before: const lawyers = mockLawyers
   // After:
   const [lawyers, setLawyers] = useState<LawyerWithSpecializations[]>([])
   
   useEffect(() => {
     async function fetchLawyers() {
       const response = await fetch('/api/lawyers')
       const data = await response.json()
       setLawyers(data)
     }
     fetchLawyers()
   }, [])
   ```

### 3. Implementing Lawyer Dashboard

1. Create protected route wrapper:
   ```typescript
   // src/components/protected-route.tsx
   import { useAuth } from '@/context/auth-context'
   import { useRouter } from 'next/router'
   
   export function ProtectedRoute({ children, role }) {
     const { user, isLoading } = useAuth()
     const router = useRouter()
     
     // Implementation details...
   }
   ```

2. Create lawyer dashboard page with API integration:
   ```
   /src/app/lawyer/dashboard/page.tsx
   ```

## Rules to Follow

### 1. Type Safety Rules

- **DO** use Prisma-generated types for all database entities
  ```typescript
  import { User, LawyerProfile, Specialization } from '@prisma/client'
  ```

- **DO** use Prisma's utility types for complex queries
  ```typescript
  import { Prisma } from '@prisma/client'
  
  type LawyerWithSpecializations = Prisma.LawyerProfileGetPayload<{
    include: { specializations: true }
  }>
  ```

- **DON'T** create duplicate interfaces that mirror Prisma models
  ```typescript
  // AVOID THIS:
  interface Lawyer {
    id: string
    name: string
    // ...duplicating Prisma model
  }
  ```

- **DO** create interfaces only for UI-specific needs
  ```typescript
  // GOOD:
  interface LawyerCardProps {
    lawyer: Pick<LawyerProfile, 'id' | 'name'> & {
      specializations: Array<Pick<Specialization, 'id' | 'name'>>
    }
  }
  ```

### 2. API Access Rules

- **DO** centralize API calls in dedicated service files
  ```typescript
  // src/services/lawyer-service.ts
  export async function getLawyers() {
    const response = await fetch('/api/lawyers')
    if (!response.ok) throw new Error('Failed to fetch lawyers')
    return response.json()
  }
  ```

- **DON'T** access the database directly from components

- **DO** handle API errors consistently
  ```typescript
  try {
    const data = await getLawyers()
    // Handle success
  } catch (error) {
    // Handle error
  }
  ```

### 3. State Management Rules

- **DO** use React Context for global state
- **DON'T** use Redux, MobX, or other external state libraries
- **DO** use localStorage for persistence
- **DO** use React Query for server state and caching when appropriate

### 4. Component Rules

- **DO** split components by responsibility
- **DO** use composition over inheritance
- **DO** keep components focused on a single responsibility
- **DON'T** mix data fetching and presentation in the same component

### 5. Form Handling Rules

- **DO** use react-hook-form for form state management
- **DO** use Zod for validation
- **DO** reuse validation schemas between frontend and API routes

## Implementation Checklist

- [ ] Set up AuthContext with localStorage persistence
- [ ] Create login/register API routes
- [ ] Update UI to reflect authentication state
- [ ] Replace mock data with API calls
- [ ] Implement lawyer dashboard
- [ ] Add protected routes
- [ ] Connect registration form to database

## Authentication Implementation

### Login Flow
1. User enters email and password on login page
2. Form validation occurs client-side
3. Credentials sent to `/api/auth/login` endpoint
4. Server validates credentials against database
5. On success, user data returned (excluding sensitive fields)
6. Client stores user data in localStorage and AuthContext
7. UI updates to show logged-in state
8. User redirected to appropriate dashboard

### Registration Flow
1. User selects account type and enters basic information
2. For lawyers, additional professional details collected
3. Data sent to `/api/auth/register` endpoint
4. Server validates data and creates user record
5. On success, user automatically logged in
6. UI updates to show logged-in state
7. User redirected to appropriate dashboard

### Session Persistence
1. On application load, check localStorage for user data
2. If found, populate AuthContext
3. For sensitive operations, verify session validity with server
4. Implement session timeout for security

## Database Integration

### API Structure
1. Create centralized database client:
   ```typescript
   // src/lib/prisma.ts
   import { PrismaClient } from '@prisma/client'

   const prisma = new PrismaClient()
   export default prisma
   ```

2. Implement API handlers with proper error handling:
   ```typescript
   // src/pages/api/lawyers/index.ts
   import type { NextApiRequest, NextApiResponse } from 'next'
   import prisma from '@/lib/prisma'

   export default async function handler(
     req: NextApiRequest,
     res: NextApiResponse
   ) {
     try {
       if (req.method === 'GET') {
         const lawyers = await prisma.lawyerProfile.findMany({
           include: { specializations: true }
         })
         return res.status(200).json(lawyers)
       }
       // Handle other methods...
     } catch (error) {
       return res.status(500).json({ error: 'Internal server error' })
     }
   }
   ```

### Data Validation
1. Create shared validation schemas:
   ```typescript
   // src/lib/validations/user.ts
   import { z } from 'zod'

   export const loginSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8)
   })

   export const registerSchema = z.object({
     name: z.string().min(2),
     email: z.string().email(),
     password: z.string().min(8),
     type: z.enum(['CLIENT', 'LAWYER'])
   })
   ```

2. Use schemas in both frontend and API routes
```

This complete development-guide.md file includes all the implementation approaches, detailed instructions, and rules to follow throughout the project. I've added additional sections on authentication implementation and database integration to provide more comprehensive guidance.