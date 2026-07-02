# Job Apply — Candidate Portal

A frontend-only React application for candidates to sign up, import resumes, build LinkedIn-style profiles, and showcase them with one of two blog themes.

## Features

- **Candidate Sign Up & Sign In** — Local authentication with persisted sessions
- **Resume Import & Auto-fill** — Upload a PDF resume, extract text with `pdfjs-dist`, then use **Groq AI** (free tier) to parse name, phone, skills, experience, education, and more into pre-filled form fields
- **LinkedIn-style Profile** — Edit personal info, summary, skills, experience, and education
- **Two Blog Themes**
  - **Classic Professional** — Clean white layout with navy accents
  - **Modern Gradient** — Dark theme with vibrant gradients
- **Theme Persistence** — Selected theme is saved per candidate and restored on every login

## Tech Stack

- React 19 + Vite
- React Router
- `pdfjs-dist` — lightweight PDF text extraction (runs in browser)
- Groq API — free LLM for structured resume parsing (`llama-3.1-8b-instant`)

## Getting Started

### 1. Install dependencies

```bash
cd job-apply-app
npm install
```

### 2. Configure Groq API key

Get a free API key from [Groq Console](https://console.groq.com/keys).

```bash
cp .env.example .env
```

Edit `.env` and set your key:

```
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage Flow

1. **Sign Up** as a new candidate at `/signup`
2. Go to **Edit Profile** from the dashboard
3. **Upload a PDF resume** and click **Parse & Pre-fill**
   - PDF text is extracted locally in the browser
   - Groq AI returns structured profile data
   - Form fields are automatically populated
4. Review, edit, and **Save Profile**
5. Choose a **blog theme** (Classic or Modern) and **Save Theme**
6. **Sign out** and **sign back in** — your saved theme and profile appear on the dashboard

## Resume Parser Details

| Step | What happens |
|------|--------------|
| Upload | User selects a PDF file |
| Download | Optional — re-download the uploaded resume |
| Extract | `pdfjs-dist` reads all pages and extracts plain text |
| Parse | Text is sent to Groq API with a structured JSON prompt |
| Pre-fill | Name, phone, email, headline, skills, experience, education are filled in the form |

> **Note:** Scanned/image-only PDFs may not extract text well. Use text-based PDF resumes for best results.

## Data Storage

This is a **frontend-only** demo. All data (users, profiles, themes) is stored in the browser's `localStorage`. Clearing browser data will remove accounts.

## Project Structure

```
job-apply-app/
├── src/
│   ├── components/       # ResumeUpload, ThemeSelector, ProtectedRoute
│   ├── context/          # AuthContext
│   ├── pages/            # Signup, Signin, Dashboard, ProfileEditor
│   ├── services/         # auth, storage, resumeParser, groqService
│   ├── themes/           # ClassicTheme, ModernTheme, ProfileBlog
│   └── constants/        # Default profile shape, theme IDs
├── .env.example
└── README.md
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GROQ_API_KEY` | Yes (for resume parsing) | Groq API key for LLM resume extraction |

## License

MIT
