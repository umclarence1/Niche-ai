# Niche AI

[![Vite](https://img.shields.io/badge/build-vite-646CFF)](https://vitejs.dev/) [![React](https://img.shields.io/badge/react-18-61DAFB)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/typescript-5-3178C6)](https://www.typescriptlang.org/) [![TailwindCSS](https://img.shields.io/badge/tailwindcss-3-38B2AC)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/license-MIT-green.svg)](#license)

NICHE.AI is a React + TypeScript application that turns documents into actionable insights using configurable AI agents. It provides a clean, responsive UI and a scalable architecture for building agent-powered document workflows.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features
- Document chat and actions for context-aware interactions
- Configurable AI agents with a dashboard for setup
- Real-time task monitoring and workflow history
- OpenAI + Supabase integrations for intelligence and data/storage
- Centralized app context and lightweight hooks
- Scalable, modular architecture for rapid iteration

## Architecture
- UI: Modular components (dashboard, document chat, UI kit) using TailwindCSS and Radix primitives
- Services: AIAgentService, AgentService, and DocumentProcessor for multi-step orchestration and ingestion
- State: Global AppContext for configuration and UI state, plus custom hooks
- Integrations: OpenAI SDK for LLM calls, Supabase for data/storage
- Routing: Page-based routes (Agents, Documents, History, Settings, etc.)

## Getting Started

Prerequisites:
- Node.js >= 18
- A valid OpenAI API key

Clone and install:

```bash
npm install
```

Start the dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Environment Variables
Create a `.env` file at the project root (`niche-ai/.env`) with:

```
VITE_OPENAI_API_KEY=your_openai_api_key
```

> Note: Do not commit your real keys. The `.gitignore` excludes `.env`.

If you add Supabase, include the following (example):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run build:dev` — build in development mode
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Project Structure
```
src/
  components/
    Dashboard/
    DocumentChat/
    layout/
    ui/              # Shadcn-inspired UI primitives
  hooks/
  lib/               # openai, supabase clients, utilities
  pages/             # route-based pages (Agents, Documents, History, Settings)
  services/          # AgentService, AIAgentService, DocumentProcessor
  store/             # AppContext (global state)
  types/
  main.tsx, App.tsx
```

## Tech Stack
- React, TypeScript, Vite
- Tailwind CSS, Radix UI primitives, Shadcn-inspired components
- OpenAI API, Supabase (client-ready utilities)
- React Router, React Query, Zod, React Hook Form

## Screenshots
> Add screenshots or GIFs to showcase the dashboard, document chat, and workflow history.

## Roadmap
- [ ] Extend agent tooling and workflows
- [ ] Add file storage and vector search integration
- [ ] Role-based access and multi-tenant settings
- [ ] Export/share conversations and workflows
- [ ] E2E tests and CI/CD pipeline

## Contributing
Contributions are welcome. Please:
- Open an issue to discuss significant changes first
- Use a feature branch and submit a PR
- Follow existing code style (TypeScript, ESLint, Prettier if configured)

## License
MIT License. See `LICENSE` if present, or include one before distributing.
