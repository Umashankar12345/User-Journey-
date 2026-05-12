# Architecture & System Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Next.js Frontend (React/TypeScript)          │  │
│  │  - Input Form (SpendForm component)                   │  │
│  │  - Results Display (AuditResults component)           │  │
│  │  - Lead Capture Modal (LeadCaptureModal)              │  │
│  │  - localStorage persistence                           │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌──────────┐
    │ /audit  │      │ /leads  │      │ /summary │
    │ engine  │      │  API    │      │   API    │
    │(client) │      │(server) │      │(server)  │
    └────┬────┘      └────┬────┘      └────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌──────────────┐
    │ Supabase│      │ Resend  │      │ Anthropic    │
    │ Database│      │ Email   │      │ (Claude API) │
    └─────────┘      └─────────┘      └──────────────┘
```

## Data Flow

### 1. Audit Input Flow
```
User Input (Form)
    ↓
localStorage (persist state)
    ↓
performAudit() [client-side]
    ↓
Findings Array
    ↓
Display Results
```

### 2. Lead Capture Flow
```
User Email Submission
    ↓
POST /api/leads
    ↓
Supabase INSERT (leads table)
    ↓
Resend EMAIL (confirmation)
    ↓
Success Response to Client
```

### 3. Summary Generation Flow
```
POST /api/summary with findings
    ↓
Anthropic API (Claude)
    ↓
Generated ~100-word summary
    ↓
Client receives summary
    ↓
Fallback to template if error
```

## Technology Stack

| Layer        | Technology | Choice Rationale |
|-------------|-----------|-----------------|
| **Frontend** | Next.js 14 + React 18 | Server components + App Router for performance |
| **Language** | TypeScript | Type safety, better DX, catches errors early |
| **Styling** | Tailwind CSS | Rapid UI development, responsive by default |
| **State** | React hooks + localStorage | Simple form state, no backend required for persistence |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, JWT auth out of box |
| **Email** | Resend | Modern API, good deliverability, free tier |
| **AI API** | Anthropic (Claude) | Superior reasoning for audit logic |
| **Testing** | Vitest + @testing-library | Fast, modern, ESM-native |
| **CI/CD** | GitHub Actions | Native GitHub integration, free |
| **Deployment** | Vercel | Next.js native, serverless, automatic deploys |

## Core Components

### Frontend

**`SpendForm`** (`components/SpendForm.tsx`)
- Multi-tool input interface
- Validation before submission
- Displays running total spend

**`AuditResults`** (`components/AuditResults.tsx`)
- Displays findings table
- Hero metrics (monthly/annual savings)
- CTA for lead capture

**`LeadCaptureModal`** (`components/LeadCaptureModal.tsx`)
- Email collection form
- Honeypot for bot protection
- Optional company/role fields

### Backend

**Audit Engine** (`lib/auditEngine.ts`)
- Runs entirely client-side
- No API call required
- Returns findings in <10ms

**API Routes**

1. `POST /api/leads` - Capture leads, save to Supabase, send email
2. `POST /api/summary` - Generate AI summary (with graceful fallback)

### Database (Supabase)

**`audits` table**
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  inputs JSONB,
  findings JSONB,
  total_current_spend DECIMAL,
  total_potential_savings DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`leads` table**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  role TEXT,
  audit_id UUID REFERENCES audits(id),
  total_savings DECIMAL,
  high_savings_flag BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Rate Limiting

Currently implemented in-memory (upgradeable to Redis):

- **Limit**: Max 10 audits per IP per 24 hours
- **Location**: `app/api/leads/route.ts`
- **Fallback**: Returns 429 if exceeded

## Security Considerations

1. **No API Keys in Frontend**: All sensitive keys in `env.local`
2. **Honeypot Field**: Catches bot submissions automatically
3. **Email Validation**: Client + server side
4. **Rate Limiting**: Per IP per 24h
5. **Data Privacy**: No PII stored beyond email
6. **CORS**: Vercel default headers (secure)

## Scaling Plan

### Current (MVP)
- All audit logic client-side (no compute cost)
- Supabase free tier (500MB storage, 2GB bandwidth)
- Resend free tier (100 emails/day)

### Phase 2 (1K users/month)
- Add Stripe payment processing
- Real-time lead alerts via webhook
- Audit history dashboard

### Phase 3 (10K+ users/month)
- Move audit engine to edge functions for performance
- Implement real-time analytics
- Add multi-language support

## Performance Metrics

- **Form input**: <1ms (localStorage)
- **Audit generation**: <10ms (client-side algorithm)
- **API response**: <500ms (Supabase + Resend)
- **Page load**: <2s (Vercel Edge)
- **LCP**: <1.5s
- **FID**: <100ms
- **CLS**: <0.1

## Key Decisions

1. **Client-side audit logic** - Reason: Zero latency, no server cost, instant feedback
2. **Supabase over Firebase** - Reason: SQL for complex queries, real-time, cheaper
3. **Anthropic over OpenAI** - Reason: Better reasoning model, more cost-effective
4. **localStorage persistence** - Reason: No backend requirement, instant restore
5. **Rate limiting per IP** - Reason: Simple, prevents abuse, no database hit

## Future Improvements

- [ ] Public audit results pages (shareable links)
- [ ] Batch audit imports (CSV/JSON)
- [ ] Team sharing and collaboration
- [ ] Historical tracking (month-over-month savings)
- [ ] Slack integration
- [ ] API for third-party tools
