# Vorex Deployment Checklist

## Required Environment Variables

### Frontend (Next.js)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Production: https://api.vorex.app

# Voice Tutor Debug (optional, dev only)
NEXT_PUBLIC_DEBUG_VOICE=false  # Set to "true" to enable tech debug panel
```

### Backend (FastAPI)

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Supabase Auth
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-settings

# OpenAI (for LLM, ASR, TTS)
OPENAI_API_KEY=sk-...

# Anthropic (optional, for LLM fallback)
ANTHROPIC_API_KEY=sk-ant-...

# LLM Configuration
SPEAKSHARP_ENABLE_LLM=true  # Enable LLM features
SPEAKSHARP_LLM_PROVIDER=openai  # or "anthropic"
SPEAKSHARP_LLM_MODEL=gpt-4o-mini  # or "claude-3-5-haiku-20241022"
SPEAKSHARP_LLM_TEMP=0.7
SPEAKSHARP_DEBUG=false  # Enable debug logging
SPEAKSHARP_LOG_API=false  # Log API calls

# Voice Features
SPEAKSHARP_ENABLE_ASR=true  # Enable Automatic Speech Recognition
SPEAKSHARP_ENABLE_TTS=true  # Enable Text-to-Speech
```

---

## Deployment Steps

### Backend Deployment (FastAPI)

#### Option 1: Docker (Recommended)

1. **Build Docker image**:
   ```bash
   cd vorex-backend
   docker build -t vorex-backend .
   ```

2. **Run with Docker Compose** (includes PostgreSQL):
   ```bash
   docker compose up -d
   ```

3. **Or run standalone**:
   ```bash
   docker run -p 8000:8000 \
     -e DATABASE_URL="postgresql://..." \
     -e OPENAI_API_KEY="sk-..." \
     -e SUPABASE_JWT_SECRET="..." \
     vorex-backend
   ```

#### Option 2: Uvicorn (Local/Production)

1. **Activate virtual environment**:
   ```bash
   cd vorex-backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**:
   ```bash
   export DATABASE_URL="postgresql://..."
   export OPENAI_API_KEY="sk-..."
   export SUPABASE_JWT_SECRET="..."
   # ... other env vars from above
   ```

4. **Run server**:
   ```bash
   # Development
   uvicorn app.api:app --reload --host 0.0.0.0 --port 8000

   # Production
   uvicorn app.api:app --host 0.0.0.0 --port 8000 --workers 4
   ```

#### Option 3: Deploy to Cloud Platform

**Fly.io**:
```bash
flyctl launch
flyctl secrets set DATABASE_URL="..." OPENAI_API_KEY="..." SUPABASE_JWT_SECRET="..."
flyctl deploy
```

**Railway**:
- Connect GitHub repo
- Set environment variables in dashboard
- Auto-deploy on push

**Render**:
- Create Web Service
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
- Add environment variables

---

### Frontend Deployment (Next.js)

#### Option 1: Vercel (Recommended)

1. **Connect GitHub repo to Vercel**

2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_BASE_URL` (your backend URL)

3. **Deploy**:
   ```bash
   # Or via CLI
   npm install -g vercel
   cd vorex-frontend
   vercel
   ```

#### Option 2: Build and Deploy Manually

1. **Install dependencies**:
   ```bash
   cd vorex-frontend
   npm install
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm run start
   ```

4. **Or use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "vorex-frontend" -- start
   pm2 save
   pm2 startup
   ```

---

## CORS Configuration

If frontend and backend are on different domains, configure CORS in backend:

**`vorex-backend/app/api.py`** (already configured):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production**: Replace `allow_origins=["*"]` with your frontend domain:
```python
allow_origins=["https://vorex.app", "https://www.vorex.app"],
```

---

## Voice Tutor Production Notes

### Browser Support

**Supported Browsers** (as of 2024):
- ✅ Chrome 49+ (desktop & mobile)
- ✅ Edge 79+
- ✅ Safari 14.1+ (desktop & mobile)
- ✅ Firefox 25+ (desktop)
- ⚠️ Firefox mobile (limited support)
- ❌ IE11 (not supported)

### Known Limitations

1. **MIME Type Compatibility**:
   - Chrome/Edge: `audio/webm` (Opus codec)
   - Safari: `audio/mp4` or `audio/webm` (depending on version)
   - The app automatically detects and uses the best supported format

2. **HTTPS Required**:
   - `getUserMedia()` requires HTTPS in production
   - Exception: `localhost` works over HTTP for development

3. **Microphone Permissions**:
   - Users must explicitly grant microphone access
   - Permission is browser-specific (not cross-browser)
   - Permission persists per domain

4. **Audio Format Support**:
   - Backend accepts: WebM, Ogg, MP4, WAV
   - OpenAI Whisper supports: MP3, MP4, MPEG, MPGA, M4A, WAV, WEBM
   - If backend returns 400 "Invalid file format", check:
     - Browser's MediaRecorder MIME type
     - File size (not empty)
     - Network issues during upload

### Debugging Voice Issues

1. **Check browser console for `[VoiceTutor]` logs**:
   - MIME type selected
   - File size (bytes and KB)
   - Status codes from API
   - Error messages

2. **Enable debug panel** (dev only):
   ```bash
   # In .env.local
   NEXT_PUBLIC_DEBUG_VOICE=true
   ```
   - Shows file size, MIME type, status code, transcript, errors
   - Accessible in the Voice tab when enabled

3. **Common errors**:
   - **"Microphone access denied"**: User didn't grant permission
   - **"Invalid audio format"**: Browser's MIME type not supported by backend
   - **"Server error"**: Check backend logs for OpenAI Whisper API issues
   - **"Network error"**: Check CORS, API connectivity
   - **Empty recording (0 bytes)**: User didn't speak or mic not working

4. **Backend logs**:
   ```bash
   # Check Whisper ASR errors
   grep "ASR" backend-logs.txt

   # Check TTS errors
   grep "TTS" backend-logs.txt
   ```

---

## Database Setup

### Local PostgreSQL

1. **Install PostgreSQL 16**:
   ```bash
   # macOS
   brew install postgresql@16
   brew services start postgresql@16

   # Ubuntu/Debian
   sudo apt-get install postgresql-16
   ```

2. **Create database**:
   ```bash
   createdb vorex_db
   ```

3. **Apply schema**:
   ```bash
   cd vorex-backend
   psql vorex_db < database/schema.sql
   ```

4. **Set DATABASE_URL**:
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/vorex_db"
   ```

### Supabase (Production)

1. **Create project** at https://supabase.com

2. **Run schema** in SQL Editor:
   - Copy contents of `vorex-backend/database/schema.sql`
   - Paste and execute in Supabase SQL Editor

3. **Get connection string**:
   - Project Settings → Database → Connection String
   - Use "Connection pooling" mode for production

4. **Set env vars**:
   ```bash
   DATABASE_URL="postgresql://..."
   SUPABASE_JWT_SECRET="..."  # From Project Settings → API
   ```

---

## Health Checks

### Backend Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","database":"connected","timestamp":"..."}
```

### API Endpoints
```bash
# Test text tutor
curl -X POST http://localhost:8000/api/tutor/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"text":"I go to school yesterday"}'

# Test voice endpoint (requires audio file)
curl -X POST http://localhost:8000/api/tutor/voice \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "audio_file=@test.webm"
```

---

## Pre-Launch Checklist

### Backend
- [ ] DATABASE_URL configured and database accessible
- [ ] SUPABASE_JWT_SECRET set correctly
- [ ] OPENAI_API_KEY valid and has credits
- [ ] Health endpoint returns 200
- [ ] CORS allows frontend domain
- [ ] SSL certificate configured (HTTPS)
- [ ] Error logging/monitoring set up

### Frontend
- [ ] NEXT_PUBLIC_API_BASE_URL points to production backend
- [ ] Supabase env vars configured
- [ ] Build completes without errors
- [ ] All tabs load without errors
- [ ] Voice tab works in Chrome & Safari
- [ ] Authentication flow works
- [ ] Hard refresh on any tab doesn't error

### SEO & Metadata
- [ ] Sitemap generates correctly at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] OG image renders at `/opengraph-image`
- [ ] Twitter Card preview works
- [ ] Structured data (JSON-LD) validates on Google Rich Results Test
- [ ] Meta title and description set correctly on all pages
- [ ] Google Search Console verification code updated
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Canonical URLs configured correctly
- [ ] No broken internal links

### Testing
- [ ] Sign up/sign in flow
- [ ] Complete a lesson
- [ ] Complete an SRS review
- [ ] Complete a scenario
- [ ] Submit a drill (monologue & journal)
- [ ] Record and process voice (Chrome & Safari)
- [ ] Play TTS audio response
- [ ] View dashboard analytics
- [ ] Update profile

### Performance
- [ ] Page load time < 3s
- [ ] Voice processing time < 10s
- [ ] No console errors in production

---

## Rollback Plan

If issues occur after deployment:

1. **Frontend**: Revert to previous Vercel deployment
   ```bash
   vercel rollback
   ```

2. **Backend**: Redeploy previous Docker image
   ```bash
   docker pull vorex-backend:previous-tag
   docker run ...
   ```

3. **Database**: Keep backups
   ```bash
   # Supabase has automatic backups
   # Or manual backup:
   pg_dump DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

---

## Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT secret matches Supabase |
| 500 on voice endpoint | Check OpenAI API key, credits |
| CORS errors | Update `allow_origins` in backend |
| Database connection failed | Check DATABASE_URL format |
| Voice not recording | Check HTTPS, browser support |
| Empty recording | Check microphone permissions |

### Logs

**Backend**:
```bash
# Docker
docker logs vorex-backend

# Uvicorn
# Logs print to stdout
```

**Frontend**:
```bash
# Vercel
vercel logs

# Local
npm run dev  # Logs to console
```

---

## Security Notes

- Never commit `.env` files to git
- Use environment variables for all secrets
- Rotate API keys regularly
- Use HTTPS in production
- Validate all user input
- Rate limit API endpoints
- Monitor for unusual activity

---

## Next Steps After Deployment

1. Set up monitoring (Sentry, LogRocket, etc.)
2. Configure analytics (optional)
3. Set up automated backups
4. Create staging environment
5. Set up CI/CD pipeline
6. Monitor costs (OpenAI, Supabase)
7. Collect user feedback
8. Plan next features based on usage

---

**Last Updated**: November 29, 2024
**Project**: Vorex - AI-Powered English Learning Platform
**Maintainer**: See README for contact info
