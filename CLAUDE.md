# GAIN Enhanced Provider Portal - Project Constitution

**Project**: Enhanced Provider Portal for GAIN (Growth At Interest)
**Version**: 1.1
**Updated**: December 10, 2025
**Author**: Saul Mateos, CFO

---

## PROJECT OVERVIEW

Transform GAIN's current SaaS-based financial reporting dashboard into an intelligent, AI-enhanced analytics platform for healthcare providers managing personal injury receivables portfolios.

**Primary Client**: Therapy Partners
- $19M+ in partial advances deployed
- 716 active cases across 13+ law firms
- 17.91K open invoices requiring tracking

**Target State**: Shift from "reporting tool" to "optimization engine" with:
- Unified data architecture (single source of truth)
- Predictive analytics (AI-powered insights)
- Real-time KPIs and drill-downs
- Automated workflow recommendations

---

## CRITICAL RULES - NEVER BREAK THESE

### Rule #1: NO FRONTEND CALCULATIONS
**ALL math in PostgreSQL only!** Zero calculations in JavaScript/TypeScript.

```typescript
// WRONG - Never do this
const collectionRate = totalCollected / totalInvoiced * 100;
const dso = openBalance / avgDailyCollections;

// CORRECT - Fetch pre-calculated from database
const result = await query('SELECT collection_rate, dso FROM provider_kpi_summary_mv');
```

### Rule #2: DATABASE-FIRST ARCHITECTURE
- Single master table (`provider_master_data`) as source of truth
- Materialized views for pre-computed metrics
- API routes ONLY fetch and return data (no transformation)
- Frontend components ONLY display data (no calculations)

### Rule #3: USE SHARED CONNECTION POOL
```typescript
// WRONG - Creating pool in each file
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// CORRECT - Import from lib/db.ts
import { query } from '@/lib/db';
```

### Rule #4: STANDARDIZED FIELD NAMES
Always use these field names consistently:
- `invoice_amount` (not `total_invoice`, `invoiced`)
- `collected_amount` (not `total_collected`, `collections`)
- `open_balance` (not `ar_balance`, `outstanding`)
- `collection_rate` (not `collect_pct`, `rate`)
- `dso_days` (not `dso`, `days_outstanding`)

### Rule #5: COMPONENT SIZE LIMIT
Maximum 1,000 lines per component file. If larger, refactor into smaller components.

### Rule #6: NO SYNTHETIC/PLACEHOLDER DATA
Always use real data. Never create fake data or placeholders.

### Rule #7: INDEX ALL JOIN COLUMNS
Before deploying queries with JOINs, verify indexes exist:
```sql
-- Check before adding queries
EXPLAIN ANALYZE SELECT ... FROM table_a JOIN table_b ON column;
-- If Sequential Scan appears, add index
CREATE INDEX CONCURRENTLY idx_column ON table(column);
```

### Rule #8: REFRESH VIEWS AFTER DATA CHANGES
After any data import or update:
```javascript
await pool.query('SELECT refresh_all_materialized_views()');
```

### Rule #9: ALWAYS WRAP CLERK COMPONENTS IN SUSPENSE
```typescript
// WRONG
<UserButton />

// CORRECT
<Suspense fallback={<Loading />}>
  <UserButton />
</Suspense>
```

### Rule #10: TEST BUILDS BEFORE DEPLOYMENT
```bash
rm -rf .next && npm run build
```

### Rule #11: COLLECTION METRICS DATE FILTERS (CRITICAL!)
**Different metrics require different date field filters:**

| Metric/View | Filter By | Group By | Why |
|-------------|-----------|----------|-----|
| **Collection Rate KPI** | `invoice_date` | N/A | Measures % collected on invoices ISSUED in period |
| **Collection Trends Chart** | `collection_date` | `collection_date` | Shows CASH FLOW (when money came in) |
| **Law Firm Performance** | `invoice_date` | `law_firm` | Measures firm's portfolio performance |
| **Collection Velocity** | `collection_date` | `collection_date` | Measures speed of collections |

**NEVER use `AND collection_date IS NOT NULL` when calculating collection rate!**
This creates survivorship bias by excluding uncollected invoices.

```sql
-- WRONG: Inflates collection rate by excluding open invoices
WHERE collection_date IS NOT NULL  -- REMOVES UNCOLLECTED INVOICES!

-- CORRECT: Include ALL invoices to get true collection rate
WHERE invoice_date >= CURRENT_DATE - INTERVAL '12 months'
-- No filter on collection_date for rate calculation
```

**Key Definitions:**
- `invoice_date`: When the invoice was ISSUED (use for portfolio performance metrics)
- `collection_date`: When payment was RECEIVED (use for cash flow metrics)
- `Collection Rate`: collected_amount / invoice_amount for ALL invoices (not just collected ones)
- `Cash Flow`: Amount collected in a time period (filter AND group by collection_date)

See `/docs/DEFINITIONS.md` for complete metric definitions and data dictionary.

### Rule #12: DATA SOURCES - SINGLE SOURCE OF TRUTH (CRITICAL!)

**⚠️ ALWAYS USE THESE FILES - NO EXCEPTIONS:**

**Primary Data Sources** (Located in `/Data/`):
1. **`TPG_Analysis_Jeff_Invoice.csv`** - Master invoice data
   - Source of truth for: invoice amounts, case metadata, invoice dates
   - Contains: Open Invoice, Settled, Write Off, Total Invoice
   - 15,738+ records

2. **`TPG_Analysis_Jeff_Collections.csv`** - Collection transaction data
   - Source of truth for: collection dates, collected amounts
   - Contains: date_deposited_1__c (Year/Month/Day), Total Amount Collected
   - 5,698+ collection records
   - **CRITICAL**: This is the ONLY source for actual collection dates!

**Data Merge Strategy:**
```javascript
// Build collections lookup by fid (funding ID)
const collectionsMap = new Map();
// For each invoice, lookup collection data by fid
const collectionData = collectionsMap.get(fid);
// Merge: invoice amounts + collection dates + collected amounts
```

**Import Script**: `/provider-portal/scripts/import-from-analysis.js`

**DEPRECATED FILES** (DO NOT USE):
- ❌ `TPG_Invoice.csv` - Older format, incomplete data
- ❌ `TPG_Collections.csv` - Older format, different structure
- ❌ `Invoice_Amount_Collections.csv` - Intermediate file

---

## TECHNOLOGY STACK

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ (App Router) | React framework with server components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 2.x | Chart library |
| Tremor | 3.x | Dashboard UI components |
| Headless UI | 1.x | Accessible primitives |
| Lucide Icons | Latest | Icon library |
| React Query | 5.x | Server state management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 14+ | REST API endpoints |
| PostgreSQL | 15+ | Primary database (Neon serverless) |
| pg | 8.x | PostgreSQL client |
| Clerk | 5.x | Authentication |
| Zod | 3.x | Runtime validation |

### AI/ML
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | ML model development |
| scikit-learn | 1.x | Machine learning |
| XGBoost | 2.x | Gradient boosting |
| OpenAI API | GPT-4 | Natural language insights |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Vercel | Frontend hosting, CI/CD |
| Neon | Serverless PostgreSQL |
| GitHub | Version control |

---

## DATABASE ARCHITECTURE

### Master Data Table
Single source of truth - all metrics derive from `provider_master_data`:

```sql
provider_master_data (
  id, salesforce_id, funding_id,
  patient_name, opportunity_id, opportunity_name, date_of_accident,
  law_firm_id, law_firm_name, attorney_name,
  provider_id, provider_name, location_id, location_name, region, state,
  invoice_amount, collected_amount, write_off_amount, open_balance,
  invoice_date, origination_date, settlement_date, collection_date,
  funding_stage, case_status, payoff_status,
  tranche_id, tranche_name, ar_book_name, ar_type
)
```

### Required Materialized Views
| View | Purpose | Refresh |
|------|---------|---------|
| `provider_kpi_summary_mv` | Dashboard KPIs | 15 min |
| `aging_analysis_mv` | Aging buckets | 15 min |
| `law_firm_performance_mv` | Law firm metrics | Hourly |
| `case_status_distribution_mv` | Case status counts | Hourly |
| `tranche_performance_mv` | Partial advance tracking | Hourly |
| `monthly_trends_mv` | Time-series trends | Daily |

### Critical Indexes
```sql
CREATE INDEX idx_master_provider_id ON provider_master_data(provider_id);
CREATE INDEX idx_master_invoice_date ON provider_master_data(invoice_date);
CREATE INDEX idx_master_law_firm ON provider_master_data(law_firm_id);
CREATE INDEX idx_master_case_status ON provider_master_data(case_status);
CREATE INDEX idx_master_open_balance ON provider_master_data(open_balance) WHERE open_balance > 0;
```

---

## API DESIGN PATTERNS

### Standard API Route Template
```typescript
// app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch from materialized view (pre-calculated)
    const result = await query(`SELECT * FROM materialized_view_mv`);

    // 3. Return with metadata
    return NextResponse.json({
      data: result.rows,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'PostgreSQL_MaterializedView',
        calculationsInDatabase: true,
        apiPassthroughOnly: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/kpi` | GET | KPI summary |
| `/api/aging` | GET | Aging analysis |
| `/api/collections` | GET | Collection trends |
| `/api/cases` | GET | Case listing (paginated) |
| `/api/cases/[id]` | GET | Case detail |
| `/api/law-firms` | GET | Law firm performance |
| `/api/tranches` | GET | Tranche performance |
| `/api/predictions` | GET | AI predictions |
| `/api/insights` | GET | AI insights |
| `/api/export` | POST | Data export |
| `/api/health` | GET | Health check |

---

## FRONTEND PATTERNS

### Design Token System
```typescript
// lib/design-tokens.ts
export const COLORS = {
  brand: {
    teal: '#1E8E8E',       // GAIN primary
    tealDark: '#166D6D',
    tealLight: '#E6F4F4',
    gold: '#C5A057',       // GAIN secondary
    goldDark: '#A68847',
    goldLight: '#F7F2E6',
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  grades: {
    A: '#10B981',  // Excellent
    B: '#3B82F6',  // Good
    C: '#6B7280',  // Average
    D: '#F59E0B',  // Below Average
    E: '#EF4444',  // Poor
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    500: '#6B7280',
    700: '#374151',
    900: '#111827',
  },
};
```

### Component Pattern
```typescript
// Components must be display-only (no calculations)
interface KPICardProps {
  title: string;
  value: number;        // Pre-calculated from database
  trend: number;        // Pre-calculated from database
  format: 'currency' | 'percentage' | 'number' | 'days';
}

export function KPICard({ title, value, trend, format }: KPICardProps) {
  // ONLY format and display - never calculate
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-sm text-neutral-500">{title}</h3>
      <span className="text-2xl font-bold">{formatValue(value, format)}</span>
      <TrendIndicator value={trend} />
    </div>
  );
}
```

### Data Fetching Pattern
```typescript
// hooks/useKPI.ts
import { useQuery } from '@tanstack/react-query';

export function useKPI(providerId: string) {
  return useQuery({
    queryKey: ['kpi', providerId],
    queryFn: async () => {
      const res = await fetch(`/api/kpi?providerId=${providerId}`);
      return res.json();
    },
    staleTime: 60000, // 1 minute
  });
}
```

---

## DIRECTORY STRUCTURE

```
provider-portal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── collections/
│   │   ├── cases/
│   │   ├── law-firms/
│   │   ├── tranches/
│   │   └── reports/
│   ├── api/                      # API routes
│   │   ├── kpi/route.ts
│   │   ├── aging/route.ts
│   │   ├── collections/route.ts
│   │   ├── cases/route.ts
│   │   ├── law-firms/route.ts
│   │   ├── tranches/route.ts
│   │   ├── predictions/route.ts
│   │   ├── insights/route.ts
│   │   └── export/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/                   # React components
│   ├── charts/                   # Reusable charts
│   ├── dashboard/                # Dashboard components
│   ├── tables/                   # Data tables
│   ├── modals/                   # Modals
│   ├── layout/                   # Layout components
│   └── ui/                       # Base UI components
├── lib/                          # Shared libraries
│   ├── db.ts                     # Database pool (SINGLETON)
│   ├── auth.ts                   # Auth utilities
│   ├── design-tokens.ts          # Design system
│   ├── formatters.ts             # Number/date formatters
│   ├── validators.ts             # Zod schemas
│   └── utils.ts                  # General utilities
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── sql/                          # SQL scripts
│   ├── schema/                   # Table definitions
│   ├── views/                    # Materialized views
│   └── migrations/               # Database migrations
├── scripts/                      # Utility scripts
│   ├── import-data.ts
│   ├── refresh-views.ts
│   └── generate-predictions.ts
├── memory/                       # Project memory (context preservation)
│   ├── progress.md
│   ├── decisions.md
│   ├── bugs.md
│   └── active-work.md
└── docs/                         # Documentation
```

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
# Start dev server
npm run dev

# Force specific port
PORT=3001 npm run dev

# Clean start
rm -rf .next && npm run dev
```

### Git Workflow
```bash
# Standard commit
git add .
git commit -m "feat: Add feature description"
git push origin main

# Vercel auto-deploys on push to main
```

### Database Operations
```bash
# Refresh all materialized views
node scripts/refresh-views.js

# Import new data
node scripts/import-data.js path/to/data.csv

# Test database connection
node scripts/test-db-connection.js
```

### Testing Workflow
```bash
# Clean build test (ALWAYS before deployment)
rm -rf .next && npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Test API endpoints
curl -s http://localhost:3000/api/health | jq
```

---

## PERFORMANCE TARGETS

| Metric | Target | Max Acceptable |
|--------|--------|----------------|
| Dashboard load | <2 seconds | <5 seconds |
| Drill-down navigation | <1 second | <3 seconds |
| Data export (small) | <5 seconds | <10 seconds |
| API response (p95) | <2 seconds | <5 seconds |
| Materialized view refresh | <30 seconds | <60 seconds |

---

## KEY BUSINESS METRICS

### Current State Issues (from Assessment)
- Case duration: 17.5 months (6x increase from 2.9 months)
- Time-to-payment: 15.9 months (3.5x increase from 4.5 months)
- Collection rate variance: 42% to 91% across law firms
- Law firm concentration: BD&J, PC = $247K (2x larger than #2)

### Target State
- 100% data reconciliation accuracy
- DSO calculation and trending
- Aging analysis (0-30, 31-60, 61-90, 91-180, 180+ days)
- Predictive settlement analytics
- Law firm performance rankings

### Success Metrics
| Metric | Target | Method |
|--------|--------|--------|
| Data reconciliation | 100% | Automated checks |
| Portal logins/month | +50% | Analytics |
| Data question response | <30s self-service | User testing |
| Provider NPS | +20 points | Quarterly survey |
| Case manager inquiries | -40% | CRM tracking |
| Model prediction variance | <15% | Accuracy tracking |

---

## MEMORY SYSTEM

### Update Protocol
After EVERY task completion:
1. Update `/memory/progress.md` with what was done
2. If architectural decision made → Update `decisions.md`
3. If bug discovered → Update `bugs.md`
4. If performance improved → Update `optimizations.md`
5. If starting new work → Update `active-work.md`

### Progress Entry Template
```markdown
### [Date] - [Task Title]
- **What**: Brief description
- **Why**: Business/technical reason
- **Files Changed**: List of files
- **Impact**: Measurable result
- **Next Steps**: Follow-up tasks
```

---

## QUICK REFERENCE

### Database Connection
```typescript
import { query } from '@/lib/db';
const result = await query('SELECT * FROM table WHERE condition = $1', [value]);
```

### Format Utilities
```typescript
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
formatCurrency(2147832);     // "$2,147,832"
formatPercentage(0.642);     // "64.2%"
formatNumber(716);           // "716"
```

### Color Usage
```typescript
import { COLORS } from '@/lib/design-tokens';
<div style={{ color: COLORS.brand.teal }}>GAIN Teal</div>
<div style={{ color: COLORS.grades.A }}>Grade A - Excellent</div>
```

---

## CONTACTS & RESOURCES

- **PRD**: `/PRD_Enhanced_Provider_Portal.md`
- **Tech Specs**: `/TECHNICAL_SPECIFICATIONS.md`
- **Design Specs**: `/DESIGN_SPECIFICATIONS.md`
- **Reference Architecture**: `/Suggestions/FINANCIAL-PLATFORM-REFERENCE.md`
- **Portal Assessment**: `/Portal/GAIN_Provider_Portal_Assessment.md`

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation (Critical Path)
- Unified master data table
- Core materialized views
- Main dashboard with KPIs
- Aging analysis
- DSO calculation
- Basic data export

### Phase 2: Analytics Enhancement
- Law firm performance dashboard
- Case-level drill-down
- Enhanced case status tracking
- Collection rate analytics
- Write-off analysis

### Phase 3: Predictive Intelligence
- Settlement probability model
- Time prediction models
- Natural language insights
- Anomaly detection
- Recommendations engine

### Phase 4: Advanced Features
- Configurable alert system
- Scheduled reports
- API for integrations
- Mobile optimization
- Location hierarchy

---

**Remember**: Database-first, single source of truth, no frontend calculations!
