# Study App Project Context

## Tech Stack

- Next.js 15.0.2
- TypeScript
- Prisma
- NextAuth
- Tailwind CSS
- Claude API integration

## Project Structure

```bash
/src
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── study-blocks/
│   │   └── tasks/
│   ├── dashboard/
│   └── study-blocks/
├── components/
│   ├── study-layouts/
│   └── modals/
└── lib/
```

Core Features

User Authentication: Email/password login, Session management with NextAuth.

Study Blocks: Creation with title, content, schedule. Test date setting. Daily study hours configuration;

AI-Generated Study Plans: Uses Claude API for task generation
Three types of tasks:Learn: Concept understanding
Practice: Exercises
Review: Flashcards & quizzes

Interactive Study Interface
Different layouts per task type
Progress tracking
Mastery system

Key Files
/prisma/schema.prisma: Database models
/src/app/api/study-blocks/route.ts: Main API endpoints
/src/components/study-layouts/: Study interface components

PROMPT
Hi Claude! I'm working on a study app built with Next.js, TypeScript, Prisma, and your API. The app helps users create study plans where:

Tech Stack:

- Next.js 15.0.2
- TypeScript
- Prisma
- NextAuth
- Tailwind CSS
- Claude API integration

## Project Structure

```bash
src
│   ├── app
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.ts
│   │   │   │   └── register
│   │   │   │       └── route.ts
│   │   │   ├── generate-tasks
│   │   │   │   └── route.ts
│   │   │   ├── study-blocks
│   │   │   │   ├── [id]
│   │   │   │   │   ├── generate-plan
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── tasks
│   │   │       └── [id]
│   │   │           ├── generate-summary
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── study-blocks
│   │       └── [id]
│   │           ├── StudyBlockClient.tsx
│   │           └── page.tsx
│   ├── components
│   │   ├── GenerateStudyPlanButton.tsx
│   │   ├── StudySummary.tsx
│   │   ├── modals
│   │   │   └── CreateStudyBlockModal.tsx
│   │   ├── study-layouts
│   │   │   ├── LearnLayout.tsx
│   │   │   ├── PracticeLayout.tsx
│   │   │   ├── ReviewLayout.tsx
│   │   │   └── StudyLayoutWrapper.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select
│   │       │   └── select.tsx
│   │       └── select.tsx
│   ├── lib
│   │   └── utils.ts
│   ├── types
│   │   └── next-auth.d.ts
│   ├── types.tsx
│   └── utils
│       └── fileParser.ts
├── tailwind.config.ts
└── tsconfig.json

The app's main features:
Core Features

User Authentication: Email/password login, Session management with NextAuth.

Study Blocks: Creation with title, content, schedule. Test date setting. Daily study hours configuration;

AI-Generated Study Plans: Uses Claude API for task generation
Three types of tasks:Learn: Concept understanding
Practice: Exercises
Review: Flashcards & quizzes

Interactive Study Interface
Different layouts per task type
Progress tracking
Mastery system

Key Files
/prisma/schema.prisma: Database models
/src/app/api/study-blocks/route.ts: Main API endpoints
/src/components/study-layouts/: Study interface components

What I need help with:
I would like to start restyling the learnLayout page! So here is the file for restyling. Also you may need other files in order to know how was our Style. In the other chat of this project you got that info.
```
