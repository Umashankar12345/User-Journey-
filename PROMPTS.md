# AI Prompts & Reasoning

This document documents all AI/LLM prompts used in the Credex audit tool.

## Summary Generation Prompt

**Model**: Claude Opus 4 (claude-opus-4-20250514)
**Max Tokens**: 200 (limits to ~100 words)
**Temperature**: Default (0.7)

### Current Prompt (v1)

```
Summarize this AI spend audit in a friendly, personalized 100-word paragraph.

Current spend: $${totalCurrentSpend}/month
Potential savings: $${totalSavings}/month

Findings:
${findingsText}

Write a compelling summary that:
1. Acknowledges their current spend
2. Highlights the top opportunity
3. Ends with a call to action
4. Is conversational and not salesy
```

### Example Output

```
Your analysis shows strong optimization opportunities. You're currently 
spending $1,040/month across Claude, Copilot, and ChatGPT, primarily 
for team coding work. Switching Copilot to Individual tier and downgrading 
Claude to Pro would save $400/month with zero loss in capability — your 
use cases don't require Max or Enterprise features. For ChatGPT, 
purchasing discounted API credits through Credex could cut your costs 
by another 20-30%. Total potential savings: $580/month ($6,960/year).
```

### Design Decisions

1. **Model Choice**: Claude Opus 4
   - Reason: Better reasoning + instruction-following than Haiku
   - Trade-off: Slightly higher latency (~500ms) but acceptable for async generation

2. **Max Tokens = 200**
   - Reason: Prevents rambling, keeps to ~100 words
   - Fallback: If API fails, uses templated summary

3. **Conversational Tone**
   - Instruction explicitly avoids "salesy" language
   - Reason: Builds trust with potential users

4. **Structure (3-step)**
   - Acknowledge current state → Present opportunity → CTA
   - Reason: Psychological: validation → confidence → action

### Fallback Template (No API)

Used if Anthropic API is down:

```
Your analysis shows strong optimization opportunities. Consider downgrades, 
switching to cheaper alternatives, or purchasing discounted credits through 
Credex to maximize your savings. Save $${totalSavings}/month — that's 
$${yearlySavings} per year.
```

---

## Audit Engine Prompts (Client-Side)

The audit engine uses **no LLM calls** — all logic is hand-written rule-based code.

Why? 
1. Deterministic (no variance in recommendations)
2. Fast (<10ms vs 500ms API call)
3. Cost: Free
4. Defensible: Finance person can read the code and verify logic

See [lib/auditEngine.ts](lib/auditEngine.ts) for full logic.

---

## Email Confirmation Prompt (Not LLM-based)

Sent via Resend after lead capture:

**Subject**: Your AI Spend Audit Results - Save ${totalSavings}/month

**Body**:
```html
<h1>Your AI Spend Audit Results</h1>
<p>Hi,</p>
<p>We analyzed your AI tool spending and found potential savings of 
<strong>$${totalSavings}/month</strong> 
(or $${totalSavings * 12}/year).</p>

[If savings > $500]
<p>With these significant savings, our team at Credex would love to discuss 
how we can help you capture them through discounted AI credits and 
optimized procurement.</p>

<p>Check your audit results and recommendations in our tool.</p>
<p>Best,<br/>The Credex Team</p>
```

---

## Iteration History

### v0 (Rejected - Too Salesy)
```
"Credex has identified $XXX in monthly savings for your organization. 
Our enterprise solutions can capture these gains immediately. 
Contact our team for a personalized consultation."
```

**Issue**: Felt pushy. Didn't acknowledge their work first.

### v1 (Current - Balanced)
```
"Your analysis shows strong opportunities. [State facts]. Credex can help."
```

**Improvement**: Validates user's analysis, then offers help.

---

## Future Prompt Enhancements

1. **Multi-language Support**
   - Add language parameter to prompt
   - Use Claude to translate (or native speakers for accuracy)

2. **Personalization by Use Case**
   - Include more context: "You're a ${role} at a ${companySize} company"
   - Tailor recommendations to role

3. **A/B Testing Framework**
   - Generate 2 prompt variants
   - Test which drives more lead captures
   - Example: "You could save" vs "You're leaving on the table"

4. **Dynamic Recommendations**
   - If savings > $1k/month: More urgent tone
   - If savings < $100/month: Congratulatory tone
   - If mixed tools: Highlight consolidation opportunity

---

## Prompt Engineering Decisions

### Why explicit instructions, not few-shot examples?

- Few-shot takes more tokens
- Explicit instructions faster to iterate
- More predictable output

### Why no "expert mode" or "think step-by-step"?

- Not needed for summaries (just synthesis)
- Adds latency, reduces word budget

### Why no dynamic system prompt?

- Supabase has no built-in prompt templating
- Server-side rendering handles all dynamic logic
- Simpler to debug

---

## Cost Accounting

| Prompt Type | Calls/Month | Tokens/Call | Cost/1K tokens | Monthly Cost |
|-------------|------------|-----------|-----------------|--------------|
| Summary Gen | 100 | 400 | $0.015 | $0.60 |
| (Future: Batch) | 1000 | 400 | $0.015 | $6.00 |

At 10K users: ~$60/month on summaries (negligible)

---

## Responsible AI Notes

1. **No user data shared** with Claude beyond the audit findings
2. **Summary never includes** email, company name, or identifying info
3. **Graceful degradation**: If API fails, no data is lost
4. **Audit logic is transparent**: All rules documented and traceable
5. **No undisclosed AI use**: This document discloses all LLM usage

---

## Debugging Failed Summaries

If a summary fails to generate:

1. Check API key in `.env.local`
2. Check Anthropic API status
3. Look at server logs for error
4. Fallback template is used (visible to user)
5. No lead data is lost

Example error flow:
```
POST /api/summary
→ Anthropic API timeout
→ Catch error in route
→ Return fallback summary
→ User sees generic summary (still valuable)
```
