# Sharp AI Max

Sharp AI Max is a web-based AI content studio for turning one idea into content for multiple channels from a single workspace.

The current application provides two core generation workflows:
- **Single Writer** — generate content for blog posts, LinkedIn, X, Instagram, Facebook, and email.
- **Content Stacker** — turn one idea into a coordinated set of blog, LinkedIn, X, Instagram, and email content.

It also includes a browser-based workspace for history, prompt templates, profile settings, usage counters, favorites, tagging, and light/dark themes.

> **Project status:** Active development. The repository contains a working prototype with client-side workspace persistence and a server-side Gemini generation API. Authentication, billing, and durable multi-user persistence are not yet implemented as production services.

## Live Demo

**Sharp AI Max:** https://sharp-ai-max.vercel.app

The live deployment may require the environment configuration supported by its hosting platform. Local development is the authoritative setup documented below.

## Features

### Content generation
- Single-channel AI content generation.
- Multi-channel content stacking from one idea.
- Structured JSON output for stacked content.
- Markdown blog generation.
- Channel-specific generation instructions.
- PDF export support through the client-side PDF utility.

### Workspace
- Dashboard with usage and recent activity.
- Generation history.
- Favorites and tags.
- Prompt library with built-in and user-created templates.
- Profile and plan UI.
- Light/dark theme preference.
- Browser-local persistence for workspace state.

### Technical
- React 19 + TypeScript.
- Vite frontend.
- Express server.
- Google Gemini through `@google/genai`.
- Tailwind CSS 4.
- Motion for UI animation.
- Lucide React icons.
- jsPDF for PDF generation.

## Architecture

~~~text
Browser
  │
  ├── React + TypeScript
  │     ├── Dashboard
  │     ├── Single Writer
  │     ├── Content Stacker
  │     ├── Prompt Library
  │     ├── History
  │     └── Profile
  │
  └── HTTP
        │
        ▼
Express server
  │
  ├── POST /api/generate
  │       └── Gemini
  │
  └── POST /api/stack
          └── Gemini
~~~

The frontend does not call Gemini directly. Generation requests are sent to the Express API, where the Gemini API key is read from the server environment.

## Repository Structure

~~~text
Sharp-ai-max/
├── src/
│   ├── components/
│   │   ├── AuthOverlay.tsx
│   │   ├── DashboardView.tsx
│   │   ├── HistoryView.tsx
│   │   ├── ProfileView.tsx
│   │   ├── PromptLibraryView.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SingleWriterView.tsx
│   │   ├── StackerView.tsx
│   │   └── TagGuideModal.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── utils/
│   │   └── pdfGenerator.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── server.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
├── tests/
│   └── validation.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
└── .gitignore
~~~

## Requirements
- Node.js 18 or newer.
- npm.
- A Google Gemini API key for content generation.

## Local Development

### 1. Clone the repository
~~~bash
git clone https://github.com/davidifeanyicelestine586-arch/Sharp-ai-max.git
cd Sharp-ai-max
~~~

### 2. Install dependencies
~~~bash
npm install
~~~

### 3. Configure the environment
Copy `.env.example` to `.env` and set:
~~~env
GEMINI_API_KEY=your_gemini_api_key
~~~
Never commit `.env` or any API key to Git.

### 4. Start the development server
~~~bash
npm run dev
~~~
The server listens on port **3000**.

## Production Build
~~~bash
npm run build
npm start
~~~
The production server serves the built frontend and API from the same Express process.

## Available Scripts
| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express + Vite development server |
| `npm run build` | Build the frontend and bundle the server |
| `npm start` | Start the production server from `dist/server.cjs` |
| `npm run lint` | Run TypeScript checking without emitting files |
| `npm run typecheck` | Run strict TypeScript checking |
| `npm test` | Run automated validation tests |
| `npm run clean` | Remove generated build output |

## Environment Variables
| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes for generation | Server-side Gemini API authentication |

No secret should be placed in frontend source code or committed to the repository.

## Current Limitations
The current implementation is an active product prototype rather than a completed multi-user SaaS backend.
- Authentication is represented by application state and browser-local storage; it is not a server-backed identity system.
- User profiles, history, and custom prompts are stored in browser local storage.
- Plan and credit controls are client-side state and should not be treated as secure billing enforcement.
- There is no durable server-side user database in the current repository.
- There is no payment provider integration in the current repository.
- Generation depends on a valid Gemini API key and network access to Gemini.
- Automated coverage currently focuses on request and model-output validation; broader component and end-to-end coverage is still planned.

These limitations are stated intentionally so the repository does not claim capabilities that are not implemented.

## Security Notes
- Keep `.env` out of version control.
- Keep API credentials server-side.
- Do not trust client-side credit, plan, or authentication state for production authorization.
- Validate every AI API request server-side, including body shape, allowed content types, and input size.
- Apply endpoint rate limits and a small concurrent-request cap to reduce API abuse and resource exhaustion.
- Validate structured model output before returning it to the browser.
- Use security response headers and a production Content Security Policy.
- Keep local workspace data schema-checked and clear workspace-specific data when the user signs out.
- Validate and authorize sensitive operations before introducing real accounts, billing, or persistent user data.
- Treat the client-side tier/credit display as UX state only; production usage enforcement must move server-side.

## Development Principles
- Document what is actually implemented.
- Keep planned functionality separate from completed functionality.
- Prefer product-specific decisions over generic AI-generated patterns.
- Refactor when there is evidence that a change improves correctness, security, accessibility, maintainability, or performance.
- Preserve working behavior unless a change is intentional and verified.
- Treat accessibility, responsive behavior, security, and error states as part of the product.

## Project Direction
1. Verify and harden the current generation workflows.
2. Separate authentication, user data, usage enforcement, and billing into explicit service boundaries.
3. Introduce durable persistence where required.
4. Expand automated tests to generation workflows, failure states, accessibility, and usage limits.
5. Strengthen distributed rate limiting and abuse controls when the app is deployed across multiple server instances.
6. Continue the UI/UX and AI-slop audit against the project's human-centered quality standard.

## Author
**David Ifeanyi**

Sharp AI Max is part of David's broader software-development work under the Ediccrew project ecosystem.

## License
The repository currently does not declare a project license. Do not assume that the source code is licensed for reuse until an explicit license is added.