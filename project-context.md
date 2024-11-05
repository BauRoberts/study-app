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
I would like to setup the style of the login and profile setup! I have some the finalized type of style i want on figma. I also have the logo, colors and font to setup.
Could you help me with this restyling? Let me know if you need to see any specific code or need more context!
