# Vorex - AI-Powered English Learning Platform

Modern, production-ready Next.js frontend for Vorex, an AI-powered English learning platform with personalized lessons, real-time feedback, and comprehensive CEFR assessment.

## Features

### Core Learning Experience
- **CEFR Assessment**: Comprehensive placement test with 40-question evaluation across all proficiency levels
- **Personalized Learning Paths**: Adaptive lessons based on user's CEFR level and goals
- **AI Tutor**: Real-time English text feedback with categorized error corrections
- **Voice Tutor**: Speech recognition with pronunciation feedback (powered by OpenAI Whisper)
- **Interactive Scenarios**: Real-world conversation practice with contextual feedback
- **Practice Drills**: Monologue and journal writing exercises with AI evaluation

### User Experience
- **Authentication**: Secure Supabase auth with email/password and social logins
- **Session History**: Track learning progress and past tutoring sessions
- **Dashboard Analytics**: Visualize learning metrics and achievements
- **Profile Management**: Customize learning preferences and track CEFR progress
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Smooth animations with Framer Motion and Tailwind CSS

### SEO & Performance
- **Dynamic Sitemap**: Auto-generated XML sitemap for search engines
- **Open Graph**: Optimized social media sharing with dynamic OG images
- **Structured Data**: JSON-LD schema markup for rich search results
- **Meta Tags**: Comprehensive SEO optimization with keywords and descriptions
- **Performance**: Static page generation and optimized bundle sizes

## Tech Stack

### Framework & Language
- **Next.js 14.2.0** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **React 18** - UI library

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 12** - Animation library
- **Lucide React** - Icon library
- **Geist Font** - Modern typography
- **clsx + tailwind-merge** - Conditional class management

### Authentication & Backend
- **Supabase** - Auth, database, and real-time features
- **Custom API Client** - Type-safe fetch wrapper for backend integration

### Development
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code quality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see [backend repo](https://github.com/matuskalis/vorex-backend))
- Supabase project (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/matuskalis/vorex-frontend.git
cd vorex-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```bash
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase (for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Voice debug panel (development only)
NEXT_PUBLIC_DEBUG_VOICE=false
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm start

# Deploy to Vercel
vercel
```

## Project Structure

```
vorex-frontend/
├── app/
│   ├── assessment/           # CEFR placement test
│   ├── learn/                # Learning dashboard
│   ├── lessons/              # Structured lessons
│   ├── scenarios/            # Conversation scenarios
│   ├── drills/               # Practice exercises
│   ├── voice/                # Voice tutor (ASR + TTS)
│   ├── tutor/                # Text-based tutor
│   ├── review/               # SRS review system
│   ├── dashboard/            # Analytics dashboard
│   ├── profile/              # User settings
│   ├── components/           # Reusable components
│   │   ├── DailySession.tsx  # Landing page hero
│   │   ├── StructuredData.tsx# SEO schema markup
│   │   └── ...               # Other components
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Landing page
│   ├── sitemap.ts            # Dynamic sitemap
│   ├── opengraph-image.tsx   # OG image generation
│   └── globals.css           # Global styles
├── lib/
│   ├── api-client.ts         # Typed API client
│   ├── types.ts              # TypeScript interfaces
│   └── supabase.ts           # Supabase client
├── public/
│   └── robots.txt            # SEO crawling directives
├── .env.local                # Environment variables (gitignored)
└── package.json              # Dependencies
```

## Key Features Explained

### CEFR Assessment (`/assessment`)
- 40-question placement test
- Adaptive difficulty based on responses
- Comprehensive evaluation across A1-C2 levels
- Immediate results with detailed breakdown

### Learning Paths (`/learn`)
- Personalized lesson recommendations
- Progress tracking
- CEFR level progression
- Structured curriculum

### AI Tutor (`/tutor`)
- Submit English text for instant feedback
- Categorized error corrections (grammar, vocabulary, fluency, structure)
- Detailed explanations for each error
- Micro-task practice suggestions

### Voice Tutor (`/voice`)
- Real-time speech recognition (OpenAI Whisper)
- Pronunciation feedback
- AI-generated voice responses (TTS)
- Browser compatibility: Chrome, Safari, Edge

### Scenarios (`/scenarios`)
- Real-world conversation practice
- Context-aware feedback
- Role-play exercises
- Cultural and professional contexts

### Drills (`/drills`)
- Monologue practice
- Journal writing
- Topic-based exercises
- AI evaluation and feedback

## API Integration

### Backend Endpoints

The frontend integrates with the following backend API routes:

- `POST /api/auth/*` - Authentication (via Supabase)
- `POST /api/assessment/submit` - CEFR assessment
- `POST /api/tutor/text` - Text tutoring
- `POST /api/tutor/voice` - Voice tutoring (ASR + TTS)
- `GET /api/lessons` - Fetch lessons
- `POST /api/scenarios/submit` - Submit scenario responses
- `POST /api/drills/submit` - Submit drill responses
- `GET /api/users/{user_id}` - User profile
- `GET /api/sessions` - Session history

### Type Safety

All API responses are fully typed with TypeScript interfaces matching the backend's Pydantic models.

## SEO Implementation

### Meta Tags
- Comprehensive title and description
- Keywords optimized for English learning
- Author and publisher metadata
- Canonical URLs

### Open Graph
- Dynamic OG image generation (`/opengraph-image`)
- Twitter Card support
- Social media optimized titles and descriptions

### Structured Data
- JSON-LD schema for WebSite, Organization, WebApplication, Course
- Rich snippet support for better search visibility

### Sitemap & Robots
- Dynamic XML sitemap at `/sitemap.xml`
- Robots.txt with crawling directives
- Protected private routes from indexing

## Browser Support

### Desktop
- Chrome 90+
- Safari 14.1+
- Firefox 88+
- Edge 90+

### Mobile
- iOS Safari 14.1+
- Chrome Android 90+
- Samsung Internet 15+

### Voice Features
- Chrome/Edge: Full support
- Safari: Full support (iOS 14.1+)
- Firefox: Limited support (desktop only)

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Load JS**: ~87KB shared bundle
- **Static Pages**: Pre-rendered at build time
- **Code Splitting**: Automatic route-based splitting

## Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Alternative: Self-hosted

```bash
# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "vorex" -- start
pm2 save
pm2 startup
```

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for comprehensive deployment guide.

## Development Workflow

1. **Start Backend**: Ensure API is running on port 8000
2. **Start Frontend**: `npm run dev`
3. **Sign Up/Sign In**: Create account via Supabase
4. **Take Assessment**: Complete CEFR placement test
5. **Explore Features**: Try lessons, scenarios, drills, voice tutor
6. **Track Progress**: View dashboard and session history

## Contributing

This is a proprietary project. For issues or feature requests, please contact the maintainer.

## License

Proprietary - Vorex Platform

## Support

For deployment issues or technical questions, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

---

**Built with**
Next.js • TypeScript • Tailwind CSS • Supabase • OpenAI

**Live at**
[vorex.app](https://vorex.app)

**Last Updated**: November 29, 2025
