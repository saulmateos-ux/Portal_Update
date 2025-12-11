# GAIN Enhanced Provider Portal - Dashboard Specification
**Version**: 1.0
**Date**: December 10, 2025
**Author**: Saul Mateos, CFO
**Status**: Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Dashboard Architecture](#dashboard-architecture)
3. [KPI Hierarchy & Definitions](#kpi-hierarchy--definitions)
4. [Dashboard Layout Specification](#dashboard-layout-specification)
5. [Component-Level Design](#component-level-design)
6. [User Journey & Drill-Down Paths](#user-journey--drill-down-paths)
7. [Implementation Plan](#implementation-plan)

---

## Executive Summary

### Purpose
Transform GAIN's provider portal from a retrospective reporting tool into a **predictive optimization engine** that enables healthcare providers to:
- Monitor portfolio health at-a-glance
- Identify performance trends and anomalies
- Predict future collections and settlement timing
- Take action on at-risk cases proactively

### Current Data State
Based on December 10, 2025 import:
- **Total Invoiced**: $5,227,987.30
- **Total Collected**: $2,144,651.27
- **Open AR**: $2,933,881.03
- **Collection Rate**: 41.02%
- **Active Records**: 15,722 cases

### Key Business Problems Addressed
| Problem | Dashboard Solution |
|---------|-------------------|
| Case duration increased 6x (2.9 → 17.5 months) | **Case Age Trending** with law firm segmentation and alerts for stalled cases |
| Time-to-payment increased 3.5x (4.5 → 15.9 months) | **Settled Pending AR tracker** with days-since-settlement metrics |
| Collection rate variance (42% to 91%) | **Law Firm Performance Rankings** with grade-based segmentation (A/B/C/D/E) |
| No DSO tracking | **DSO Calculation & Trending** as primary KPI with target benchmarks |
| No aging analysis | **6-Bucket Aging Analysis** (0-30, 31-60, 61-90, 91-180, 181-365, 365+) |
| No predictive capabilities | **AI-Powered Settlement Predictions** and collection forecasting |

---

## Dashboard Architecture

### 3-Tier Information Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      TIER 1: EXECUTIVE VIEW                      │
│                    (Primary Dashboard Page)                      │
│                                                                  │
│  • 6 Primary KPIs (Hero Metrics)                                │
│  • Portfolio Health Score                                        │
│  • Critical Alerts (top 3)                                       │
│  • Trend Sparklines (30/60/90 day)                              │
│                                                                  │
│  Target: <3 seconds to answer "How is my portfolio doing?"      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (drill-down)
┌─────────────────────────────────────────────────────────────────┐
│                    TIER 2: ANALYTICAL VIEWS                      │
│              (Dedicated Pages: Collections, Law Firms,           │
│                    Receivables, Tranches, Cases)                 │
│                                                                  │
│  • 8-12 Secondary KPIs per page                                 │
│  • Multi-dimensional charts (time, firm, status, stage)         │
│  • Comparative benchmarks (vs. portfolio avg, vs. target)       │
│  • Filtering & segmentation controls                            │
│                                                                  │
│  Target: <10 seconds to answer specific questions like          │
│           "Which law firm is underperforming?" or                │
│           "What's my aging distribution?"                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (drill-down)
┌─────────────────────────────────────────────────────────────────┐
│                     TIER 3: DETAIL VIEWS                         │
│                  (Case Detail, Data Tables,                      │
│                   Exports, AI Insights)                          │
│                                                                  │
│  • Transaction-level data tables                                │
│  • Full case histories with timeline                            │
│  • Raw data exports (CSV/Excel)                                 │
│  • AI-generated narrative insights                              │
│  • Action recommendations                                        │
│                                                                  │
│  Target: Complete transparency into any metric calculation       │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Structure

```
Main Navigation (Top Bar):
┌────────────────────────────────────────────────────────────────┐
│ [GAIN Logo] Dashboard | Receivables | Collections | Law Firms │
│             Cases | Tranches | Reports | [User Menu]           │
└────────────────────────────────────────────────────────────────┘

Dashboard (Landing Page):
├── Portfolio Health Score (Hero)
├── Primary KPIs (6 cards)
├── Critical Alerts (Top 3 actionable items)
├── Quick Insights (4 charts)
└── Recent Activity Feed

Receivables (PI-Specific Analytics):
├── Receivables Summary KPIs
├── Case Status Pipeline (Litigation Stages)
├── Settled Pending AR (Money Won, Not Paid)
├── At-Risk AR (Write-off Candidates)
├── Aging Analysis by Case Status
└── Top Open Balances Table

Collections (Cash Flow Analytics):
├── Collections Summary KPIs
├── Monthly Collection Trends (12-month)
├── Collection Velocity Distribution
├── Collections by Law Firm (Top 10)
├── Collections by Case Status
└── Collection Rate Trending

Law Firms (Relationship Management):
├── Law Firm Performance Summary
├── Performance Rankings Table (Grade A-E)
├── Case Pipeline by Firm (Litigation Stages)
├── Collection Rate Trends (Firm Comparison)
├── Risk Analysis (At-Risk AR by Firm)
└── Monthly Performance Trends

Cases (Transaction Detail):
├── Case Search & Filters
├── Case List Table (Paginated, Sortable)
└── Case Detail View (Drill-down)

Tranches (Capital Management):
├── Tranche Performance Summary
├── Waterfall Chart (Advanced → 1.1x → 1.5x → Paid Off)
├── Tranche Detail Table
└── Capital Deployment Timeline

Reports (Exports & AI Insights):
├── Scheduled Reports
├── Custom Report Builder
├── Data Exports (CSV/Excel)
└── AI Insights & Recommendations
```

---

## KPI Hierarchy & Definitions

### PRIMARY KPIs (Tier 1 - Executive Dashboard)

#### 1. Portfolio Health Score
**Definition**: Composite metric (0-100) combining collection rate, DSO, aging quality, and at-risk percentage.

**Calculation** (Database):
```sql
SELECT
  ROUND(
    (collection_rate_score * 0.40) +      -- 40% weight
    (dso_score * 0.30) +                  -- 30% weight
    (aging_score * 0.20) +                -- 20% weight
    (risk_score * 0.10),                  -- 10% weight
    1
  ) as portfolio_health_score
FROM (
  SELECT
    -- Collection Rate Score (0-100): 70%+ = 100, 40%- = 0
    LEAST(100, GREATEST(0, (collection_rate - 0.40) / 0.30 * 100)) as collection_rate_score,

    -- DSO Score (0-100): 60 days = 100, 120 days = 0
    LEAST(100, GREATEST(0, (120 - dso_days) / 60 * 100)) as dso_score,

    -- Aging Score (0-100): 80%+ current = 100, 50%- current = 0
    LEAST(100, GREATEST(0, (pct_current - 0.50) / 0.30 * 100)) as aging_score,

    -- Risk Score (0-100): 5%- at-risk = 100, 20%+ at-risk = 0
    LEAST(100, GREATEST(0, (0.20 - pct_at_risk) / 0.15 * 100)) as risk_score
  FROM portfolio_metrics
) scores;
```

**Display**:
- Large circular gauge (0-100)
- Color-coded segments:
  - 80-100: Green (Excellent)
  - 60-79: Blue (Good)
  - 40-59: Yellow (Fair)
  - 20-39: Orange (Poor)
  - 0-19: Red (Critical)
- Trend indicator (vs. previous period)

**Drill-Down**: Click to see score component breakdown

---

#### 2. Total Open AR
**Definition**: Sum of all outstanding invoice balances not yet collected or written off.

**Calculation** (Database):
```sql
SELECT SUM(open_balance) as total_open_ar
FROM provider_master_data
WHERE open_balance > 0;
```

**Display**:
- Large currency value ($2,933,881)
- Trend vs. last month (+5.2% / -$12K)
- Sparkline (90-day trend)

**Drill-Down**: Click to view aging breakdown

---

#### 3. Collection Rate
**Definition**: Percentage of invoiced amounts successfully collected (lifetime, weighted).

**Calculation** (Database):
```sql
SELECT
  ROUND(
    SUM(collected_amount) / NULLIF(SUM(invoice_amount), 0) * 100,
    2
  ) as collection_rate
FROM provider_master_data
WHERE collection_date IS NOT NULL;  -- Only include invoices with collections
```

**Display**:
- Large percentage (41.0%)
- Trend vs. last quarter (+2.3%)
- Target benchmark line (70% target)
- Color-coded:
  - 70%+: Green
  - 60-69%: Blue
  - 50-59%: Yellow
  - 40-49%: Orange
  - <40%: Red

**Drill-Down**: Click to view law firm comparison

---

#### 4. DSO (Days Sales Outstanding)
**Definition**: Average number of days to convert invoices to cash.

**Calculation** (Database):
```sql
SELECT
  ROUND(
    (SUM(open_balance) / NULLIF(SUM(invoice_amount), 0)) * 365,
    0
  ) as dso_days
FROM provider_master_data;
```

**Display**:
- Large day count (217 days)
- Trend vs. last month (-5 days)
- Industry benchmark (90 days target)
- Color-coded:
  - 0-60 days: Green
  - 61-90 days: Blue
  - 91-120 days: Yellow
  - 121-180 days: Orange
  - 181+ days: Red

**Drill-Down**: Click to view DSO trending chart

---

#### 5. At-Risk AR
**Definition**: Total open balance in high-risk categories (No Longer Represent, 18+ month pending, 36+ month old cases).

**Calculation** (Database):
```sql
SELECT
  SUM(open_balance) as at_risk_ar,
  COUNT(DISTINCT id) as at_risk_cases
FROM at_risk_ar_mv;
```

**Display**:
- Currency value with case count ($427K / 87 cases)
- Percentage of total AR (14.6%)
- Trend vs. last month (-$23K / -3 cases)
- Color-coded by risk level

**Drill-Down**: Click to view at-risk case detail table

---

#### 6. Settled Pending AR
**Definition**: Total open balance for cases already settled but awaiting disbursement.

**Calculation** (Database):
```sql
SELECT
  SUM(open_balance) as settled_pending_ar,
  COUNT(DISTINCT id) as settled_pending_cases,
  ROUND(AVG(CURRENT_DATE - settlement_date), 0) as avg_days_pending
FROM provider_master_data
WHERE case_status = 'Settled - Not Yet Disbursed'
  AND open_balance > 0;
```

**Display**:
- Currency value with case count ($186K / 23 cases)
- Average days since settlement (47 days)
- Trend vs. last month (+$12K / +2 cases)
- Alert if avg days > 60 (yellow) or > 90 (red)

**Drill-Down**: Click to view settled pending detail table

---

### SECONDARY KPIs (Tier 2 - Analytical Views)

#### Collections Page KPIs

**7. Monthly Collection Rate**
```sql
SELECT
  DATE_TRUNC('month', collection_date) as month,
  SUM(collected_amount) / NULLIF(SUM(invoice_amount), 0) * 100 as monthly_collection_rate
FROM provider_master_data
WHERE collection_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', collection_date)
ORDER BY month;
```

**8. Collection Velocity (Median Days to Collect)**
```sql
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY collection_date - invoice_date) as median_days_to_collect
FROM provider_master_data
WHERE collection_date IS NOT NULL;
```

**9. Total Collected (Last 12 Months)**
```sql
SELECT SUM(collected_amount) as total_collected_12m
FROM provider_master_data
WHERE collection_date >= CURRENT_DATE - INTERVAL '12 months';
```

**10. Active Collection Rate (Last 90 Days)**
```sql
SELECT
  SUM(collected_amount) / NULLIF(SUM(invoice_amount), 0) * 100 as collection_rate_90d
FROM provider_master_data
WHERE invoice_date >= CURRENT_DATE - INTERVAL '90 days';
```

---

#### Law Firms Page KPIs

**11. Top Performing Firm (by Collection Rate)**
```sql
SELECT
  law_firm_name,
  collection_rate,
  performance_grade
FROM law_firm_pi_performance_mv
ORDER BY collection_rate DESC
LIMIT 1;
```

**12. Firm Concentration Risk**
```sql
SELECT
  SUM(CASE WHEN firm_rank <= 3 THEN open_balance ELSE 0 END) / NULLIF(SUM(open_balance), 0) * 100 as top3_concentration_pct
FROM (
  SELECT
    law_firm_name,
    SUM(open_balance) as open_balance,
    RANK() OVER (ORDER BY SUM(open_balance) DESC) as firm_rank
  FROM provider_master_data
  GROUP BY law_firm_name
) ranked;
```

**13. Number of Underperforming Firms (Grade D/E)**
```sql
SELECT COUNT(*) as underperforming_firms
FROM law_firm_pi_performance_mv
WHERE performance_grade IN ('D', 'E');
```

---

#### Receivables Page KPIs

**14. Active Litigation AR**
```sql
SELECT SUM(active_litigation_ar) as active_litigation_ar
FROM receivables_by_case_status_mv;
```

**15. Aging Over 180 Days**
```sql
SELECT
  SUM(open_balance) as aging_180_plus,
  SUM(open_balance) / NULLIF((SELECT SUM(open_balance) FROM provider_master_data), 0) * 100 as pct_of_total
FROM provider_master_data
WHERE CURRENT_DATE - invoice_date > 180
  AND open_balance > 0;
```

**16. Monthly Invoice Ingestion (Last Month)**
```sql
SELECT
  SUM(invoice_amount) as invoiced_last_month,
  COUNT(DISTINCT id) as cases_last_month
FROM provider_master_data
WHERE invoice_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND invoice_date < DATE_TRUNC('month', CURRENT_DATE);
```

---

#### Tranches Page KPIs

**17. Total Capital Deployed**
```sql
SELECT SUM(amount_advanced) as total_capital_deployed
FROM tranche_performance_mv;
```

**18. Capital Utilization Rate**
```sql
SELECT
  SUM(amount_collected) / NULLIF(SUM(amount_advanced), 0) * 100 as capital_utilization_rate
FROM tranche_performance_mv;
```

**19. Tranches Fully Paid Off**
```sql
SELECT COUNT(*) as tranches_paid_off
FROM tranche_performance_mv
WHERE repayment_status = 'Fully Paid Off';
```

---

## Dashboard Layout Specification

### PRIMARY DASHBOARD (Landing Page)

**Layout Grid**: 12-column responsive grid

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAIN LOGO & HEADER                       │
│  Dashboard | Receivables | Collections | Law Firms | Cases      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PORTFOLIO HEALTH SCORE                      │
│                                                                  │
│                            ┌───────┐                            │
│                            │  78   │  Good                       │
│                            │ /100  │  ↑ +3 vs last month       │
│                            └───────┘                            │
│                                                                  │
│   Collection Rate: 65  DSO: 72  Aging: 85  Risk: 91            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│  TOTAL OPEN AR   │ COLLECTION RATE  │    DSO (DAYS)            │
│                  │                  │                          │
│  $2,933,881      │     41.0%        │     217 days             │
│  ↑ +5.2%         │  ↑ +2.3%        │  ↓ -5 days              │
│  [sparkline]     │  [sparkline]     │  [sparkline]             │
│                  │  Target: 70%     │  Target: 90 days         │
└──────────────────┴──────────────────┴──────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│  AT-RISK AR      │ SETTLED PENDING  │  ACTIVE LITIGATION       │
│                  │                  │                          │
│  $427K / 87      │  $186K / 23      │     $1,247K / 142        │
│  14.6% of AR     │  Avg: 47 days    │  Active cases            │
│  ↓ -$23K         │  ↑ +$12K         │  ↑ +12 cases            │
│  [View Details]  │  [View Details]  │  [View Details]          │
└──────────────────┴──────────────────┴──────────────────────────┘

┌────────────────────────────┬────────────────────────────────────┐
│  AGING DISTRIBUTION        │   COLLECTION TRENDS (12 MONTHS)   │
│                            │                                    │
│  [Horizontal stacked bar]  │   [Line + Bar combo chart]         │
│  0-30: 12%                 │   Invoiced vs Collected            │
│  31-60: 18%                │   Collection Rate %                │
│  61-90: 15%                │                                    │
│  91-180: 25%               │                                    │
│  181-365: 20%              │                                    │
│  365+: 10%                 │                                    │
└────────────────────────────┴────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────────────┐
│  LAW FIRM PERFORMANCE      │   CASE STATUS PIPELINE             │
│                            │                                    │
│  [Table: Top 5 firms]      │   [Horizontal bar chart]           │
│  Firm | Grade | Rate | AR  │   Still Treating: $XXX             │
│  ───────────────────────   │   Gathering Bills: $XXX            │
│  BD&J  | B | 62% | $247K   │   Demand Sent: $XXX                │
│  Silva | A | 78% | $121K   │   Pending: $XXX                    │
│  ...                       │   Negotiation: $XXX                │
│                            │   In Litigation: $XXX              │
│  [View All Firms]          │   Settled Pending: $XXX            │
└────────────────────────────┴────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              🤖 AI-POWERED INSIGHTS (Gemini 3 Pro)               │
│                                                                  │
│  📊 OBSERVATION                                                  │
│  Your collection rate improved 2.3% this quarter, driven by     │
│  Silva Injury Law (+8%) and Setareh Law (+5%). However, Law     │
│  Brothers and Drake Law show declining performance (-3%).       │
│                                                                  │
│  💡 RECOMMENDATION (High Confidence)                             │
│  12 cases have been pending for 24+ months, representing        │
│  $142K in at-risk AR. Prioritize follow-up with Law Brothers    │
│  (42% collection rate) to improve portfolio performance.        │
│  [View Cases] [Schedule Review]                                 │
│                                                                  │
│  🎯 PREDICTION (Based on XGBoost + Gemini 3 Analysis)           │
│  Expected collections next month: $127K (±$15K, 85% confidence) │
│  Key drivers: 23 settled pending cases + 8 likely settlements   │
│  [View Prediction Details]                                      │
│                                                                  │
│  Powered by Google Gemini 3 Pro • Last updated: 2 hours ago     │
│  [Regenerate Insights] [Helpful? 👍 👎]                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### RECEIVABLES PAGE (PI-Specific Analytics)

```
┌─────────────────────────────────────────────────────────────────┐
│               PERSONAL INJURY RECEIVABLES ANALYTICS              │
│  Time Period: [Last 12 Months ▼]  Law Firm: [All ▼]            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│ SETTLED PENDING  │ ACTIVE LITIGATION│    AT-RISK AR            │
│                  │                  │                          │
│  $186,450        │  $1,247,320      │     $427,100             │
│  23 cases        │  142 cases       │  87 cases                │
│  Avg 47 days     │  Avg 312 days    │  14.6% of total AR       │
│  [View Table]    │  [View Table]    │  [View Breakdown]        │
└──────────────────┴──────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              CASE STATUS PIPELINE (Open AR by Stage)             │
│                                                                  │
│  Still Treating        ████████████░░░░░░░░░░░░  $412K          │
│  Gathering Bills       ██████░░░░░░░░░░░░░░░░░░  $267K          │
│  Demand Sent           ████████░░░░░░░░░░░░░░░░  $318K          │
│  Pending               ████████████████░░░░░░░░  $623K          │
│  Negotiation           ██████████░░░░░░░░░░░░░░  $389K          │
│  In Litigation         ████████████████████░░░░  $858K          │
│  Settled Pending       ████░░░░░░░░░░░░░░░░░░░░  $186K          │
│  No Longer Represent   ██░░░░░░░░░░░░░░░░░░░░░░  $97K           │
│                                                                  │
│  [Click any bar to drill down to case list]                     │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────────────┐
│  AGING ANALYSIS BY STATUS  │   MONTHLY INVOICE INGESTION        │
│                            │                                    │
│  [Stacked area chart]      │   [Line chart with trend]          │
│  Each status = color       │   Last 12 months                   │
│  X-axis: Age buckets       │   $XXX avg per month               │
│  Y-axis: Open AR           │   XX cases avg per month           │
│                            │                                    │
└────────────────────────────┴────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              SETTLED PENDING CASES (Money Won, Not Paid)         │
│  Sort: [Days Since Settlement ▼]  Filter: [All Law Firms ▼]    │
│                                                                  │
│  Patient Name | Law Firm | Open Balance | Settled | Days Pend  │
│  ───────────────────────────────────────────────────────────────│
│  John Doe     | BD&J, PC | $12,450      | 8/15/25 | 87 days 🔴│
│  Jane Smith   | Silva    | $8,920       | 9/22/25 | 49 days 🟡│
│  ...          | ...      | ...          | ...     | ...        │
│                                                                  │
│  Showing 23 cases | Total: $186,450 | [Export CSV]             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   AT-RISK AR BREAKDOWN                           │
│                                                                  │
│  No Longer Represent       $97,120   (22.7%)  47 cases  [View] │
│  Pending 24+ Months        $142,680  (33.4%)  12 cases  [View] │
│  Pending 18+ Months        $89,450   (20.9%)  18 cases  [View] │
│  Case 36+ Months Old       $78,230   (18.3%)  8 cases   [View] │
│  Other Risk Indicators     $19,620   (4.6%)   2 cases   [View] │
│                            ────────  ──────   ───────           │
│  TOTAL AT-RISK AR          $427,100  (100%)   87 cases          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    TOP 20 OPEN BALANCES                          │
│  Sort: [Open Balance ▼]  Filter: [All Statuses ▼]              │
│                                                                  │
│  Patient | Law Firm | Status | Open AR | Age | Risk | [Action] │
│  ─────────────────────────────────────────────────────────────  │
│  [Table with 20 highest open balances]                          │
│                                                                  │
│  [View All Cases]                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### COLLECTIONS PAGE (Cash Flow Analytics)

```
┌─────────────────────────────────────────────────────────────────┐
│                    COLLECTIONS ANALYTICS                         │
│  Time Period: [Last 12 Months ▼]  Compare: [Prior Year ▼]      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│ TOTAL COLLECTED  │ COLLECTION RATE  │  MEDIAN DAYS TO COLLECT  │
│ (Last 12M)       │ (Last 12M)       │                          │
│                  │                  │                          │
│  $947,328        │     58.2%        │     127 days             │
│  ↑ +$127K (15%)  │  ↑ +3.8%        │  ↓ -12 days             │
│  vs Prior Year   │  vs Prior Year   │  vs Prior Year           │
└──────────────────┴──────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            MONTHLY COLLECTION TRENDS (Last 12 Months)            │
│                                                                  │
│  [Combo Chart: Bars = Collected, Line = Collection Rate %]      │
│                                                                  │
│  Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec    │
│  ███  ████ ███  ████ ███  ████ ███  ████ ███  ████ ███  ████   │
│  $78K $92K $71K $89K $73K $94K $77K $88K $79K $91K $81K $96K    │
│                                                                  │
│  Collection Rate: ──────────────────── (line overlay)           │
│  54%  58%  52%  61%  55%  62%  57%  60%  56%  63%  58%  64%     │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────────────┐
│  COLLECTION VELOCITY       │   COLLECTIONS WATERFALL            │
│  (Distribution of Days)    │   (Invoiced to Collected)          │
│                            │                                    │
│  [Histogram]               │   [Waterfall chart]                │
│  0-30 days: 15%            │   Invoiced: $1,247K                │
│  31-60: 22%                │   - Write-offs: -$89K              │
│  61-90: 18%                │   - Still Open: -$211K             │
│  91-120: 25%               │   = Collected: $947K               │
│  121-180: 12%              │                                    │
│  181+: 8%                  │   Collection Rate: 58.2%           │
└────────────────────────────┴────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│           COLLECTIONS BY LAW FIRM (Top 10, Last 12M)             │
│                                                                  │
│  Law Firm Name         │ Collected | Rate | Cases | Avg Days   │
│  ──────────────────────────────────────────────────────────────│
│  BD&J, PC              │ $187,450  | 62%  | 87    | 142 days   │
│  Silva Injury Law      │ $134,920  | 78%  | 54    | 98 days    │
│  Setareh Law APLC      │ $97,680   | 85%  | 41    | 87 days    │
│  Wilshire Law Firm     │ $89,230   | 73%  | 38    | 112 days   │
│  Valero Law Group      │ $78,450   | 71%  | 33    | 119 days   │
│  ...                   │ ...       | ...  | ...   | ...        │
│                                                                  │
│  [View All Law Firms]                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            COLLECTIONS BY CASE STATUS (Last 12M)                 │
│                                                                  │
│  [Stacked bar chart by month, colored by case status]           │
│                                                                  │
│  Settled cases typically collect faster (avg 47 days)           │
│  vs In Litigation cases (avg 217 days)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   COLLECTION RATE TRENDING                       │
│                                                                  │
│  [Line chart: Monthly collection rate with 6-month MA]          │
│                                                                  │
│  Target: 70% (red dotted line)                                  │
│  Current: 64% (last month)                                      │
│  Trend: ↑ +8% over 12 months (positive momentum)               │
└─────────────────────────────────────────────────────────────────┘
```

---

### LAW FIRMS PAGE (Relationship Management)

```
┌─────────────────────────────────────────────────────────────────┐
│                  LAW FIRM PERFORMANCE ANALYTICS                  │
│  Grade Filter: [All ▼]  Sort: [Collection Rate ▼]              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────────────┐
│ TOTAL LAW FIRMS  │ AVG COLLECT RATE │  FIRMS GRADE A/B         │
│                  │                  │                          │
│      13          │     58.7%        │     6 / 13 (46%)         │
│  Active firms    │  Portfolio avg   │  Top performers          │
│  [View All]      │  Target: 70%     │  [View Rankings]         │
└──────────────────┴──────────────────┴──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              LAW FIRM PERFORMANCE RANKINGS TABLE                 │
│  Sort: [Grade ▼]  Filter: [Active Cases Only ✓]                │
│                                                                  │
│ Firm Name | Grade | Collect Rate | Open AR | Cases | At-Risk  │
│ ─────────────────────────────────────────────────────────────  │
│ Setareh Law APLC       │ A | 85% ████████░░ | $90K  | 41 | 3%│
│ Silva Injury Law       │ A | 78% ███████░░░ | $121K | 54 | 5%│
│ Wilshire Law Firm      │ B | 73% ███████░░░ | $75K  | 38 | 8%│
│ Valero Law Group       │ B | 71% ███████░░░ | $68K  | 33 | 7%│
│ BD&J, PC               │ B | 62% ██████░░░░ | $247K | 87 |12%│
│ Other Firm 1           │ C | 54% █████░░░░░ | $42K  | 21 |18%│
│ Other Firm 2           │ C | 52% █████░░░░░ | $38K  | 19 |16%│
│ Drake Law Firm         │ D | 48% ████░░░░░░ | $56K  | 28 |27%│
│ Law Brothers           │ E | 42% ████░░░░░░ | $76K  | 34 |35%│
│ ...                                                             │
│                                                                  │
│ Showing 13 firms | [Export CSV] | [Schedule Performance Review] │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────────────┐
│  FIRM CASE PIPELINE        │   COLLECTION RATE TRENDS           │
│  (by Litigation Stage)     │   (Top 5 Firms, 12 Months)         │
│                            │                                    │
│  [Stacked horizontal bar]  │   [Multi-line chart]               │
│  Each firm = row           │   Each firm = line                 │
│  Colors = case status      │   X-axis: Months                   │
│                            │   Y-axis: Collection Rate %        │
│  BD&J, PC:                 │                                    │
│  ███████████████░░░░░░     │   Setareh: ─────── (85% avg)      │
│  Still Treating | Pending  │   Silva: ────── (78% avg)         │
│  Negotiation | Litigation  │   Wilshire: ───── (73% avg)       │
│  Settled Pending           │   BD&J: ──── (62% avg)            │
│                            │   Law Bros: ─── (42% avg)         │
└────────────────────────────┴────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   RISK ANALYSIS BY LAW FIRM                      │
│  Sort: [At-Risk % ▼]                                            │
│                                                                  │
│  Firm Name         │ At-Risk AR | % of Firm | Risk Grade       │
│  ──────────────────────────────────────────────────────────────│
│  Law Brothers      │ $26,650    | 35.1%      | 🔴 High Risk    │
│  Drake Law Firm    │ $15,120    | 27.0%      | 🟠 Med-High     │
│  Other Firm 1      │ $7,560     | 18.0%      | 🟡 Medium       │
│  BD&J, PC          │ $29,640    | 12.0%      | 🟡 Medium       │
│  Valero Law Group  │ $4,760     | 7.0%       | 🟢 Low          │
│  Silva Injury Law  │ $6,050     | 5.0%       | 🟢 Low          │
│  Setareh Law APLC  │ $2,700     | 3.0%       | 🟢 Low          │
│                                                                  │
│  [Schedule Review with High Risk Firms]                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              MONTHLY PERFORMANCE TRENDS BY FIRM                  │
│                                                                  │
│  [Heatmap: Firms (rows) x Months (columns)]                     │
│  Color = Collection Rate (Red = Low, Green = High)              │
│                                                                  │
│              Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec    │
│  Setareh     🟢  🟢  🟢  🟢  🟢  🟢  🟢  🟢  🟢  🟢  🟢  🟢    │
│  Silva       🟢  🟢  🟢  🔵  🟢  🔵  🟢  🟢  🔵  🟢  🟢  🟢    │
│  Wilshire    🔵  🔵  🟢  🔵  🔵  🔵  🔵  🔵  🟢  🔵  🔵  🔵    │
│  BD&J        🔵  🟡  🔵  🟡  🔵  🔵  🟡  🔵  🔵  🟡  🔵  🟡    │
│  Law Bros    🟠  🔴  🟠  🔴  🟠  🟠  🔴  🟠  🟠  🔴  🟠  🔴    │
│                                                                  │
│  Legend: 🟢 70%+ | 🔵 60-69% | 🟡 50-59% | 🟠 40-49% | 🔴 <40% │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  FIRM CONCENTRATION ANALYSIS                     │
│                                                                  │
│  Top 3 Firms: $459K (45.2% of total AR)  🟡 Moderate Risk      │
│  Top 5 Firms: $609K (59.9% of total AR)  🟡 Moderate Risk      │
│                                                                  │
│  [Pie chart showing concentration]                              │
│                                                                  │
│  💡 INSIGHT: BD&J, PC represents 24.3% of total AR. Consider   │
│     diversification strategy to reduce single-firm dependency.  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component-Level Design

### Visual Design Standards

#### Color Palette
```
PRIMARY BRAND COLORS:
- GAIN Teal: #1E8E8E (primary actions, headers)
- GAIN Teal Dark: #166D6D (hover states)
- GAIN Teal Light: #E6F4F4 (backgrounds, highlights)
- GAIN Gold: #C5A057 (secondary accents)

SEMANTIC COLORS:
- Success/Green: #10B981 (positive metrics, grade A)
- Info/Blue: #3B82F6 (neutral metrics, grade B)
- Warning/Yellow: #F59E0B (caution metrics, grade C)
- Danger/Orange: #F97316 (concerning metrics, grade D)
- Critical/Red: #EF4444 (critical metrics, grade E)

PERFORMANCE GRADES:
- Grade A (Excellent): #10B981 (Green)
- Grade B (Good): #3B82F6 (Blue)
- Grade C (Average): #6B7280 (Gray)
- Grade D (Below Average): #F59E0B (Yellow)
- Grade E (Poor): #EF4444 (Red)

NEUTRAL COLORS:
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB
- Background: #F9FAFB
- Card Background: #FFFFFF
```

#### Typography
```
FONT FAMILY: Inter (sans-serif)

HEADINGS:
- H1 (Page Title): 32px, 700 weight, #111827
- H2 (Section Title): 24px, 600 weight, #111827
- H3 (Card Title): 18px, 600 weight, #374151
- H4 (Subsection): 16px, 600 weight, #374151

BODY TEXT:
- Large Body: 16px, 400 weight, #111827
- Regular Body: 14px, 400 weight, #374151
- Small Body: 12px, 400 weight, #6B7280

KPI VALUES:
- Hero KPI: 48px, 700 weight, #111827
- Large KPI: 32px, 700 weight, #111827
- Medium KPI: 24px, 600 weight, #111827
- Small KPI: 18px, 600 weight, #374151
```

#### Spacing System
```
4px base unit (spacing-1)

- spacing-1: 4px
- spacing-2: 8px
- spacing-3: 12px
- spacing-4: 16px
- spacing-5: 20px
- spacing-6: 24px
- spacing-8: 32px
- spacing-10: 40px
- spacing-12: 48px
- spacing-16: 64px

Component Spacing:
- Card padding: spacing-6 (24px)
- Section margin: spacing-8 (32px)
- Grid gap: spacing-4 (16px)
- KPI card gap: spacing-6 (24px)
```

#### Border Radius
```
- Small: 4px (buttons, badges)
- Medium: 8px (cards, inputs)
- Large: 12px (modals, panels)
- Full: 9999px (circular elements)
```

---

### Component Library

#### 1. KPICard
**Purpose**: Display single metric with trend and sparkline

**Props**:
```typescript
interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'percentage' | 'number' | 'days';
  trend?: {
    value: number;
    period: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparkline?: Array<{ date: string; value: number }>;
  target?: number;
  status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  onClick?: () => void;
}
```

**Visual Design**:
```
┌─────────────────────────────┐
│ Title (Text Secondary)      │
│                             │
│ $2,933,881                  │
│ (Large KPI, colored by      │
│  status)                    │
│                             │
│ ↑ +5.2% vs last month      │
│ (Trend with icon)           │
│                             │
│ [Sparkline chart: ───╱──]  │
│                             │
│ Target: $3.5M              │
│ (if applicable)             │
└─────────────────────────────┘
```

**States**:
- Default: White background, teal border on hover
- Active: Teal light background
- Clickable: Cursor pointer, shadow on hover

---

#### 2. PortfolioHealthGauge
**Purpose**: Display composite health score 0-100 with color coding

**Props**:
```typescript
interface PortfolioHealthGaugeProps {
  score: number; // 0-100
  components: {
    collectionRate: number;
    dso: number;
    aging: number;
    risk: number;
  };
  trend?: {
    value: number;
    period: string;
  };
}
```

**Visual Design**:
```
        ┌────────────┐
        │     78     │
        │   ──────   │
        │    /100    │
        └────────────┘
         (Circular gauge
          colored by score)

    Good ↑ +3 vs last month

Components Breakdown:
Collection Rate: 65  ████████░░
DSO: 72             ███████░░░
Aging: 85           ████████░░
Risk: 91            █████████░
```

**Color Mapping**:
- 80-100: Green (Excellent)
- 60-79: Blue (Good)
- 40-59: Yellow (Fair)
- 20-39: Orange (Poor)
- 0-19: Red (Critical)

---

#### 3. AgingChart
**Purpose**: Horizontal stacked bar showing aging distribution

**Props**:
```typescript
interface AgingChartProps {
  data: Array<{
    bucket: '0-30' | '31-60' | '61-90' | '91-180' | '181-365' | '365+';
    amount: number;
    percentage: number;
    invoiceCount: number;
  }>;
  showLabels?: boolean;
  interactive?: boolean;
}
```

**Visual Design**:
```
┌──────────────────────────────────────────────────────┐
│ Aging Distribution                                   │
│                                                      │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│ 0-30  31-60  61-90  91-180  181-365  365+          │
│ 12%   18%    15%    25%     20%      10%            │
│ $352K $528K  $440K  $733K   $587K    $293K          │
└──────────────────────────────────────────────────────┘
```

**Colors**:
- 0-30: Green
- 31-60: Blue
- 61-90: Yellow
- 91-180: Orange
- 181-365: Red
- 365+: Dark Red

---

#### 4. LawFirmPerformanceTable
**Purpose**: Sortable, filterable table of law firm metrics

**Props**:
```typescript
interface LawFirmPerformanceTableProps {
  firms: Array<{
    id: string;
    name: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    collectionRate: number;
    openAR: number;
    caseCount: number;
    atRiskPercentage: number;
    avgDaysToCollect: number;
  }>;
  sortBy?: string;
  filterGrade?: string[];
  onFirmClick?: (firmId: string) => void;
}
```

**Visual Design**:
```
┌──────────────────────────────────────────────────────────────┐
│ Law Firm Performance Rankings                                │
│ Sort: [Collection Rate ▼]  Filter: [All Grades ▼]          │
├──────────────────────────────────────────────────────────────┤
│ Firm Name          │Grade│ Rate │ Open AR │Cases│At-Risk    │
├──────────────────────────────────────────────────────────────┤
│ Setareh Law APLC   │ A   │ 85%  │ $90K    │ 41  │ 3%   🟢  │
│ Silva Injury Law   │ A   │ 78%  │ $121K   │ 54  │ 5%   🟢  │
│ Wilshire Law Firm  │ B   │ 73%  │ $75K    │ 38  │ 8%   🟢  │
│ BD&J, PC           │ B   │ 62%  │ $247K   │ 87  │ 12%  🟡  │
│ Drake Law Firm     │ D   │ 48%  │ $56K    │ 28  │ 27%  🟠  │
│ Law Brothers       │ E   │ 42%  │ $76K    │ 34  │ 35%  🔴  │
└──────────────────────────────────────────────────────────────┘
│ Showing 13 firms | [Export CSV]                              │
└──────────────────────────────────────────────────────────────┘
```

**Features**:
- Column sorting (click header to sort)
- Grade badge with color coding
- Hover row highlighting
- Click row to drill down to firm detail
- Export to CSV button

---

#### 5. CollectionTrendChart
**Purpose**: Combo chart showing invoiced vs collected with rate overlay

**Props**:
```typescript
interface CollectionTrendChartProps {
  data: Array<{
    month: string;
    invoiced: number;
    collected: number;
    collectionRate: number;
  }>;
  showTarget?: boolean;
  targetRate?: number;
}
```

**Visual Design**:
```
┌──────────────────────────────────────────────────────┐
│ Monthly Collection Trends (Last 12 Months)           │
│                                                      │
│ $100K ┤                     ██                       │
│       │                  ██ ██                       │
│  $80K ┤             ██  ██  ██  ██                   │
│       │          ██ ██  ██  ██  ██ ██                │
│  $60K ┤       ██ ██ ██  ██  ██  ██ ██ ██             │
│       │    ██ ██ ██ ██  ██  ██  ██ ██ ██ ██          │
│  $40K ┤ ██ ██ ██ ██ ██  ██  ██  ██ ██ ██ ██ ██       │
│       └────────────────────────────────────────────  │
│         J  F  M  A  M  J  J  A  S  O  N  D           │
│                                                      │
│ ■ Invoiced  ■ Collected  ── Collection Rate %      │
│                           ── Target (70%)           │
└──────────────────────────────────────────────────────┘
```

**Legend**:
- Bars: Invoiced (light teal) vs Collected (dark teal)
- Line: Collection Rate % (gold)
- Dotted Line: Target (red, if applicable)

---

#### 6. CaseStatusPipeline
**Purpose**: Horizontal bar chart showing open AR by litigation stage

**Props**:
```typescript
interface CaseStatusPipelineProps {
  data: Array<{
    status: string;
    openAR: number;
    caseCount: number;
    percentage: number;
  }>;
  onStatusClick?: (status: string) => void;
}
```

**Visual Design**:
```
┌──────────────────────────────────────────────────────┐
│ Case Status Pipeline (Open AR by Stage)              │
│                                                      │
│ Still Treating      ████████████░░░░  $412K (41)    │
│ Gathering Bills     ██████░░░░░░░░░░  $267K (28)    │
│ Demand Sent         ████████░░░░░░░░  $318K (33)    │
│ Pending             ████████████████  $623K (64)    │
│ Negotiation         ██████████░░░░░░  $389K (40)    │
│ In Litigation       ████████████████  $858K (88)    │
│ Settled Pending     ████░░░░░░░░░░░░  $186K (23)    │
│ No Longer Rep       ██░░░░░░░░░░░░░░  $97K (12)     │
│                                                      │
│ [Click any bar to view cases in that status]        │
└──────────────────────────────────────────────────────┘
```

**Interaction**:
- Hover: Show tooltip with exact values
- Click: Navigate to filtered case list for that status

---

#### 7. AIInsightCard (Powered by Gemini 3)
**Purpose**: Display AI-generated narrative insights and recommendations

**Props**:
```typescript
interface AIInsightCardProps {
  insights: Array<{
    type: 'observation' | 'recommendation' | 'prediction';
    icon: string;
    title: string;
    description: string;
    confidence?: number;
  }>;
}
```

**Visual Design**:
```
┌──────────────────────────────────────────────────────┐
│ 🤖 AI-Powered Insights                               │
├──────────────────────────────────────────────────────┤
│ 📊 OBSERVATION                                       │
│ Your collection rate improved 2.3% this quarter.     │
│ This is driven primarily by Silva Injury Law (+8%)   │
│ and Setareh Law (+5%). However, 3 firms declined     │
│ significantly.                                       │
├──────────────────────────────────────────────────────┤
│ 💡 RECOMMENDATION (High Confidence)                  │
│ Schedule performance review with Law Brothers        │
│ (42% collection rate) and consider reallocating      │
│ case referrals to higher-performing firms.           │
│ [Schedule Review]                                    │
├──────────────────────────────────────────────────────┤
│ 🎯 PREDICTION (85% Confidence)                       │
│ Based on current pipeline, expect $127K in           │
│ collections next month (±$15K confidence interval).  │
│ [View Model Details]                                 │
└──────────────────────────────────────────────────────┘
```

---

## User Journey & Drill-Down Paths

### Journey 1: "How is my portfolio doing?"

```
START: User logs in
  ↓
DASHBOARD (Landing Page)
  • Portfolio Health Score: 78/100 (Good)
  • Open AR: $2.9M
  • Collection Rate: 41%
  • DSO: 217 days

  USER ACTION: Clicks "Collection Rate" KPI card
  ↓
COLLECTIONS PAGE
  • Collection Rate trending chart (12 months)
  • See that rate improved from 38% → 41% (+3%)
  • Identify Silva Law and Setareh Law as top performers

  USER ACTION: Clicks "Silva Injury Law" row
  ↓
LAW FIRM DETAIL PAGE (Silva)
  • Collection Rate: 78%
  • Open AR: $121K across 54 cases
  • Performance Grade: A
  • Average Days to Collect: 98 days
  • At-Risk %: 5% (low)

  INSIGHT GAINED: Silva is a top performer - consider referring more cases
```

**Total Time**: <30 seconds
**Clicks**: 2

---

### Journey 2: "Which cases are at risk?"

```
START: Dashboard

  USER SEES: AI Insights card mentions "12 cases pending 24+ months"
  ↓
  USER ACTION: Clicks "View Cases" button in AI insight
  ↓
RECEIVABLES PAGE (filtered to At-Risk AR)
  • At-Risk AR Breakdown:
    - No Longer Represent: $97K (47 cases)
    - Pending 24+ Months: $143K (12 cases) ← TARGET
    - Other categories

  USER ACTION: Clicks "Pending 24+ Months" row
  ↓
CASE LIST TABLE (filtered)
  • 12 cases displayed with details:
    - Patient name, law firm, open balance, age, status
  • Sort by: Open Balance (highest first)

  USER ACTION: Clicks on highest balance case
  ↓
CASE DETAIL PAGE
  • Full case history timeline
  • All invoices and collections
  • Current status: "Pending" for 27 months
  • Law Firm: Law Brothers
  • Open Balance: $18,450
  • Last Activity: 8 months ago

  ACTION RECOMMENDATION: Contact law firm for status update
```

**Total Time**: <45 seconds
**Clicks**: 3

---

### Journey 3: "How are my law firms performing?"

```
START: Dashboard

  USER SEES: Law Firm Performance preview table (top 5)
  ↓
  USER ACTION: Clicks "View All Firms"
  ↓
LAW FIRMS PAGE
  • Performance Rankings Table (13 firms)
  • Sort by: Collection Rate (default)
  • Top performers: Setareh (A), Silva (A), Wilshire (B)
  • Bottom performers: Drake (D), Law Brothers (E)

  USER ACTION: Filters to Grade "E" firms
  ↓
TABLE FILTERED
  • Law Brothers only firm with Grade E
  • Collection Rate: 42%
  • At-Risk AR: 35% of firm's portfolio
  • Open AR: $76K across 34 cases

  USER ACTION: Clicks "Law Brothers" row
  ↓
LAW FIRM DETAIL PAGE
  • Detailed metrics
  • Case pipeline breakdown
  • Collection rate trending (declining)
  • Risk analysis
  • Case list table

  INSIGHT: Law Brothers has:
    - Declining performance (was 52%, now 42%)
    - High at-risk percentage (35%)
    - Longest average days to collect (187 days)

  RECOMMENDED ACTION: Schedule performance review meeting
```

**Total Time**: <60 seconds
**Clicks**: 3

---

### Journey 4: "What's my settled pending AR?"

```
START: Dashboard

  USER SEES: Settled Pending KPI Card
  • $186K / 23 cases
  • Avg 47 days since settlement
  ↓
  USER ACTION: Clicks "View Details"
  ↓
RECEIVABLES PAGE (Settled Pending section)
  • Settled Pending Cases Table
  • Sorted by: Days Since Settlement (longest first)
  • Top case: 87 days pending (red flag)

  USER ACTION: Clicks row with 87-day pending case
  ↓
CASE DETAIL PAGE
  • Patient: John Doe
  • Law Firm: BD&J, PC
  • Settled Date: 8/15/2025
  • Days Pending: 87 days
  • Open Balance: $12,450
  • Settlement Amount: $45,000 (full case value)

  TIMELINE SHOWS:
  • 8/15/25: Case settled
  • 8/18/25: Settlement agreement signed
  • [NO ACTIVITY FOR 87 DAYS]

  ACTION: Contact BD&J, PC to inquire about disbursement delay
```

**Total Time**: <40 seconds
**Clicks**: 2

---

### Journey 5: "Export data for custom analysis"

```
START: Collections Page

  USER ACTION: Clicks "Export CSV" button
  ↓
EXPORT MODAL
  • Select Data Range: [Last 12 Months ▼]
  • Include Fields: [All ✓]
  • File Format: [CSV ▼]
  • [Download]

  USER ACTION: Clicks "Download"
  ↓
FILE DOWNLOADED
  • collections_2024_12_10.csv
  • Contains all collection transactions with:
    - Date, Patient, Law Firm, Amount, Status, etc.

  USER ACTION: Opens in Excel, creates pivot table

RESULT: Custom analysis completed in external tool
```

**Total Time**: <20 seconds
**Clicks**: 2

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Functional dashboard with core KPIs

#### Week 1: Data Layer
- [x] Database schema (`provider_master_data`)
- [x] Core materialized views:
  - [x] `provider_kpi_summary_mv`
  - [x] `aging_analysis_mv`
  - [x] `receivables_by_case_status_mv`
  - [x] `law_firm_pi_performance_mv`
  - [x] `at_risk_ar_mv`
  - [x] `settled_pending_detail_mv`
- [x] API endpoints:
  - [x] `/api/kpi`
  - [x] `/api/aging`
  - [x] `/api/receivables/summary`
  - [x] `/api/receivables/at-risk`
  - [x] `/api/law-firms/performance`
- [ ] **Portfolio Health Score calculation** (NEW)
  - Add to `provider_kpi_summary_mv`
  - Component scoring logic
  - Trending calculation

#### Week 2: Dashboard UI
- [ ] **Dashboard page layout** (12-column grid)
- [ ] **Primary KPI cards** (6 cards):
  - [ ] Portfolio Health Score gauge
  - [ ] Total Open AR
  - [ ] Collection Rate
  - [ ] DSO
  - [ ] At-Risk AR
  - [ ] Settled Pending AR
- [ ] **Quick insights section**:
  - [ ] Aging distribution chart
  - [ ] Collection trends chart (12-month)
  - [ ] Law firm preview table
  - [ ] Case status pipeline
- [ ] **AI Insights placeholder** (Gemini 3 integration in Phase 4)
  - Static placeholder card
  - "AI Insights Coming Soon" message

**Deliverables**:
- Functional dashboard with real data
- 6 primary KPIs displaying correctly
- Basic drill-down navigation
- Clean layout ready for AI insights

**Success Criteria**:
- Dashboard loads in <3 seconds
- All KPIs match database calculations
- Trend indicators show correct direction
- No frontend calculations

---

### Phase 2: Analytical Views (Weeks 3-4)

**Goal**: Deep-dive pages for collections, law firms, receivables

#### Week 3: Collections & Law Firms Pages
- [ ] **Collections Page**:
  - [ ] Summary KPIs (3 cards)
  - [ ] Monthly trend chart (12-month combo chart)
  - [ ] Collection velocity distribution
  - [ ] Collections by law firm table
  - [ ] Collections by case status chart
  - [ ] Time period filtering
- [ ] **Law Firms Page**:
  - [ ] Performance rankings table (sortable, filterable)
  - [ ] Firm pipeline chart (stacked bars)
  - [ ] Collection rate trends (multi-line)
  - [ ] Risk analysis section
  - [ ] Monthly performance heatmap
  - [ ] Concentration analysis

#### Week 4: Receivables & Cases Pages
- [ ] **Receivables Page**:
  - [ ] PI-specific KPIs (3 cards)
  - [ ] Case status pipeline (horizontal bars)
  - [ ] Aging by status chart
  - [ ] Invoice ingestion trends
  - [ ] Settled pending table (sortable)
  - [ ] At-risk AR breakdown
  - [ ] Top 20 open balances table
- [ ] **Cases Page**:
  - [ ] Case list table (paginated, sortable, filterable)
  - [ ] Search functionality
  - [ ] Multi-column filtering
  - [ ] Export to CSV

**Deliverables**:
- 4 analytical pages fully functional
- All charts rendering with real data
- Filtering and sorting working
- Drill-down navigation from dashboard

**Success Criteria**:
- Page load <3 seconds
- Interactive filters respond instantly
- Charts update when filters change
- Export generates valid CSV files

---

### Phase 3: Detail Views & Actions (Weeks 5-6)

**Goal**: Transaction-level detail and user actions

#### Week 5: Case Detail & Drill-Downs
- [ ] **Case Detail Page**:
  - [ ] Case header (patient, law firm, status)
  - [ ] Financial summary
  - [ ] Timeline visualization
  - [ ] Invoice history table
  - [ ] Collection history table
  - [ ] Activity log
  - [ ] Risk indicators
  - [ ] Recommended actions
- [ ] **Law Firm Detail Page**:
  - [ ] Firm header and grade
  - [ ] Performance metrics
  - [ ] Case pipeline breakdown
  - [ ] Case list for this firm
  - [ ] Trending charts
  - [ ] Risk analysis

#### Week 6: Export & Reports
- [ ] **Export Functionality**:
  - [ ] Export modal component
  - [ ] CSV generation for all tables
  - [ ] Excel export with formatting
  - [ ] PDF reports (summary dashboards)
- [ ] **Reports Page**:
  - [ ] Scheduled report builder
  - [ ] Custom report designer
  - [ ] Report history
  - [ ] Email delivery setup

**Deliverables**:
- Full drill-down capability from summary to detail
- Case and law firm detail pages
- Export functionality for all data views
- Report scheduling system

**Success Criteria**:
- All drill-down paths work end-to-end
- Exports contain accurate, complete data
- Detail pages load in <2 seconds
- Reports can be scheduled and delivered

---

### Phase 4: AI & Predictions (Weeks 7-8)

**Goal**: Predictive analytics and AI insights powered by Google Gemini 3

#### Week 7: Data Science Models
- [ ] **Settlement Probability Model**:
  - Historical data preparation
  - Feature engineering (case age, status, law firm, amount)
  - XGBoost model training
  - Model validation (accuracy, precision, recall)
  - Prediction API endpoint
- [ ] **Collection Forecasting Model**:
  - Time series data preparation
  - ARIMA or Prophet model
  - 30/60/90 day forecasts
  - Confidence intervals
  - Forecast API endpoint
- [ ] **Time-to-Payment Prediction**:
  - Regression model
  - Feature importance analysis
  - Prediction by case status
  - API endpoint

#### Week 8: Gemini 3 AI Integration
- [ ] **Google Gemini 3 Setup**:
  - Vertex AI API configuration (or Google AI Studio)
  - Authentication setup (service account)
  - Gemini 3 Pro model selection (1M context window)
  - Rate limiting and cost monitoring
- [ ] **Prompt Engineering for Portfolio Insights**:
  - Context building (portfolio metrics, trends, benchmarks)
  - Multi-turn conversation design
  - Structured output formatting (JSON)
  - Few-shot examples for consistent insights
- [ ] **AI Insight Generation**:
  - Observation generation (trend analysis, anomaly detection)
  - Recommendation generation (actionable next steps)
  - Prediction explanations (model interpretation)
  - Confidence scoring
- [ ] **AI Insight Components**:
  - Insight card UI component
  - Loading states and streaming responses
  - Regenerate insights button
  - Feedback collection (helpful/not helpful)
- [ ] **Dashboard Integration**:
  - AI insights section on main dashboard
  - Contextual insights on analytical pages
  - Gemini 3 Deep Think mode for complex analysis (optional)
  - Caching strategy (daily insights, refresh on demand)

**Deliverables**:
- 3 trained ML models with >75% accuracy
- AI-generated insights on dashboard
- Predictive KPIs (expected collections next month)
- Recommendation engine

**Success Criteria**:
- Settlement prediction accuracy >75%
- Collection forecast within ±15% actual
- AI insights generated in <5 seconds
- Users report insights are "helpful" (survey)

---

### Phase 5: Polish & Optimization (Weeks 9-10)

**Goal**: Performance optimization, mobile responsiveness, user testing

#### Week 9: Performance & Responsiveness
- [ ] **Performance Optimization**:
  - Query optimization (indexes, explain analyze)
  - Materialized view refresh strategy
  - API response caching
  - Frontend code splitting
  - Image optimization
  - Lazy loading for charts
- [ ] **Mobile Responsiveness**:
  - Responsive grid layouts
  - Mobile navigation menu
  - Touch-friendly controls
  - Card stacking on mobile
  - Chart responsiveness
  - Table horizontal scrolling

#### Week 10: User Testing & Refinement
- [ ] **User Testing** (with Therapy Partners):
  - Task completion testing
  - Journey time measurement
  - Feedback collection
  - Usability scoring
- [ ] **Refinements**:
  - Bug fixes from testing
  - UI/UX improvements
  - Performance tuning
  - Documentation updates
- [ ] **Launch Preparation**:
  - Production database migration
  - Environment configuration
  - Monitoring setup (error tracking, analytics)
  - User training materials
  - Go-live checklist

**Deliverables**:
- Dashboard achieves <2s load time
- Mobile-responsive on all pages
- User testing report with >80% satisfaction
- Production-ready deployment

**Success Criteria**:
- All performance targets met (see below)
- Zero critical bugs
- Mobile usability score >80%
- Ready for production launch

---

## Performance Targets

| Metric | Target | Max Acceptable | Current Status |
|--------|--------|----------------|----------------|
| **Dashboard Initial Load** | <2 seconds | <5 seconds | TBD |
| **Page Navigation** | <1 second | <3 seconds | TBD |
| **Chart Rendering** | <1 second | <2 seconds | TBD |
| **Table Filtering** | <500ms | <1 second | TBD |
| **Data Export (1K rows)** | <3 seconds | <10 seconds | TBD |
| **API Response (p95)** | <2 seconds | <5 seconds | TBD |
| **Materialized View Refresh** | <30 seconds | <60 seconds | TBD |
| **Search Results** | <1 second | <3 seconds | TBD |

---

## Success Metrics

### Quantitative Metrics

| Metric | Baseline | 3-Month Target | 6-Month Target | Measurement |
|--------|----------|----------------|----------------|-------------|
| **Provider Portal Logins/Month** | TBD | +50% | +100% | Analytics |
| **Avg Session Duration** | TBD | +75% | +150% | Analytics |
| **Self-Service Resolution Rate** | 0% | 60% | 80% | Case manager inquiry volume |
| **Data Export Usage** | 0 | 20/month | 50/month | Analytics |
| **Provider NPS Score** | TBD | +10 points | +20 points | Quarterly survey |
| **Case Manager Inquiries** | Baseline | -20% | -40% | CRM tracking |
| **Dashboard Load Time** | TBD | <2s | <2s | Performance monitoring |

### Qualitative Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Data Accuracy** | 100% reconciliation | Monthly audit |
| **User Satisfaction** | >80% "satisfied" or "very satisfied" | Quarterly survey |
| **Feature Adoption** | >70% use AI insights within 3 months | Analytics |
| **Trust in Data** | >90% "trust portal data" | Survey |
| **Perceived Value** | >85% "portal is valuable" | Survey |

---

## Appendix: Design Assets

### Color Specifications

```css
/* Brand Colors */
--gain-teal: #1E8E8E;
--gain-teal-dark: #166D6D;
--gain-teal-light: #E6F4F4;
--gain-gold: #C5A057;
--gain-gold-dark: #A68847;
--gain-gold-light: #F7F2E6;

/* Semantic Colors */
--success: #10B981;
--info: #3B82F6;
--warning: #F59E0B;
--danger: #F97316;
--critical: #EF4444;

/* Performance Grades */
--grade-a: #10B981; /* Green */
--grade-b: #3B82F6; /* Blue */
--grade-c: #6B7280; /* Gray */
--grade-d: #F59E0B; /* Yellow */
--grade-e: #EF4444; /* Red */

/* Neutral Palette */
--neutral-50: #F9FAFB;
--neutral-100: #F3F4F6;
--neutral-200: #E5E7EB;
--neutral-300: #D1D5DB;
--neutral-400: #9CA3AF;
--neutral-500: #6B7280;
--neutral-600: #4B5563;
--neutral-700: #374151;
--neutral-800: #1F2937;
--neutral-900: #111827;
```

### Component Sizes

```css
/* KPI Cards */
--kpi-card-width: 320px;
--kpi-card-height: 180px;
--kpi-card-padding: 24px;
--kpi-card-border-radius: 8px;

/* Charts */
--chart-height-small: 200px;
--chart-height-medium: 300px;
--chart-height-large: 400px;

/* Tables */
--table-row-height: 48px;
--table-header-height: 56px;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-10 | Initial comprehensive dashboard specification | Saul Mateos |

---

**END OF DASHBOARD SPECIFICATION**
