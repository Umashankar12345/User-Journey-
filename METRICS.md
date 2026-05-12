# Metrics & Instrumentation

Framework for measuring Credex Audit Tool success.

---

## North Star Metric

**High-Savings Leads Captured per Month** (target: 50+ by Month 6)

*Why*:
- Directly linked to Credex revenue (our business model)
- Requires both product adoption AND user value
- Leading indicator of market fit

**Calculation**: Audits with >$500/month savings who provide email

---

## Input Metrics (Leading Indicators)

### 1. Audit Volume
**Definition**: Total audits run per month  
**Target**: 100 (M1) → 500 (M6)  
**Why**: Measures awareness + trial rate  
**How to Measure**: Server logs + Supabase audits table

### 2. Email Capture Rate
**Definition**: % of users who provide email after audit  
**Target**: 30% → 35% (optimized over time)  
**Why**: Conversion funnel health  
**How to Measure**: leads_captured / audits_completed

### 3. High-Savings Percentage
**Definition**: % of audits showing >$500/month savings  
**Target**: 40% (industry estimate)  
**Why**: Determines qualified lead volume  
**How to Measure**: audits_high_savings / total_audits

### 4. Traffic Sources
**Definition**: Breakdown of where audits come from  
**Target**: 50% Twitter, 30% Show HN, 20% organic by M2  
**Why**: Validates GTM assumptions  
**How to Measure**: UTM parameters + referrer header

### 5. Session Duration
**Definition**: Average time on site (form → results → email capture)  
**Target**: 3-5 minutes  
**Why**: Should match "2 minutes to audit" claim  
**How to Measure**: Google Analytics / Vercel Analytics

---

## Output Metrics (Lagging Indicators)

### 1. Leads Generated
**Definition**: Email captures from high-savings audits  
**Target**: 12 (M1) → 50+ (M6)  
**Formula**: Audits × Email Capture % × High-Savings %  
**Example**: 100 audits × 30% × 40% = 12 leads

### 2. Lead Quality (Credex Conversion)
**Definition**: % of leads who respond to Credex follow-up  
**Target**: 20-30% (industry standard)  
**Why**: Validates if recommendations are trusted  
**How to Measure**: Credex tracks this; we get reports

### 3. Credex Customer Acquisition
**Definition**: Leads who become paying Credex customers  
**Target**: 1-2 per 100 audits (1-2% conversion)  
**Why**: Revenue driver  
**How to Measure**: Credex reports back to us

### 4. Revenue per Audit
**Definition**: (Leads × Lead Value) / Audits  
**Target**: $10-20 per audit (100 audits → $1-2k revenue)  
**Why**: Unit economics  
**Calculation**: (12 leads × $100 avg value) / 100 audits = $12/audit

---

## User Satisfaction Metrics

### 1. Email Open Rate
**Definition**: % of confirmation emails opened  
**Target**: 40%+ (transactional baseline)  
**Why**: Indicates if user found value  
**How to Measure**: Resend analytics

### 2. CTA Click Rate
**Definition**: % of emails with link clicks  
**Target**: 15%+  
**Why**: Intent to explore Credex  
**How to Measure**: Resend + UTM tracking

### 3. Audit Accuracy Rating (Survey)
**Definition**: "Was this audit accurate?" (5-point scale)  
**Target**: 4.5+ average  
**Why**: Validates core product quality  
**How to Measure**: Optional survey in email

### 4. NPS-style Question
**Definition**: "Would you recommend this to a founder?" (yes/no)  
**Target**: 80%+ yes  
**Why**: Viral coefficient  
**How to Measure**: Brief survey post-audit

---

## Technical Metrics

### 1. Page Load Time
**Target**: <2 seconds (LCP)  
**Why**: Bounce rate < 10%  
**How**: Vercel Analytics

### 2. Audit Generation Latency
**Target**: <100ms  
**Why**: Perceived instant (should feel snappy)  
**How**: Client-side measurement

### 3. API Response Time (email capture)
**Target**: <500ms (Supabase + Resend)  
**Why**: No perceivable lag  
**How**: Server logs

### 4. Error Rate
**Target**: <1%  
**Why**: Reliability  
**How**: Sentry or similar (future)

### 5. Lighthouse Scores
**Target**: Performance ≥85, Accessibility ≥90, Best Practices ≥90  
**Why**: Trust signal  
**How**: Monthly automated audit

---

## Business Metrics (Monthly Dashboard)

| Metric | M1 Target | M2 | M3 | M4 | M5 | M6 |
|--------|-----------|----|----|----|----|-----|
| **Audits** | 100 | 150 | 200 | 250 | 300 | 350 |
| **Email Capture %** | 30% | 30% | 31% | 31% | 32% | 33% |
| **High-Savings %** | 40% | 40% | 40% | 41% | 41% | 42% |
| **Leads** | 12 | 18 | 25 | 32 | 40 | 50 |
| **Credex Trials** | 2 | 4 | 5 | 7 | 8 | 10 |
| **Credex Customers** | 1 | 2 | 2 | 3 | 4 | 5 |
| **Revenue (@ $100/lead)** | $1,200 | $1,800 | $2,500 | $3,200 | $4,000 | $5,000 |
| **MRR** | $100 | $150 | $210 | $270 | $330 | $420 |

---

## Instrumentation & Implementation

### What to Measure (Client-Side)

```javascript
// Track every key interaction
window.gtag('event', 'audit_submitted', {
  tools_count: 3,
  total_spend: 1040,
  email_captured: true,
});

window.gtag('event', 'email_captured', {
  savings: 580,
  high_savings_flag: true,
});
```

### What to Measure (Server-Side)

```javascript
// In /api/leads
logger.info('lead_captured', {
  email: 'user@company.com',
  audit_id: 'abc123',
  total_savings: 580,
  high_savings_flag: true,
  ip: 'xxx.xxx.xxx.xxx',
  timestamp: now,
});

// In /api/summary
logger.info('summary_generated', {
  model: 'claude-opus-4',
  tokens_used: 187,
  latency_ms: 523,
});
```

### Dashboards

**Real-time (Google Analytics)**:
- Audits (last 24 hours)
- Top traffic sources
- Form abandonment

**Weekly (Supabase + custom script)**:
- High-savings leads
- Email open/click rates
- Revenue tracking

**Monthly (Spreadsheet)**:
- Full metrics table (see above)
- Month-over-month growth %
- Cohort analysis (users from X channel)

---

## Pivot Triggers

**If X metric misses target, consider pivot:**

| Metric | Trigger | Pivot Option |
|--------|---------|--------------|
| Email capture <20% | Reduce form friction | Make email optional, show shareable link instead |
| High-savings <25% | Audit logic too strict | Relax savings thresholds (e.g., <$500 still shown) |
| Leads generated <5 | No demand signal | Vertical focus (e.g., SaaS founders only) |
| MRR < $500 (M3) | Lead value too low | Negotiate higher Credex referral fees |
| Credex trials <2% | Recommendations not trusted | Improve reasoning transparency (add source links) |

---

## Success Criteria (Month 1 Launch)

All metrics must meet targets to declare "Month 1 success":

- ✅ 100 audits run
- ✅ 30%+ email capture
- ✅ 12+ high-savings leads
- ✅ 1+ Credex customer closed
- ✅ <2 second page load
- ✅ <1% error rate
- ✅ 4.5+ user satisfaction (survey)

---

## Long-term Success (Year 1)

| Metric | Target | Status |
|--------|--------|--------|
| Total Audits | 2,400 | Track monthly |
| Total Leads | 350 | = 29/month avg |
| Total Revenue | $35,000 | = $2,900/month avg |
| MRR by Dec | $5,000+ | Exponential growth |
| User Retention | 60% week 2 | Re-audit their tools |
| NPS | 50+ | Strong advocates |

---

## Measurement Roadmap

- **M1**: Manual tracking (spreadsheet + GA)
- **M2**: Automated dashboard (Vercel analytics + Supabase queries)
- **M3**: Add Sentry for error tracking
- **M4**: Email attribution (Credex integration)
- **M5**: Cohort analysis (segment by tool, savings, company size)
- **M6+**: Predictive modeling (forecast MRR based on conversion curves)
