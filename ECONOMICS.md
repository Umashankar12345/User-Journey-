# Unit Economics & Path to $1M ARR

## Lead Economics

### Cost Per Lead (CPL)

**Current Model** (Credex referral commission):
- No direct payment from users (free tool)
- Credex pays referral fee: **$50-200 per qualified lead** (estimated)
  - Qualified = >$500/month in savings
  - Conservative: $50
  - Optimistic: $200

**Cost Per Lead Generated**:
- Twitter DMing: $0 (time = marketing)
- Show HN: $0
- Content: $0
- Sum: **$0 direct, ~$20 labor/lead** (if $50/hr, 1 min per lead)

### Lead Capture Conversion

| Funnel Stage | Volume | Conversion Rate |
|-------------|--------|-----------------|
| Audits run | 100 | - |
| Complete audit | 100 | 100% |
| Capture email | 30 | 30% |
| High savings (>$500/mo) | 12 | 40% |
| Open Credex email | 10 | 83% |
| Click through | 5 | 50% |
| Credex trial | 2 | 40% |
| Credex customer | 1 | 50% |

**100 audits → 1 Credex customer** (1% conversion)

---

## Revenue Model

### Option A: Lead Referral Fees (Current)

**Per Lead**:
- Credex pays: $50-200 per qualified lead
- Assumption: $100 average (conservative)

**Per Credex Customer**:
- ~$15 leads needed per customer (based on 6-7% close rate)
- Revenue to us: 15 × $100 = $1,500 per customer

### Option B: Affiliate Commission (Future)

- Credex credits: 15-20% commission
- High-value customer saves $1k/month, buys $3k credits
- Commission: $450-600

### Option C: Free → Premium Tier (Future)

- Free: Current tool (unlimited audits)
- Pro: $10/month (team features, historical tracking)
- Enterprise: Custom
- Adoption: <5% initially, grow to 20%+ as feature-rich

**Estimated revenue mix (Year 1)**:
- 70% Lead referrals
- 20% Premium subscriptions
- 10% Affiliate commissions

---

## Unit Economics: Year 1 Forecast

### Acquisition

| Month | Audits | Email Capture Rate | High-Savings Leads | CAC |
|-------|--------|-------------------|-------------------|-----|
| Month 1 | 100 | 30% | 12 | $0 |
| Month 2 | 150 | 30% | 18 | $0 |
| Month 3 | 200 | 32% | 25 | $0 |
| Month 4 | 250 | 32% | 32 | $5 |
| Month 5 | 300 | 32% | 38 | $10 |
| Month 6 | 350 | 32% | 45 | $10 |
| Month 7-12 | 400/mo | 33% | 53/mo | $15 |

**Total Year 1 Audits**: 2,400
**Total Year 1 High-Savings Leads**: 350

### Revenue

**Scenario 1: Conservative ($50 per lead)**
- 350 leads × $50 = **$17,500 ARR**

**Scenario 2: Optimistic ($200 per lead)**
- 350 leads × $200 = **$70,000 ARR**

**Scenario 3: Blended + Premium Tier**
- 350 leads × $100 = $35,000
- 50 premium customers × $120/year = $6,000
- **$41,000 ARR**

---

## Path to $1M ARR

### Calculation

**Goal**: $1M ARR

**Assumptions**:
- Lead value: $100/lead (average)
- Needed: 10,000 leads/year = 833/month

### Growth Scenarios

#### Scenario A: Viral Adoption (Most Likely)

| Year | Monthly Users | Leads/Month | ARR | Path |
|------|---------------|-----------|-----|------|
| 1 | 200 | 60 | $72k | Organic + Show HN |
| 2 | 500 | 150 | $180k | Content + viral |
| 3 | 2,000 | 600 | $720k | Enterprise + partnerships |
| 4 | 5,000 | 1,500 | $1.8M | Market leader |

**Year 3 critical**: Need 600 leads/month (2M audits/year, 30% capture, 40% high-savings)

#### Scenario B: Paid Acquisition

| Year | Marketing $ | CAC | Leads | ARR |
|------|------------|-----|-------|-----|
| 1 | $0 | $0 | 350 | $35k |
| 2 | $50k | $20 | 2,500 | $250k |
| 3 | $150k | $18 | 8,333 | $833k |
| 4 | $250k | $20 | 12,500 | $1.25M |

**Year 3**: Break even at $833k (before marketing spend = $200k profit)

---

## Metrics Dashboard

### Month 1 Targets

| Metric | Target | Status |
|--------|--------|--------|
| Total Audits | 100 | — |
| Email Capture % | 30% | — |
| High-Savings Leads | 12 | — |
| CPL | $0 | — |
| ARR | $1.2k | — |

### Year 1 Targets

| Metric | Target |
|--------|--------|
| Total Audits | 2,400 |
| Total Leads | 350 |
| Average Lead Value | $100 |
| ARR (End of Year) | $42,000 |

### Year 3 Targets (Path to $1M)

| Metric | Target |
|--------|--------|
| Monthly Audits | 5,000+ |
| Monthly Leads | 400+ |
| ARR | $480k+ (on pace for $1M by Year 4) |

---

## Cost Structure

### Fixed Costs

| Item | Cost | Notes |
|------|------|-------|
| Vercel | $50/month | Hosting, scales easily |
| Supabase | $100/month | Database, includes usage buffer |
| Resend | $50/month | Email service |
| Anthropic | Variable (see below) | Claude API for summaries |
| Domain | $20/year | Credex.io |
| **Total** | **$220/month** | **$2,640/year** |

### Variable Costs

**Anthropic API (Claude)**:
- Cost per summary: ~$0.002 (200 tokens, $0.015/1K)
- 350 leads/year × $0.002 = $0.70
- Negligible

**Email (Resend)**:
- 350 emails/year in free tier (100/day limit)
- No overage charges

**Total Variable**: <$100/year

**Total Year 1 Cost**: ~$3,000

---

## Margin Analysis

### Unit Economics: Per Lead

| Item | Cost |
|------|------|
| Revenue (lead value) | $100 |
| Infra cost (allocated) | -$8 |
| Labor (marketing) | -$20 |
| **Profit per lead** | **$72** |

**Profit margin**: 72%

### Year 1 Economics

```
Revenue:            $35,000 (350 leads × $100)
- Fixed costs:      -$2,640
- Variable costs:   -$100
- Marketing labor:  -$7,000 (7 hours/week × 50 weeks)
_______________
Net profit:         $25,260

ROI: 800% on effort
```

---

## Sensitivity Analysis

### What if email capture drops to 20%?

- 100 audits/mo × 20% × 40% = 8 leads/month
- Year 1: 96 leads × $100 = $9,600 ARR
- Path to $1M: Extends to Year 5

**Mitigation**: Improve form UX, clearer value prop

### What if lead value is only $50?

- 350 leads × $50 = $17,500 ARR (Year 1)
- Path to $1M: Extends to Year 4-5
- **Action**: Negotiate higher referral fee with Credex

### What if we add $10/month premium tier?

- 50 premium customers (5% adoption) × $120 = $6,000
- Total: $35k (lead fees) + $6k (premium) = **$41k ARR**
- **Impact**: +$6,000/year, minimal effort

---

## Breakeven Analysis

**Fixed Costs**: $2,640/year ($220/month)
**Profit per Lead**: $72

**Leads needed to breakeven**: 2,640 / 72 = **37 leads**

**Month to breakeven**: Month 1 (12 leads) or Month 2 (50 leads cumulative)

**Conclusion**: Business is profitable by Month 2-3

---

## Fundraising Potential

**Current** (Bootstrap):
- $0 raised, $0 burn
- Profitable by Month 2
- Fundable once: $50k+ MRR or clear path

**Seed Round** (if pursuing):
- Valuation: $2-3M (based on $50k ARR × 40-60 multiple)
- Use: Sales/marketing ($30k), hiring ($20k), infrastructure ($10k)
- Growth: 5x revenue by Year 2 (Series A ready)

**Conclusion**: Profitable first, then optionally fundraise

---

## 5-Year Projection

| Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|--------|--------|--------|--------|--------|--------|
| Audits/month | 200 | 500 | 2,000 | 5,000 | 10,000 |
| Leads/month | 24 | 60 | 240 | 600 | 1,200 |
| ARR | $36k | $144k | $576k | $1.44M | $2.88M |
| Profit | $25k | $100k | $450k | $1.1M | $2.2M |

**Year 5**: $2.88M ARR, $2.2M profit (76% margin)

---

## Key Assumptions to Validate

1. ✅ Credex pays $50-200 per lead (need written confirmation)
2. ✅ 30% email capture rate (test current)
3. ✅ 40% of audits show >$500 savings (validate from Day 1 data)
4. ✅ 1% conversion to Credex customer (from show HN data)
5. ⏳ Viral potential (depends on product-market fit)

**Success factors**: Email capture >25%, lead value >$75, virality >3 coefficient
