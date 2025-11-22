# SpeakSharp Frontend

Production-quality Next.js frontend for the SpeakSharp AI English tutor.

## Features

- ✅ **User Creation**: Create user profiles with CEFR level and native language
- ✅ **Text Tutoring**: Submit English text for real-time AI feedback
- ✅ **Error Display**: Categorized error corrections (grammar, vocab, fluency, etc.)
- ✅ **Micro Tasks**: Practice suggestions from the tutor
- ✅ **Session History**: Track previous tutoring sessions
- ✅ **TypeScript**: Fully typed API client matching backend models
- ✅ **Tailwind CSS**: Clean, responsive UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Custom typed fetch wrapper
- **Backend**: SpeakSharp Core (FastAPI)

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000` (see [backend repo](https://github.com/matuskalis/speaksharp-core))

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local if backend is not at localhost:8000
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
speaksharp-frontend/
├── app/
│   ├── components/
│   │   ├── UserSetup.tsx      # User creation flow
│   │   ├── TutorInput.tsx     # Text input for tutor
│   │   └── TutorResponse.tsx  # Display errors and feedback
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main tutor page
│   └── globals.css            # Global styles
├── lib/
│   ├── api-client.ts          # Typed API client
│   └── types.ts               # TypeScript types matching backend
└── .env.local                 # Environment variables
```

## API Integration

### Backend Endpoints Used

- `POST /api/users` - Create user
- `GET /api/users/{user_id}` - Get user profile
- `POST /api/tutor/text` - Submit text for tutoring

### Type Safety

All API responses are fully typed based on the backend's Pydantic models:

```typescript
interface TutorTextResponse {
  message: string;
  errors: Array<{
    type: "grammar" | "vocab" | "fluency" | "structure" | "pronunciation_placeholder";
    user_sentence: string;
    corrected_sentence: string;
    explanation: string;
  }>;
  micro_task: string | null;
  session_id: string;
}
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

## Development Workflow

1. **Start Backend**: Ensure SpeakSharp Core API is running
2. **Start Frontend**: `npm run dev`
3. **Create User**: Click "Start Learning" on homepage
4. **Submit Text**: Enter English text to get feedback
5. **View Corrections**: See categorized errors and explanations

## Error Handling

- Network errors display user-friendly messages
- API errors show backend error details
- Loading states prevent double submissions
- Form validation ensures valid inputs

## Next Steps

See "Next 3 Technical Steps" section in main documentation.

## License

Proprietary - SpeakSharp Core
