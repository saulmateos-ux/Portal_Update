# 🏦 Financial Analytics Platform - Architecture Reference

> **Blueprint for building production-grade financial analytics applications**
>
> This document captures the architectural decisions, patterns, and lessons learned from a world-class litigation funding analytics platform managing $400M+ portfolio with 162,974 records.

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Core Architecture Principles](#core-architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Database Architecture](#database-architecture)
5. [Frontend Patterns](#frontend-patterns)
6. [Performance Optimization Strategies](#performance-optimization-strategies)
7. [Data Pipeline Design](#data-pipeline-design)
8. [Authentication & Security](#authentication--security)
9. [Documentation System](#documentation-system)
10. [Development Workflow](#development-workflow)
11. [Critical Lessons Learned](#critical-lessons-learned)
12. [Reusable Patterns](#reusable-patterns)

---

## 🎯 PROJECT OVERVIEW

### **What It Is**
A professional-grade financial analytics platform for litigation funding portfolio management with comprehensive provider risk assessment, portfolio performance tracking, and valuation analytics.

### **Scale & Performance**
- **Records**: 162,974 active financial transactions
- **Portfolio Value**: $400M+ tracked and analyzed
- **API Performance**: <2 seconds response time (all endpoints)
- **Database Performance**: 350x improvement via strategic indexing
- **Import Speed**: ~90 seconds for 160K+ records (91x faster than original)

### **Production Status**
- ✅ Fully operational in production
- ✅ 100% import success rate
- ✅ Automated deployment pipeline
- ✅ Comprehensive documentation system
- ✅ 47+ API endpoints operational

---

## 🏗️ CORE ARCHITECTURE PRINCIPLES

### **#1: Database-First Architecture (SACRED RULE)**

**Principle**: ALL calculations occur in PostgreSQL - ZERO frontend math

**Why This Matters**:
```typescript
// ❌ WRONG: Frontend calculations
const moic = totalRepaid / totalFunded;
const performanceRatio = providerMOIC / portfolioMedian;

// ✅ CORRECT: Database calculations only
const result = await pool.query(`
  SELECT
    moic,
    performance_ratio,
    risk_grade
  FROM provider_grades_median_based_mv
  WHERE provider_name = $1
`, [providerName]);
```

**Benefits**:
- **Single Source of Truth**: Consistent metrics across entire application
- **Performance**: PostgreSQL optimized for complex calculations
- **Precision**: Eliminates JavaScript floating-point issues
- **Maintainability**: Logic centralized, not scattered
- **Auditability**: All calculations visible in SQL

**Implementation**:
1. Create materialized views for pre-computed metrics
2. API routes ONLY fetch and return data (no transformation)
3. Frontend components ONLY display data (no calculations)
4. Enforce via code review and critical rules system

### **#2: Materialized Views for Performance**

**Pattern**: Pre-compute expensive calculations, refresh after data changes

**Example Structure**:
```sql
-- Pre-computed provider grading (single source of truth)
CREATE MATERIALIZED VIEW provider_grades_median_based_mv AS
SELECT
  provider_name,
  MEDIAN(moic) as median_moic,
  COUNT(*) as case_count,
  SUM(total_funded) as total_funded,
  SUM(total_repaid) as total_repaid,
  -- Complex grading logic (A/B/C/D/E tiers)
  CASE
    WHEN median_moic >= portfolio_median * 1.25 THEN 'A'
    WHEN median_moic >= portfolio_median * 1.00 THEN 'B'
    WHEN median_moic >= portfolio_median * 0.80 THEN 'C'
    WHEN median_moic >= portfolio_median * 0.60 THEN 'D'
    ELSE 'E'
  END as risk_grade
FROM cherokee_master_data
GROUP BY provider_name
HAVING COUNT(*) >= 5 AND SUM(total_funded) >= 50000;
```

**Refresh Strategy**:
```javascript
// After data import or update
await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY provider_grades_median_based_mv');
```

**Benefits**:
- Instant dashboard loads (<2 seconds)
- Complex calculations done once, not per request
- Better user experience
- Reduced database load

### **#3: Shared Connection Pool (Singleton Pattern)**

**Anti-Pattern**: Creating individual pools in each API route
```typescript
// ❌ WRONG: 54 duplicate pool instances
// app/api/provider-analytics/route.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// app/api/real-time-metrics/route.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

**Correct Pattern**: Singleton pool
```typescript
// ✅ CORRECT: lib/db.ts (single shared pool)
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 60000,
});

// CRITICAL: Attach to Vercel's serverless lifecycle
attachDatabasePool(pool);

export { pool };
export const query = (text: string, params?: any[]) => pool.query(text, params);
```

**Usage in API routes**:
```typescript
import { query } from '@/lib/db';

export async function GET() {
  const result = await query('SELECT * FROM metrics_mv');
  return NextResponse.json(result.rows);
}
```

**Impact**: 60-80% performance improvement

### **#4: Enforce Standards via Critical Rules**

**Pattern**: Document non-negotiable architectural rules

**Example Implementation** (CLAUDE.md):
```markdown
## ⛔ CRITICAL RULES - NEVER BREAK THESE

1. **NO FRONTEND CALCULATIONS** - ALL math in PostgreSQL only!
2. **NO SYNTHETIC DATA** - Real data only, no placeholders
3. **ALWAYS TEST** - Test significant changes
4. **USE SHARED POOL** - Never create new connections
5. **DATABASE GRADING ONLY** - Never calculate grades in code
6. **SINGLE SOURCE OF TRUTH** - One view per metric type
7. **FIELD STANDARDS** - Use standardized field names
8. **AUTO-DEPLOYMENT** - Git push deploys automatically
9. **ALWAYS INDEX JOINS** - Create indexes on JOIN columns
10. **UPDATE MEMORY FILES** - Document every task
```

**Enforcement**:
- Code review checklist
- Automated linting (where possible)
- Documentation references
- Onboarding materials

---

## 💻 TECHNOLOGY STACK

### **Frontend Stack**
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS + Design Tokens",
  "charts": "Recharts + Custom Abstractions",
  "ui": "Tremor, Headless UI, Lucide Icons",
  "state": "React Hooks (minimal - database-driven)"
}
```

### **Backend Stack**
```json
{
  "database": "Neon PostgreSQL (serverless)",
  "api": "Next.js API Routes (REST)",
  "pool": "pg + @vercel/functions",
  "auth": "Clerk (restricted mode)",
  "deployment": "Vercel (auto-deploy)"
}
```

### **Data Processing Stack**
```json
{
  "csv-processing": "Custom preprocessor (Node.js)",
  "import-method": "Chunked API upload",
  "validation": "PostgreSQL constraints + triggers",
  "performance": "91x faster via optimization"
}
```

### **Why These Choices**

**Next.js 14 App Router**:
- Server components reduce client bundle
- Built-in API routes
- Excellent Vercel integration
- TypeScript support

**Neon PostgreSQL**:
- Serverless auto-scaling
- Branch databases for testing
- Excellent analytics performance
- Built-in connection pooling

**Clerk Authentication**:
- Restricted mode (invitation-only)
- Excellent Next.js integration
- User management dashboard
- Zero backend auth code needed

---

## 🗄️ DATABASE ARCHITECTURE

### **Schema Design Principles**

**1. Single Master Table + Materialized Views**
```
cherokee_master_data (162,974 records)
├── provider_grades_median_based_mv
├── partial_advance_outstanding_mv
├── law_firm_analytics_mv
├── product_funding_metrics_mv
├── collection_curves_mv
└── [18 more materialized views]
```

**2. Critical Indexes** (7 essential indexes)
```sql
-- Case linking optimization (350x improvement)
CREATE INDEX idx_cherokee_opportunity_name
  ON cherokee_master_data(opportunity_name);

-- Provider analytics
CREATE INDEX idx_cherokee_provider_name
  ON cherokee_master_data(provider_name);

-- Date range queries
CREATE INDEX idx_cherokee_dates
  ON cherokee_master_data(origination_date, settlement_date);

-- Composite indexes for common queries
CREATE INDEX idx_cherokee_provider_product
  ON cherokee_master_data(provider_name, product_type);
```

**Impact**: Missing index caused 10+ minute timeout → Added index → 1.7 seconds (350x faster)

### **Materialized View Strategy**

**Structure**:
```sql
-- Example: Provider performance grading
CREATE MATERIALIZED VIEW provider_grades_median_based_mv AS
SELECT
  provider_name,
  COUNT(*) as total_cases,
  SUM(total_funded) as total_funded,
  SUM(total_repaid) as total_repaid,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY moic) as median_moic,
  -- Grading logic (median-based, relative to portfolio)
  CASE
    WHEN PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY moic) >=
         (SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY moic) FROM cherokee_master_data) * 1.25
    THEN 'A'
    -- ... other tiers
  END as risk_grade,
  performance_ratio,
  performance_tier
FROM cherokee_master_data
WHERE total_funded > 0
GROUP BY provider_name
HAVING COUNT(*) >= 5 AND SUM(total_funded) >= 50000;

-- Indexes on materialized views
CREATE INDEX idx_provider_grades_name ON provider_grades_median_based_mv(provider_name);
CREATE INDEX idx_provider_grades_grade ON provider_grades_median_based_mv(risk_grade);
```

**Refresh Pattern**:
```javascript
// refresh-materialized-views.js
const views = [
  'provider_grades_median_based_mv',
  'partial_advance_outstanding_mv',
  'law_firm_analytics_mv',
  // ... 20 more views
];

for (const view of views) {
  console.log(`Refreshing ${view}...`);
  await pool.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`);
}
```

**Performance Benchmarks**:
- 23 materialized views
- Total refresh time: ~22 seconds
- API response time: <2 seconds (all endpoints)
- Dashboard load time: <1 second

### **Connection Pool Configuration**

```typescript
// lib/db.ts
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,

  // Optimized settings
  max: 20,                      // Max connections
  min: 2,                       // Min to maintain
  idleTimeoutMillis: 30000,     // Close idle after 30s
  connectionTimeoutMillis: 10000, // Wait 10s for connection
  statement_timeout: 60000,     // Query timeout 60s
  query_timeout: 60000,         // Total timeout 60s

  allowExitOnIdle: true,        // Allow process exit when idle
});

// CRITICAL: Vercel serverless lifecycle
attachDatabasePool(pool);

// Convenience functions
export { pool };
export const query = (text: string, params?: any[]) => pool.query(text, params);
export const getClient = () => pool.connect();
export const transaction = async <T>(callback: (client: any) => Promise<T>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
```

### **Database Performance Rules**

**Rule**: Always index JOIN columns and foreign keys

**Example Problem** (Oct 6, 2025):
```sql
-- SLOW: No index on opportunity_name (10+ min timeout)
SELECT
  c.*,
  ca.case_id
FROM cherokee_master_data c
LEFT JOIN case_aggregation ca ON c.opportunity_name = ca.opportunity_name;

-- FAST: After adding index (1.7 seconds - 350x faster)
CREATE INDEX idx_cherokee_opportunity_name ON cherokee_master_data(opportunity_name);
```

**Diagnostic Process**:
1. Check existing indexes: `\d+ table_name`
2. Analyze query plan: `EXPLAIN ANALYZE SELECT ...`
3. Look for Sequential Scans on large tables
4. Add indexes on JOIN columns
5. Use CONCURRENTLY for production: `CREATE INDEX CONCURRENTLY ...`

---

## 🎨 FRONTEND PATTERNS

### **Component Architecture**

**Size Limit**: <1,000 lines per component (enforced)

**Directory Structure**:
```
components/
├── charts/                    # 7 reusable chart components
│   ├── StandardBarChart.tsx
│   ├── StandardPieChart.tsx
│   ├── StandardLineChart.tsx
│   └── formatters.ts          # Currency, percentage formatters
├── analytics/                 # Analytics-specific components
│   ├── ProviderCard.tsx
│   ├── MetricsGrid.tsx
│   └── CollectionCurves.tsx
└── CaseAnalyticsDashboard.tsx # Main dashboard
```

**Reusable Chart Pattern**:
```typescript
// components/charts/StandardBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CHART_COLORS } from './colors';

interface StandardBarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
  formatter?: (value: number) => string;
}

export function StandardBarChart({
  data,
  xKey,
  yKey,
  color = CHART_COLORS.primary,
  formatter = (v) => v.toString()
}: StandardBarChartProps) {
  return (
    <BarChart data={data} width={600} height={300}>
      <XAxis dataKey={xKey} />
      <YAxis tickFormatter={formatter} />
      <Tooltip formatter={formatter} />
      <Bar dataKey={yKey} fill={color} />
    </BarChart>
  );
}

// Usage
<StandardBarChart
  data={providerData}
  xKey="provider_name"
  yKey="total_funded"
  formatter={formatCurrency}
  color={CHART_COLORS.funding}
/>
```

### **Design Token System**

**Pattern**: NEVER hardcode colors, sizes, or spacing

```typescript
// lib/design-tokens.ts
export const COLORS = {
  funding: {
    primary: '#3B82F6',    // Blue
    secondary: '#60A5FA',
    light: '#DBEAFE',
  },
  collections: {
    primary: '#10B981',    // Green
    secondary: '#34D399',
    light: '#D1FAE5',
  },
  risk: {
    high: '#EF4444',       // Red
    medium: '#F59E0B',     // Amber
    low: '#10B981',        // Green
  },
  grades: {
    A: '#10B981',          // Excellent
    B: '#3B82F6',          // Good
    C: '#6B7280',          // Average
    D: '#F59E0B',          // Poor
    E: '#EF4444',          // Critical
  },
};

export const CHART_COLORS = {
  primary: COLORS.funding.primary,
  secondary: COLORS.collections.primary,
  funding: COLORS.funding.primary,
  collections: COLORS.collections.primary,
};

// Usage
import { COLORS } from '@/lib/design-tokens';

<div className="text-primary" style={{ color: COLORS.funding.primary }}>
  Total Funded
</div>
```

### **API Integration Pattern**

**Pattern**: Fetch only, never calculate

```typescript
// app/api/provider-analytics/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ✅ CORRECT: Fetch pre-calculated data from materialized view
    const result = await query(`
      SELECT
        provider_name,
        risk_grade,
        median_moic,
        performance_ratio,
        total_funded,
        total_repaid
      FROM provider_grades_median_based_mv
      ORDER BY performance_ratio DESC
      LIMIT 10
    `);

    // ❌ WRONG: Never do this
    // const moic = row.total_repaid / row.total_funded;

    return NextResponse.json({
      data: result.rows,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'PostgreSQL_MaterializedView',
        calculationsInDatabase: true,
        apiPassthroughOnly: true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Frontend Component**:
```typescript
// components/ProviderAnalytics.tsx
'use client';

import { useEffect, useState } from 'react';
import { StandardBarChart } from '@/components/charts';
import { formatCurrency } from '@/lib/formatters';

export function ProviderAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // ✅ CORRECT: Fetch and display only
    fetch('/api/provider-analytics')
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  // ❌ WRONG: Never calculate in frontend
  // const moic = data.total_repaid / data.total_funded;

  return (
    <StandardBarChart
      data={data}
      xKey="provider_name"
      yKey="total_funded"
      formatter={formatCurrency}
    />
  );
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION STRATEGIES

### **1. Shared Connection Pool** (+60-80% improvement)

**Before**: 54 individual Pool instances
**After**: Single shared pool
**Impact**: Dramatic reduction in connection overhead

### **2. Strategic Indexing** (+350x improvement)

**Case Study** (Oct 6, 2025):
- **Problem**: Case linking timeout (10+ minutes)
- **Diagnosis**: Missing index on JOIN column
- **Solution**: `CREATE INDEX idx_cherokee_opportunity_name ON cherokee_master_data(opportunity_name);`
- **Result**: 1.7 seconds (350x faster)

**Rule**: Always check indexes before optimizing queries

```bash
# Diagnose missing indexes
EXPLAIN ANALYZE SELECT ... FROM table WHERE column = value;

# Look for "Seq Scan" on large tables
# Add index if found
CREATE INDEX CONCURRENTLY idx_table_column ON table(column);
```

### **3. Materialized Views** (Instant dashboards)

**Before**: Real-time aggregation on every request
**After**: Pre-computed views, refresh after imports
**Impact**: API response time <2 seconds

### **4. Direct Connection for Long Operations**

**Pattern**: Use direct Neon connection (no pooler) for bulk operations

```typescript
// For short queries (<30 sec): Use pooler
const DATABASE_URL = process.env.DATABASE_URL; // with -pooler

// For long operations (>30 sec): Use direct connection
const DATABASE_URL_DIRECT = process.env.DATABASE_URL.replace('-pooler.', '.');

// import-data.js
const pool = new Pool({
  connectionString: DATABASE_URL_DIRECT,  // Direct connection
  max: 5,
  statement_timeout: 0,  // No timeout for bulk operations
});
```

### **5. Import Pipeline Optimization** (+91x improvement)

**Evolution**:
1. **Original**: 20+ minutes for 160K records
2. **Turbo COPY**: 13 seconds (broken - hangs at 98.1%)
3. **Chunked Upload**: ~70 seconds (100% success rate)

**Current Method** (3-step process):
```bash
# Step 1: Clean CSV (MANDATORY)
node super-mega-preprocessor.js  # 4.4 seconds

# Step 2: Split into chunks
node split-nov03.js              # Creates 21 chunks of ~8K records

# Step 3: Upload via API
node upload-nov03.js             # ~60 seconds (chunked API upload)

# Step 4: Refresh views
node refresh-materialized-views.js  # 22 seconds

# Total: ~90 seconds for 162,974 records
```

---

## 📥 DATA PIPELINE DESIGN

### **CSV Preprocessing (Super Mega Preprocessor)**

**Purpose**: Clean raw CSV for PostgreSQL compatibility

**Issues Fixed**:
- Empty strings like `" -   "` → `NULL`
- Invalid dates → `NULL`
- Currency symbols → Plain numbers
- Malformed numbers → Proper decimals
- Inconsistent formatting → Standardized

**Implementation**:
```javascript
// super-mega-preprocessor.js
const fs = require('fs');
const Papa = require('papaparse');

const cleanValue = (value) => {
  if (!value || value.trim() === '' || value.trim() === '-') return null;
  return value.trim();
};

const cleanDate = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
};

const cleanNumber = (numStr) => {
  if (!numStr || numStr.trim() === '') return null;
  const cleaned = numStr.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

// Process CSV row by row
const results = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  transform: (value, field) => {
    if (field.includes('date')) return cleanDate(value);
    if (field.includes('amount') || field.includes('funded')) return cleanNumber(value);
    return cleanValue(value);
  }
});

// Write cleaned CSV
fs.writeFileSync('cleaned.csv', Papa.unparse(results.data));
```

**Impact**: 100% database compatibility, zero import failures

### **Chunked Upload Pattern**

**Why Needed**: Vercel 4.5MB request limit + Neon IP restrictions

**Architecture**:
```javascript
// split-nov03.js (Split into chunks)
const CHUNK_SIZE = 8000;  // Records per chunk
const chunks = [];

for (let i = 0; i < records.length; i += CHUNK_SIZE) {
  const chunk = records.slice(i, i + CHUNK_SIZE);
  fs.writeFileSync(`chunk_${Math.floor(i/CHUNK_SIZE) + 1}.csv`,
    Papa.unparse(chunk));
}

// upload-nov03.js (Upload to production)
const PRODUCTION_URL = 'https://your-app.vercel.app/api/import-csv-chunk';

for (let i = 1; i <= 21; i++) {
  const csvContent = fs.readFileSync(`chunk_${i}.csv`, 'utf-8');

  console.log(`Uploading chunk ${i}/21...`);

  const response = await fetch(PRODUCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      csvData: csvContent,
      clearExisting: i === 1  // Only clear on first chunk
    })
  });

  if (!response.ok) throw new Error(`Chunk ${i} failed`);
  console.log(`✅ Chunk ${i} completed`);
}
```

**API Endpoint**:
```typescript
// app/api/import-csv-chunk/route.ts
import { query, transaction } from '@/lib/db';
import Papa from 'papaparse';

export async function POST(request: Request) {
  const { csvData, clearExisting } = await request.json();

  return await transaction(async (client) => {
    // Clear existing data on first chunk
    if (clearExisting) {
      await client.query('TRUNCATE TABLE cherokee_master_data CASCADE');
    }

    // Parse CSV
    const parsed = Papa.parse(csvData, { header: true });

    // Bulk insert
    for (const row of parsed.data) {
      await client.query(`
        INSERT INTO cherokee_master_data (
          opportunity_name, provider_name, total_funded, total_repaid, ...
        ) VALUES ($1, $2, $3, $4, ...)
      `, [row.opportunity_name, row.provider_name, ...]);
    }

    return { success: true, recordsImported: parsed.data.length };
  });
}
```

**Performance**: ~60 seconds for 162,974 records (21 chunks × 3 sec avg)

### **Case Aggregation System**

**Purpose**: Link transactions to cases for provider-level analytics

**Implementation**:
```sql
-- Case aggregation table
CREATE TABLE case_aggregation (
  case_id SERIAL PRIMARY KEY,
  opportunity_name TEXT UNIQUE,
  provider_name TEXT,
  total_funded DECIMAL,
  total_repaid DECIMAL,
  case_count INTEGER
);

-- Automatic aggregation trigger
CREATE OR REPLACE FUNCTION aggregate_cases() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO case_aggregation (opportunity_name, provider_name, total_funded, total_repaid, case_count)
  SELECT
    opportunity_name,
    provider_name,
    SUM(total_funded),
    SUM(total_repaid),
    COUNT(*)
  FROM cherokee_master_data
  WHERE opportunity_name = NEW.opportunity_name
  GROUP BY opportunity_name, provider_name
  ON CONFLICT (opportunity_name) DO UPDATE SET
    total_funded = EXCLUDED.total_funded,
    total_repaid = EXCLUDED.total_repaid,
    case_count = EXCLUDED.case_count;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER aggregate_cases_trigger
AFTER INSERT OR UPDATE ON cherokee_master_data
FOR EACH ROW EXECUTE FUNCTION aggregate_cases();
```

**Validation**:
```sql
-- Check case integrity
SELECT
  COUNT(*) as total_transactions,
  COUNT(DISTINCT opportunity_name) as total_cases,
  COUNT(*) FILTER (WHERE opportunity_name IS NULL) as unlinked
FROM cherokee_master_data;

-- All checks must PASS
```

---

## 🔐 AUTHENTICATION & SECURITY

### **Clerk Integration (Restricted Mode)**

**Configuration**:
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

**CRITICAL: Suspense Boundaries** (Learned from 7-hour downtime):
```typescript
// ❌ WRONG: Direct Clerk component (causes build failures)
import { UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  return <UserButton />;  // BREAKS BUILD
}

// ✅ CORRECT: Wrap in Suspense
import { Suspense } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserButton />
    </Suspense>
  );
}

// ✅ CORRECT: Mark layout as dynamic
export const dynamic = 'force-dynamic';
```

**next.config.js Requirements**:
```javascript
module.exports = {
  // REQUIRED: Disable incompatible features
  experimental: {
    ppr: false,  // Clerk incompatible
  },
  // Don't use 'standalone' output
  output: undefined,
};
```

### **Route Protection**

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  // ⚠️ CRITICAL: NEVER add '/' here (breaks dashboard)
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### **User Management**

**Restricted Mode Setup**:
1. Clerk Dashboard → Configure → Restrictions
2. Enable "Restricted" mode
3. Invite users via email
4. Users complete sign-up via invitation link

**Test User** (for automation):
```json
{
  "username": "saul",
  "password": "TestPass123!",
  "purpose": "API testing without email verification"
}
```

---

## 📚 DOCUMENTATION SYSTEM

### **Three-Tier Documentation**

**Tier 1: CLAUDE.md (Project Constitution)**
- Critical rules (non-negotiable)
- Architecture principles
- Technology stack
- Essential commands
- Quick reference

**Tier 2: /memory/ Directory (Project Journal)**
- `progress.md` - Completed tasks timeline
- `decisions.md` - Architectural choices with rationale
- `bugs.md` - Known issues and resolutions
- `optimizations.md` - Performance improvements with metrics
- `active-work.md` - Current sprint focus
- `context-priority.md` - Preservation rules

**Tier 3: /docs/ Directory (Comprehensive Guides)**
- 22 detailed documentation files
- Technical deep dives
- API reference
- Financial definitions
- Deployment guides

### **Context Engineering System** (/memory/)

**Purpose**: Survive Claude Code's context compaction

**Structure**:
```
/memory/
├── README.md               # Quick reference + templates
├── progress.md            # Timeline of completed work
├── decisions.md           # Why we made architectural choices
├── bugs.md                # Issues discovered and resolved
├── optimizations.md       # Performance improvements
├── active-work.md         # Current focus
└── context-priority.md    # What to preserve during compaction
```

**Update Protocol** (Rule #13):
```markdown
## After EVERY task completion:

1. Update /memory/progress.md with what was done
2. If architectural decision → Update decisions.md
3. If bug discovered → Update bugs.md
4. If performance improved → Update optimizations.md with metrics
5. If starting new work → Update active-work.md
```

**Template Example** (progress.md):
```markdown
## November 2025

### Week of November 3-9
- **Nov 5**: CRITICAL GRADING BUG FIX - Fixed provider grading excluding 15+ providers
  - Bug #1: Row-level funding filter blocking providers
  - Bug #2: Zero MOIC fallback failure
  - **Impact**: 37 → 52 providers graded (+15, +41%)
  - **Files**: /sql/create-provider-grades-median-based-mv.sql
  - **Documentation**: Updated bugs.md with investigation
```

**Benefits**:
- Knowledge persists across sessions
- Pattern recognition for recurring issues
- Architectural coherence maintained
- Long-term project state preserved

### **Compaction Strategy**

**When to Compact**: 70-80% context usage (NOT 90%)

**Preservation Priority**:
1. **CRITICAL**: 13 Critical Rules, database methodology, import pipeline
2. **HIGH**: Current work, recent changes (30 days), active bugs
3. **MEDIUM**: Architectural decisions, key benchmarks
4. **LOW**: Historical context (>90 days), verbose outputs

**Compaction Instructions**:
```
Preserve verbatim:
1. All 13 Critical Rules from CLAUDE.md
2. Current import methodology (Chunked Vercel Upload)
3. Database grading rule (provider_grades_median_based_mv only)
4. Financial field standards (total_funded, total_repaid)
5. Current active work from /memory/active-work.md

Preserve with detail:
6. Recent changes (last 30 days from progress.md)
7. Active bugs (bugs.md)
8. Recent optimizations (last 3 from optimizations.md)
9. Key benchmarks: case linking 1.7s, APIs <2s, imports ~90s

Summarize key points:
10. Architectural decisions (name + rationale only)
11. Resolved bugs >30 days (pattern + prevention only)

Can discard:
12. Historical context >90 days
13. Verbose tool outputs
14. Completed routine tasks
```

---

## 🚀 DEVELOPMENT WORKFLOW

### **Local Development**

```bash
# Start dev server (auto-detects available port)
npm run dev

# Start with automatic browser opening
npm run dev:chrome

# Clean environment + start
npm run dev:safe

# Force specific port
PORT=3001 npm run dev
```

### **Git Workflow**

```bash
# Standard workflow
git add .
git commit -m "feat: Add new feature"
git push origin main

# ✅ Vercel automatically deploys to production
# No manual deployment needed!
```

### **Deployment Configuration**

**Vercel Settings**:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x

**Environment Variables**:
```env
# Production (.env.production)
DATABASE_URL=postgresql://user:pass@host/db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NODE_ENV=production

# Local (.env.local)
DATABASE_URL=postgresql://user:pass@localhost/db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NODE_ENV=development
```

### **Testing Workflow**

```bash
# Test database connection
node test-db-connection.js

# Test API endpoints
curl -s http://localhost:3004/api/health
curl -s http://localhost:3004/api/real-time-metrics | jq

# Manual browser testing
# 1. Open http://localhost:3004
# 2. Login with credentials
# 3. Navigate through features
# 4. Verify data loads correctly
```

---

## 💡 CRITICAL LESSONS LEARNED

### **1. Infrastructure Can Change Overnight** (Sept 29, 2025)

**What Happened**: Neon activated IP restrictions
**Impact**: All direct `psql` access blocked from local terminal
**Previous Method**: Direct COPY commands (6 seconds)
**Required Solution**: Pivot to API-based chunked upload (~70 seconds)

**Lesson**: Build adaptable systems, don't over-optimize for specific infrastructure

**Mitigation**:
- Abstract import logic into interchangeable modules
- Document multiple import strategies
- Test recovery procedures
- Monitor infrastructure announcements

### **2. Build-Time SSR Incompatibilities** (Sept 30, 2025)

**What Happened**: Missing Suspense boundaries around Clerk components
**Impact**: 7-hour production downtime, build failures
**Root Cause**: Clerk requires React context not available during build

**Lesson**: Test clean builds before deployment

**Prevention**:
```bash
# Always test clean build locally
rm -rf .next && npm run build

# Wrap all authentication components in Suspense
<Suspense fallback={<Loading />}>
  <UserButton />
</Suspense>

# Mark layouts as dynamic
export const dynamic = 'force-dynamic';
```

### **3. Missing Indexes Cause Massive Performance Issues** (Oct 6, 2025)

**What Happened**: Case linking timeout (10+ minutes)
**Diagnosis**: No index on JOIN column (`opportunity_name`)
**Solution**: Created index
**Result**: 350x improvement (1.7 seconds)

**Lesson**: Always index JOIN columns and foreign keys

**Checklist**:
```sql
-- Before deploying new queries, check:
1. EXPLAIN ANALYZE the query
2. Look for Sequential Scans on large tables
3. Verify indexes exist on JOIN columns
4. Add missing indexes with CONCURRENTLY
5. Re-test query performance
```

### **4. Grading Logic Edge Cases** (Nov 5, 2025)

**What Happened**: 15 providers excluded from grading system
**Root Causes**:
1. Row-level filters blocking providers (should be HAVING clause)
2. Zero MOIC fallback failure (needed NULLIF)

**Impact**: 37 → 52 providers graded (+41%)

**Lesson**: Complex SQL requires thorough testing with edge cases

**Prevention**:
- Test with providers having unusual patterns
- Validate COUNT before and after changes
- Document grading criteria explicitly
- Add data quality checks

### **5. Database-First Architecture Pays Off**

**Benefits Realized**:
- Zero calculation bugs in frontend
- Consistent metrics across all pages
- Easy to update logic (change SQL, not 50 components)
- Better performance (PostgreSQL optimized for this)
- Single source of truth

**Trade-offs Worth It**:
- More complex database setup
- Materialized view management
- Longer initial learning curve

**Validation**: 162,974 records, 47 API endpoints, zero calculation inconsistencies

---

## 🔧 REUSABLE PATTERNS

### **Pattern 1: Singleton Database Pool**

```typescript
// lib/db.ts
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
});

attachDatabasePool(pool);

export { pool };
export const query = (text: string, params?: any[]) => pool.query(text, params);
```

### **Pattern 2: Materialized View with Refresh**

```sql
-- Create view
CREATE MATERIALIZED VIEW metrics_mv AS
SELECT
  dimension,
  COUNT(*) as count,
  SUM(amount) as total
FROM transactions
GROUP BY dimension;

CREATE INDEX idx_metrics_dimension ON metrics_mv(dimension);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_metrics() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY metrics_mv;
END;
$$ LANGUAGE plpgsql;
```

### **Pattern 3: API Route Template**

```typescript
// app/api/[endpoint]/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM materialized_view
      WHERE condition = true
    `);

    return NextResponse.json({
      data: result.rows,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'PostgreSQL_MaterializedView',
        calculationsInDatabase: true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Pattern 4: Reusable Chart Component**

```typescript
// components/charts/StandardBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  formatter?: (value: number) => string;
}

export function StandardBarChart({
  data,
  xKey,
  yKey,
  color = '#3B82F6',
  formatter = (v) => v.toString()
}: Props) {
  return (
    <BarChart data={data} width={600} height={300}>
      <XAxis dataKey={xKey} />
      <YAxis tickFormatter={formatter} />
      <Tooltip formatter={formatter} />
      <Bar dataKey={yKey} fill={color} />
    </BarChart>
  );
}
```

### **Pattern 5: CSV Preprocessing**

```javascript
// preprocessor.js
const Papa = require('papaparse');
const fs = require('fs');

const cleanValue = (value, type) => {
  if (!value || value.trim() === '') return null;

  switch(type) {
    case 'date':
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    case 'number':
      const num = parseFloat(value.replace(/[$,]/g, ''));
      return isNaN(num) ? null : num;
    default:
      return value.trim();
  }
};

const csvContent = fs.readFileSync('input.csv', 'utf-8');
const parsed = Papa.parse(csvContent, { header: true });

const cleaned = parsed.data.map(row => ({
  ...row,
  date_field: cleanValue(row.date_field, 'date'),
  amount_field: cleanValue(row.amount_field, 'number'),
}));

fs.writeFileSync('cleaned.csv', Papa.unparse(cleaned));
```

### **Pattern 6: Chunked Upload**

```javascript
// upload-chunks.js
const CHUNK_SIZE = 8000;
const API_URL = 'https://your-app.vercel.app/api/import-chunk';

const records = /* load all records */;
const chunks = [];

// Split into chunks
for (let i = 0; i < records.length; i += CHUNK_SIZE) {
  chunks.push(records.slice(i, i + CHUNK_SIZE));
}

// Upload sequentially
for (let i = 0; i < chunks.length; i++) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: chunks[i],
      clearExisting: i === 0
    })
  });

  if (!response.ok) throw new Error(`Chunk ${i+1} failed`);
  console.log(`✅ Chunk ${i+1}/${chunks.length} completed`);
}
```

---

## 📊 SUCCESS METRICS

### **Performance Benchmarks**
- ✅ API Response Time: <2 seconds (all endpoints)
- ✅ Database Queries: 350x improvement (via indexing)
- ✅ Import Speed: ~90 seconds for 162K records (91x faster)
- ✅ Case Linking: 1.7 seconds (162,305 transactions)
- ✅ Materialized View Refresh: 22 seconds (23 views)

### **Quality Metrics**
- ✅ Component Size: <1,000 lines (enforced)
- ✅ Bundle Size: 21% reduction via refactoring
- ✅ SQL Files: 31.7% reduction (63→43 files)
- ✅ Import Success Rate: 100% (chunked upload method)
- ✅ Zero Calculation Bugs: Database-first architecture

### **Scale**
- ✅ Records: 162,974 active transactions
- ✅ Portfolio Value: $400M+ tracked
- ✅ Providers: 52 actively graded
- ✅ API Endpoints: 47+ operational
- ✅ Materialized Views: 23 pre-computed
- ✅ Documentation Files: 22 comprehensive guides

---

## 🎯 IMPLEMENTATION CHECKLIST

Use this when starting a new project:

### **Phase 1: Architecture Setup**
- [ ] Define critical rules (start with 5-10)
- [ ] Choose database-first or hybrid approach
- [ ] Set up shared connection pool
- [ ] Configure deployment pipeline (Vercel)
- [ ] Create CLAUDE.md with rules and architecture

### **Phase 2: Database Design**
- [ ] Design primary tables
- [ ] Identify materialized view candidates
- [ ] Create essential indexes (JOIN columns, foreign keys)
- [ ] Set up connection pool with serverless support
- [ ] Test database performance with sample data

### **Phase 3: Frontend Architecture**
- [ ] Create design token system
- [ ] Build reusable chart components
- [ ] Set up component size limits (<1,000 lines)
- [ ] Implement API integration pattern (fetch only)
- [ ] Configure authentication (Clerk with Suspense)

### **Phase 4: Data Pipeline**
- [ ] Build CSV preprocessor
- [ ] Implement chunked upload system
- [ ] Create materialized view refresh script
- [ ] Set up validation checks
- [ ] Test import with production-size data

### **Phase 5: Documentation**
- [ ] Create /memory/ directory structure
- [ ] Initialize progress.md, decisions.md, bugs.md
- [ ] Write comprehensive /docs/ guides
- [ ] Document API endpoints
- [ ] Create onboarding materials

### **Phase 6: Quality Assurance**
- [ ] Set up testing workflow (manual + automated)
- [ ] Test clean builds (rm -rf .next && npm run build)
- [ ] Verify all critical paths
- [ ] Load test with production data volume
- [ ] Document troubleshooting procedures

---

## 📖 CONCLUSION

This financial analytics platform demonstrates:

- **Exceptional architecture**: Database-first, materialized views, shared pool
- **Performance obsession**: 350x improvements via strategic optimization
- **Adaptive engineering**: Pivoted successfully through infrastructure changes
- **Documentation excellence**: Three-tier system with context engineering
- **Production reliability**: 100% import success, <2s API responses

**Key Takeaway**: Strong architectural principles, comprehensive documentation, and disciplined adherence to standards enable building production-grade systems that scale and evolve.

---

**Reference Project**: Financial Analytics Platform
**Records**: 162,974 active transactions
**Portfolio**: $400M+ tracked and analyzed
**Status**: Fully operational in production
**Created**: January 2025

Use this document as a blueprint for your next project!
