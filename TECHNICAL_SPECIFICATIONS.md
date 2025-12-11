# Enhanced Provider Portal - Technical Specifications

**Version**: 1.0
**Date**: December 9, 2025
**Author**: Saul Mateos
**Status**: Draft

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [System Architecture](#2-system-architecture)
3. [Database Design](#3-database-design)
4. [API Design](#4-api-design)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Authentication & Security](#6-authentication--security)
7. [Data Pipeline](#7-data-pipeline)
8. [AI/ML Infrastructure](#8-aiml-infrastructure)
9. [DevOps & Deployment](#9-devops--deployment)
10. [Performance Optimization](#10-performance-optimization)
11. [Monitoring & Observability](#11-monitoring--observability)

---

## 1. Technology Stack

### 1.1 Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ (App Router) | React framework with server components |
| **TypeScript** | 5.x | Type safety and developer experience |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Recharts** | 2.x | Chart library for visualizations |
| **Tremor** | 3.x | Dashboard UI components |
| **Headless UI** | 1.x | Accessible UI primitives |
| **Lucide Icons** | Latest | Icon library |
| **React Query** | 5.x | Server state management |
| **Zustand** | 4.x | Client state management (minimal) |

### 1.2 Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14+ | REST API endpoints |
| **PostgreSQL** | 15+ | Primary database (Neon serverless) |
| **pg** | 8.x | PostgreSQL client for Node.js |
| **@vercel/functions** | Latest | Serverless function lifecycle |
| **Clerk** | 5.x | Authentication provider |
| **Zod** | 3.x | Runtime schema validation |

### 1.3 Data Processing Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Papa Parse** | 5.x | CSV parsing and processing |
| **ExcelJS** | 4.x | Excel file generation |
| **PDFKit** | 0.14+ | PDF report generation |

### 1.4 AI/ML Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11+ | ML model development |
| **scikit-learn** | 1.x | Machine learning models |
| **XGBoost** | 2.x | Gradient boosting models |
| **PostgreSQL ML** | OR custom API | Model serving |
| **OpenAI API** | GPT-4 | Natural language insights |

### 1.5 Infrastructure

| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend hosting and deployment |
| **Neon** | Serverless PostgreSQL |
| **GitHub** | Version control and CI/CD triggers |
| **Datadog/Vercel Analytics** | Monitoring and observability |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   Desktop   │  │   Tablet    │  │   Mobile    │               │
│  │   Browser   │  │   Browser   │  │   Browser   │               │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
┌──────────────────────────┼───────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│  ┌───────────────────────┴───────────────────────┐               │
│  │              Next.js App Router                │               │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │               │
│  │  │  Pages   │  │  Server  │  │   Client     │ │               │
│  │  │ (RSC)    │  │Components│  │  Components  │ │               │
│  │  └──────────┘  └──────────┘  └──────────────┘ │               │
│  └───────────────────────────────────────────────┘               │
│                           │                                       │
│  ┌───────────────────────┴───────────────────────┐               │
│  │              API Routes Layer                  │               │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │               │
│  │  │   KPI    │  │  Cases   │  │   Reports    │ │               │
│  │  │  Routes  │  │  Routes  │  │   Routes     │ │               │
│  │  └──────────┘  └──────────┘  └──────────────┘ │               │
│  └───────────────────────────────────────────────┘               │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│  ┌──────────────────────┐│┌──────────────────────┐               │
│  │   Authentication     │││    Authorization     │               │
│  │   (Clerk)            │││    (RBAC)            │               │
│  └──────────────────────┘│└──────────────────────┘               │
│                          │                                        │
│  ┌──────────────────────┐│┌──────────────────────┐               │
│  │   Shared DB Pool     │││   Cache Layer        │               │
│  │   (lib/db.ts)        │││   (Redis/Memory)     │               │
│  └──────────────────────┘│└──────────────────────┘               │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌───────────────────────┴───────────────────────┐               │
│  │              Neon PostgreSQL                   │               │
│  │  ┌──────────────────────────────────────────┐ │               │
│  │  │           provider_master_data           │ │               │
│  │  │         (Single Source of Truth)         │ │               │
│  │  └──────────────────────────────────────────┘ │               │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │               │
│  │  │ kpi_mv   │ │ aging_mv │ │ law_firm_mv  │  │               │
│  │  └──────────┘ └──────────┘ └──────────────┘  │               │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │               │
│  │  │ case_mv  │ │tranche_mv│ │predictions_mv│  │               │
│  │  └──────────┘ └──────────┘ └──────────────┘  │               │
│  └───────────────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                 EXTERNAL INTEGRATIONS                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                    │
│  │Salesforce│  │  GAIN    │  │  OpenAI API  │                    │
│  │   Sync   │  │ Systems  │  │  (Insights)  │                    │
│  └──────────┘  └──────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Directory Structure

```
provider-portal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, etc.)
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── collections/
│   │   ├── cases/
│   │   ├── law-firms/
│   │   ├── tranches/
│   │   ├── locations/
│   │   └── reports/
│   ├── api/                      # API routes
│   │   ├── kpi/
│   │   │   └── route.ts
│   │   ├── aging/
│   │   │   └── route.ts
│   │   ├── collections/
│   │   │   └── route.ts
│   │   ├── cases/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── law-firms/
│   │   │   └── route.ts
│   │   ├── tranches/
│   │   │   └── route.ts
│   │   ├── predictions/
│   │   │   └── route.ts
│   │   ├── insights/
│   │   │   └── route.ts
│   │   ├── export/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/                   # React components
│   ├── charts/                   # Reusable chart components
│   │   ├── StandardBarChart.tsx
│   │   ├── StandardLineChart.tsx
│   │   ├── StandardPieChart.tsx
│   │   ├── AgingChart.tsx
│   │   ├── TrendChart.tsx
│   │   └── formatters.ts
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── KPICard.tsx
│   │   ├── KPIGrid.tsx
│   │   ├── AlertBar.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── FilterBar.tsx
│   ├── tables/                   # Data table components
│   │   ├── DataTable.tsx
│   │   ├── CaseTable.tsx
│   │   ├── LawFirmTable.tsx
│   │   └── InvoiceTable.tsx
│   ├── modals/                   # Modal components
│   │   ├── CaseDetailModal.tsx
│   │   ├── DrillDownModal.tsx
│   │   └── ExportModal.tsx
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   └── ui/                       # Base UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Dropdown.tsx
│       └── DatePicker.tsx
├── lib/                          # Shared libraries
│   ├── db.ts                     # Database connection pool
│   ├── auth.ts                   # Auth utilities
│   ├── design-tokens.ts          # Design system constants
│   ├── formatters.ts             # Number/date formatters
│   ├── validators.ts             # Zod schemas
│   └── utils.ts                  # General utilities
├── hooks/                        # Custom React hooks
│   ├── useKPI.ts
│   ├── useAging.ts
│   ├── useCases.ts
│   ├── useFilters.ts
│   └── useExport.ts
├── types/                        # TypeScript type definitions
│   ├── api.ts
│   ├── database.ts
│   ├── components.ts
│   └── index.ts
├── sql/                          # SQL scripts
│   ├── schema/
│   │   ├── 001_create_master_table.sql
│   │   ├── 002_create_indexes.sql
│   │   └── 003_create_materialized_views.sql
│   ├── views/
│   │   ├── kpi_summary_mv.sql
│   │   ├── aging_analysis_mv.sql
│   │   ├── law_firm_performance_mv.sql
│   │   ├── case_status_mv.sql
│   │   └── tranche_performance_mv.sql
│   └── migrations/
├── scripts/                      # Utility scripts
│   ├── import-data.ts
│   ├── refresh-views.ts
│   ├── generate-predictions.ts
│   └── sync-salesforce.ts
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                         # Documentation
│   ├── api-reference.md
│   ├── data-dictionary.md
│   └── deployment.md
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                     # Project rules
```

---

## 3. Database Design

### 3.1 Primary Table Schema

```sql
-- Master data table: Single source of truth
CREATE TABLE provider_master_data (
  -- Primary Key
  id SERIAL PRIMARY KEY,

  -- Salesforce Identifiers
  salesforce_id VARCHAR(50) UNIQUE NOT NULL,
  funding_id VARCHAR(100),

  -- Patient/Case Information
  patient_name VARCHAR(255),
  patient_dob DATE,
  opportunity_id VARCHAR(50),
  opportunity_name VARCHAR(255),
  date_of_accident DATE,

  -- Law Firm Information
  law_firm_id VARCHAR(50),
  law_firm_name VARCHAR(255),
  attorney_name VARCHAR(255),

  -- Provider/Location Hierarchy
  provider_id VARCHAR(50) NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  location_id VARCHAR(50),
  location_name VARCHAR(255),
  region VARCHAR(100),
  state VARCHAR(50),

  -- Financial Fields
  invoice_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  collected_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  write_off_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  open_balance DECIMAL(12,2) GENERATED ALWAYS AS
    (invoice_amount - collected_amount - write_off_amount) STORED,

  -- Key Dates
  invoice_date DATE NOT NULL,
  origination_date DATE,
  settlement_date DATE,
  collection_date DATE,
  cap_date DATE,
  created_at_sf TIMESTAMP,

  -- Status Fields
  funding_stage VARCHAR(100),
  funding_sub_stage VARCHAR(100),
  case_status VARCHAR(100),
  payoff_status VARCHAR(100),
  is_write_off BOOLEAN DEFAULT FALSE,
  write_off_reason VARCHAR(255),

  -- Tranche Information
  tranche_id VARCHAR(50),
  tranche_name VARCHAR(100),
  ar_book_id VARCHAR(50),
  ar_book_name VARCHAR(255),
  ar_type VARCHAR(100),

  -- Insurance Information
  insurance_limits VARCHAR(100),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_amounts CHECK (
    invoice_amount >= 0 AND
    collected_amount >= 0 AND
    write_off_amount >= 0
  ),
  CONSTRAINT valid_dates CHECK (
    (collection_date IS NULL OR settlement_date IS NULL OR collection_date >= settlement_date) AND
    (settlement_date IS NULL OR origination_date IS NULL OR settlement_date >= origination_date)
  )
);

-- Provider lookup table
CREATE TABLE providers (
  id SERIAL PRIMARY KEY,
  provider_id VARCHAR(50) UNIQUE NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  parent_provider_id VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location hierarchy table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  location_id VARCHAR(50) UNIQUE NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  provider_id VARCHAR(50) REFERENCES providers(provider_id),
  region VARCHAR(100),
  state VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Law firm lookup table
CREATE TABLE law_firms (
  id SERIAL PRIMARY KEY,
  law_firm_id VARCHAR(50) UNIQUE NOT NULL,
  law_firm_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tranche definitions table
CREATE TABLE tranches (
  id SERIAL PRIMARY KEY,
  tranche_id VARCHAR(50) UNIQUE NOT NULL,
  tranche_name VARCHAR(100) NOT NULL,
  provider_id VARCHAR(50) REFERENCES providers(provider_id),
  amount_advanced DECIMAL(14,2),
  threshold_1_1x DECIMAL(14,2),
  repayment_threshold DECIMAL(14,2),
  start_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User alerts configuration
CREATE TABLE user_alerts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  threshold_value DECIMAL(12,2),
  is_enabled BOOLEAN DEFAULT TRUE,
  notification_email VARCHAR(255),
  notification_sms VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alert history
CREATE TABLE alert_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  alert_message TEXT,
  related_entity_id VARCHAR(100),
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Predictions storage
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  opportunity_id VARCHAR(50) NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  prediction_type VARCHAR(50) NOT NULL,
  predicted_value DECIMAL(14,2),
  confidence_score DECIMAL(5,4),
  prediction_date DATE NOT NULL,
  actual_value DECIMAL(14,2),
  model_version VARCHAR(50),
  features_used JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Insights storage
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  provider_id VARCHAR(50) NOT NULL,
  insight_type VARCHAR(50) NOT NULL,
  insight_text TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'info',
  related_metrics JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Essential Indexes

```sql
-- Primary lookup indexes
CREATE INDEX idx_master_provider_id ON provider_master_data(provider_id);
CREATE INDEX idx_master_salesforce_id ON provider_master_data(salesforce_id);
CREATE INDEX idx_master_opportunity_id ON provider_master_data(opportunity_id);

-- Date range query indexes
CREATE INDEX idx_master_invoice_date ON provider_master_data(invoice_date);
CREATE INDEX idx_master_dates ON provider_master_data(origination_date, settlement_date, collection_date);

-- Law firm analysis indexes
CREATE INDEX idx_master_law_firm ON provider_master_data(law_firm_id);
CREATE INDEX idx_master_provider_law_firm ON provider_master_data(provider_id, law_firm_id);

-- Status query indexes
CREATE INDEX idx_master_case_status ON provider_master_data(case_status);
CREATE INDEX idx_master_funding_stage ON provider_master_data(funding_stage);
CREATE INDEX idx_master_provider_status ON provider_master_data(provider_id, case_status);

-- Financial query indexes
CREATE INDEX idx_master_open_balance ON provider_master_data(open_balance) WHERE open_balance > 0;
CREATE INDEX idx_master_write_off ON provider_master_data(is_write_off) WHERE is_write_off = TRUE;

-- Tranche indexes
CREATE INDEX idx_master_tranche ON provider_master_data(tranche_id);
CREATE INDEX idx_master_provider_tranche ON provider_master_data(provider_id, tranche_id);

-- Location indexes
CREATE INDEX idx_master_location ON provider_master_data(location_id);
CREATE INDEX idx_master_provider_location ON provider_master_data(provider_id, location_id);

-- Composite index for common dashboard query
CREATE INDEX idx_master_dashboard ON provider_master_data(
  provider_id,
  invoice_date,
  case_status,
  law_firm_id
);
```

### 3.3 Materialized Views

```sql
-- KPI Summary View
CREATE MATERIALIZED VIEW provider_kpi_summary_mv AS
WITH daily_collections AS (
  SELECT
    provider_id,
    AVG(collected_amount) as avg_daily_collection
  FROM provider_master_data
  WHERE collection_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY provider_id
)
SELECT
  m.provider_id,
  p.provider_name,
  -- Invoice metrics
  SUM(m.invoice_amount) as total_invoiced,
  SUM(m.collected_amount) as total_collected,
  SUM(m.write_off_amount) as total_written_off,
  SUM(m.open_balance) as total_open_balance,
  -- Counts
  COUNT(*) as invoice_count,
  COUNT(DISTINCT m.opportunity_id) as case_count,
  COUNT(DISTINCT m.law_firm_id) as law_firm_count,
  -- Rates
  ROUND(
    SUM(m.collected_amount) / NULLIF(SUM(m.invoice_amount - m.write_off_amount), 0) * 100,
    2
  ) as collection_rate,
  -- DSO calculation
  ROUND(
    SUM(m.open_balance) / NULLIF(dc.avg_daily_collection, 0),
    1
  ) as dso_days,
  -- Timestamp
  NOW() as calculated_at
FROM provider_master_data m
JOIN providers p ON m.provider_id = p.provider_id
LEFT JOIN daily_collections dc ON m.provider_id = dc.provider_id
GROUP BY m.provider_id, p.provider_name, dc.avg_daily_collection;

CREATE UNIQUE INDEX idx_kpi_summary_provider ON provider_kpi_summary_mv(provider_id);

-- Aging Analysis View
CREATE MATERIALIZED VIEW aging_analysis_mv AS
SELECT
  provider_id,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date <= 30 THEN open_balance
    ELSE 0
  END) as current_0_30,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date BETWEEN 31 AND 60 THEN open_balance
    ELSE 0
  END) as days_31_60,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date BETWEEN 61 AND 90 THEN open_balance
    ELSE 0
  END) as days_61_90,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date BETWEEN 91 AND 180 THEN open_balance
    ELSE 0
  END) as days_91_180,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date BETWEEN 181 AND 365 THEN open_balance
    ELSE 0
  END) as days_181_365,
  SUM(CASE
    WHEN CURRENT_DATE - invoice_date > 365 THEN open_balance
    ELSE 0
  END) as days_over_365,
  SUM(open_balance) as total_open,
  COUNT(*) FILTER (WHERE open_balance > 0) as open_invoice_count,
  NOW() as calculated_at
FROM provider_master_data
WHERE open_balance > 0
GROUP BY provider_id;

CREATE UNIQUE INDEX idx_aging_provider ON aging_analysis_mv(provider_id);

-- Law Firm Performance View
CREATE MATERIALIZED VIEW law_firm_performance_mv AS
SELECT
  m.provider_id,
  m.law_firm_id,
  lf.law_firm_name,
  -- Volume metrics
  COUNT(DISTINCT m.opportunity_id) as case_count,
  COUNT(*) as invoice_count,
  -- Financial metrics
  SUM(m.invoice_amount) as total_invoiced,
  SUM(m.collected_amount) as total_collected,
  SUM(m.write_off_amount) as total_written_off,
  SUM(m.open_balance) as total_open,
  -- Rates
  ROUND(
    SUM(m.collected_amount) / NULLIF(SUM(m.invoice_amount), 0) * 100,
    2
  ) as collection_rate,
  ROUND(
    SUM(m.write_off_amount) / NULLIF(SUM(m.invoice_amount), 0) * 100,
    2
  ) as write_off_rate,
  -- Duration metrics (in days)
  ROUND(
    AVG(CASE
      WHEN m.settlement_date IS NOT NULL AND m.origination_date IS NOT NULL
      THEN m.settlement_date - m.origination_date
      ELSE NULL
    END),
    1
  ) as avg_case_duration_days,
  ROUND(
    AVG(CASE
      WHEN m.collection_date IS NOT NULL AND m.settlement_date IS NOT NULL
      THEN m.collection_date - m.settlement_date
      ELSE NULL
    END),
    1
  ) as avg_time_to_payment_days,
  -- Status distribution
  COUNT(*) FILTER (WHERE m.case_status = 'In Litigation') as in_litigation_count,
  COUNT(*) FILTER (WHERE m.case_status = 'Settled - Not Yet Disbursed') as settled_pending_count,
  COUNT(*) FILTER (WHERE m.case_status = 'Case Closed Payment Disbursed') as closed_paid_count,
  NOW() as calculated_at
FROM provider_master_data m
LEFT JOIN law_firms lf ON m.law_firm_id = lf.law_firm_id
WHERE m.law_firm_id IS NOT NULL
GROUP BY m.provider_id, m.law_firm_id, lf.law_firm_name;

CREATE UNIQUE INDEX idx_law_firm_perf ON law_firm_performance_mv(provider_id, law_firm_id);

-- Case Status Distribution View
CREATE MATERIALIZED VIEW case_status_distribution_mv AS
SELECT
  provider_id,
  case_status,
  COUNT(DISTINCT opportunity_id) as case_count,
  SUM(invoice_amount) as total_invoiced,
  SUM(open_balance) as total_open,
  ROUND(
    AVG(CURRENT_DATE - origination_date),
    1
  ) as avg_age_days,
  NOW() as calculated_at
FROM provider_master_data
GROUP BY provider_id, case_status;

CREATE UNIQUE INDEX idx_case_status ON case_status_distribution_mv(provider_id, case_status);

-- Tranche Performance View
CREATE MATERIALIZED VIEW tranche_performance_mv AS
SELECT
  m.provider_id,
  m.tranche_id,
  t.tranche_name,
  t.amount_advanced,
  t.threshold_1_1x,
  t.repayment_threshold,
  t.start_date,
  -- Performance metrics
  SUM(m.collected_amount) as total_collected,
  ROUND(
    SUM(m.collected_amount) / NULLIF(t.amount_advanced, 0) * 100,
    2
  ) as repayment_percentage,
  -- Progress indicators
  CASE
    WHEN SUM(m.collected_amount) >= t.repayment_threshold THEN 'Fully Repaid'
    WHEN SUM(m.collected_amount) >= t.threshold_1_1x THEN 'Above 1.1x'
    ELSE 'In Progress'
  END as repayment_status,
  -- Case metrics
  COUNT(DISTINCT m.opportunity_id) as case_count,
  COUNT(*) as invoice_count,
  NOW() as calculated_at
FROM provider_master_data m
JOIN tranches t ON m.tranche_id = t.tranche_id
WHERE m.tranche_id IS NOT NULL
GROUP BY
  m.provider_id,
  m.tranche_id,
  t.tranche_name,
  t.amount_advanced,
  t.threshold_1_1x,
  t.repayment_threshold,
  t.start_date;

CREATE UNIQUE INDEX idx_tranche_perf ON tranche_performance_mv(provider_id, tranche_id);

-- Monthly Trends View
CREATE MATERIALIZED VIEW monthly_trends_mv AS
SELECT
  provider_id,
  DATE_TRUNC('month', invoice_date)::DATE as month,
  SUM(invoice_amount) as invoiced,
  SUM(collected_amount) as collected,
  SUM(write_off_amount) as written_off,
  COUNT(*) as invoice_count,
  COUNT(DISTINCT opportunity_id) as case_count,
  ROUND(
    SUM(collected_amount) / NULLIF(SUM(invoice_amount), 0) * 100,
    2
  ) as collection_rate,
  NOW() as calculated_at
FROM provider_master_data
WHERE invoice_date >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY provider_id, DATE_TRUNC('month', invoice_date)
ORDER BY provider_id, month;

CREATE UNIQUE INDEX idx_monthly_trends ON monthly_trends_mv(provider_id, month);
```

### 3.4 View Refresh Function

```sql
-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
DECLARE
  view_name text;
  start_time timestamp;
  end_time timestamp;
BEGIN
  FOR view_name IN
    SELECT matviewname FROM pg_matviews WHERE schemaname = 'public'
  LOOP
    start_time := clock_timestamp();
    EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', view_name);
    end_time := clock_timestamp();
    RAISE NOTICE 'Refreshed % in %', view_name, end_time - start_time;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (using pg_cron or external scheduler)
-- SELECT cron.schedule('refresh-views', '*/15 * * * *', 'SELECT refresh_all_materialized_views()');
```

---

## 4. API Design

### 4.1 Database Connection Pool

```typescript
// lib/db.ts
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

// Singleton pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,

  // Connection pool settings
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 60000,
  query_timeout: 60000,

  allowExitOnIdle: true,
});

// Attach to Vercel serverless lifecycle
attachDatabasePool(pool);

// Export utilities
export { pool };

export const query = <T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> => pool.query(text, params);

export const getClient = () => pool.connect();

export const transaction = async <T>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
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

### 4.2 API Route Pattern

```typescript
// app/api/kpi/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

// Response caching
export const revalidate = 60; // Cache for 60 seconds

// Query params validation
const querySchema = z.object({
  providerId: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate query params
    const searchParams = request.nextUrl.searchParams;
    const params = querySchema.parse({
      providerId: searchParams.get('providerId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    });

    // Fetch from materialized view (pre-calculated)
    const result = await query<KPISummary>(
      `SELECT * FROM provider_kpi_summary_mv WHERE provider_id = $1`,
      [params.providerId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Return with metadata
    return NextResponse.json({
      data: result.rows[0],
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'PostgreSQL_MaterializedView',
        calculationsInDatabase: true,
        apiPassthroughOnly: true,
      },
    });
  } catch (error) {
    console.error('KPI API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4.3 API Endpoints Reference

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/kpi` | GET | KPI summary for provider | KPISummary |
| `/api/aging` | GET | Aging analysis buckets | AgingAnalysis |
| `/api/collections` | GET | Collection trends and details | CollectionData[] |
| `/api/cases` | GET | Case listing with pagination | PaginatedCases |
| `/api/cases/[id]` | GET | Single case detail | CaseDetail |
| `/api/law-firms` | GET | Law firm performance | LawFirmPerformance[] |
| `/api/law-firms/[id]` | GET | Single law firm detail | LawFirmDetail |
| `/api/tranches` | GET | Tranche performance | TranchePerformance[] |
| `/api/locations` | GET | Location hierarchy and metrics | LocationData[] |
| `/api/predictions` | GET | AI predictions for cases | Predictions[] |
| `/api/insights` | GET | AI-generated insights | Insights[] |
| `/api/alerts` | GET | User alert history | Alerts[] |
| `/api/alerts` | POST | Create/update alert config | AlertConfig |
| `/api/export` | POST | Generate data export | ExportFile |
| `/api/health` | GET | System health check | HealthStatus |

### 4.4 Type Definitions

```typescript
// types/api.ts

export interface KPISummary {
  providerId: string;
  providerName: string;
  totalInvoiced: number;
  totalCollected: number;
  totalWrittenOff: number;
  totalOpenBalance: number;
  invoiceCount: number;
  caseCount: number;
  lawFirmCount: number;
  collectionRate: number;
  dsoDays: number;
  calculatedAt: string;
}

export interface AgingAnalysis {
  providerId: string;
  current0_30: number;
  days31_60: number;
  days61_90: number;
  days91_180: number;
  days181_365: number;
  daysOver365: number;
  totalOpen: number;
  openInvoiceCount: number;
  calculatedAt: string;
}

export interface LawFirmPerformance {
  providerId: string;
  lawFirmId: string;
  lawFirmName: string;
  caseCount: number;
  invoiceCount: number;
  totalInvoiced: number;
  totalCollected: number;
  totalWrittenOff: number;
  totalOpen: number;
  collectionRate: number;
  writeOffRate: number;
  avgCaseDurationDays: number;
  avgTimeToPaymentDays: number;
  inLitigationCount: number;
  settledPendingCount: number;
  closedPaidCount: number;
  calculatedAt: string;
}

export interface CaseDetail {
  opportunityId: string;
  patientName: string;
  lawFirmName: string;
  attorneyName: string;
  caseStatus: string;
  dateOfAccident: string;
  originationDate: string;
  settlementDate: string | null;
  invoices: Invoice[];
  collections: Collection[];
  statusHistory: StatusChange[];
  predictions: CasePrediction | null;
}

export interface TranchePerformance {
  providerId: string;
  trancheId: string;
  trancheName: string;
  amountAdvanced: number;
  threshold1_1x: number;
  repaymentThreshold: number;
  startDate: string;
  totalCollected: number;
  repaymentPercentage: number;
  repaymentStatus: 'In Progress' | 'Above 1.1x' | 'Fully Repaid';
  caseCount: number;
  invoiceCount: number;
  irr: number | null;
  calculatedAt: string;
}

export interface Insight {
  id: string;
  providerId: string;
  insightType: string;
  insightText: string;
  priority: 'critical' | 'warning' | 'info';
  relatedMetrics: Record<string, any>;
  isActive: boolean;
  validUntil: string;
  createdAt: string;
}

export interface Prediction {
  opportunityId: string;
  predictionType: 'settlement_probability' | 'settlement_value' | 'settlement_date';
  predictedValue: number;
  confidenceScore: number;
  predictionDate: string;
  actualValue: number | null;
  modelVersion: string;
}

export interface ApiResponse<T> {
  data: T;
  metadata: {
    generatedAt: string;
    dataSource: string;
    calculationsInDatabase: boolean;
    apiPassthroughOnly: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

---

## 5. Frontend Architecture

### 5.1 Design Token System

```typescript
// lib/design-tokens.ts

export const COLORS = {
  // Brand colors
  primary: {
    main: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1E40AF',
    contrast: '#FFFFFF',
  },

  // Semantic colors
  success: {
    main: '#10B981',
    light: '#D1FAE5',
    dark: '#047857',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#B45309',
    contrast: '#000000',
  },
  danger: {
    main: '#EF4444',
    light: '#FEE2E2',
    dark: '#B91C1C',
    contrast: '#FFFFFF',
  },
  info: {
    main: '#6366F1',
    light: '#E0E7FF',
    dark: '#4338CA',
    contrast: '#FFFFFF',
  },

  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Risk grades
  grades: {
    A: '#10B981', // Excellent - Green
    B: '#3B82F6', // Good - Blue
    C: '#6B7280', // Average - Gray
    D: '#F59E0B', // Below Average - Yellow
    E: '#EF4444', // Poor - Red
  },

  // Chart colors
  chart: {
    primary: '#3B82F6',
    secondary: '#10B981',
    tertiary: '#F59E0B',
    quaternary: '#EF4444',
    quinary: '#8B5CF6',
    senary: '#EC4899',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'].join(', '),
    mono: ['JetBrains Mono', 'monospace'].join(', '),
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SPACING = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem', // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};
```

### 5.2 Reusable Chart Component

```typescript
// components/charts/StandardBarChart.tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { COLORS } from '@/lib/design-tokens';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface StandardBarChartProps {
  data: any[];
  xKey: string;
  yKey: string | string[];
  title?: string;
  colors?: string[];
  formatter?: 'currency' | 'percentage' | 'number';
  showLegend?: boolean;
  showGrid?: boolean;
  targetLine?: number;
  targetLabel?: string;
  height?: number;
}

export function StandardBarChart({
  data,
  xKey,
  yKey,
  title,
  colors = [COLORS.chart.primary, COLORS.chart.secondary],
  formatter = 'number',
  showLegend = false,
  showGrid = true,
  targetLine,
  targetLabel,
  height = 300,
}: StandardBarChartProps) {
  const formatValue = (value: number) => {
    switch (formatter) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return value.toLocaleString();
    }
  };

  const yKeys = Array.isArray(yKey) ? yKey : [yKey];

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-neutral-600 mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.neutral[200]} />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: COLORS.neutral[500] }}
            tickLine={false}
            axisLine={{ stroke: COLORS.neutral[300] }}
          />
          <YAxis
            tickFormatter={formatValue}
            tick={{ fontSize: 12, fill: COLORS.neutral[500] }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={formatValue}
            contentStyle={{
              backgroundColor: COLORS.neutral[800],
              border: 'none',
              borderRadius: '8px',
              color: COLORS.neutral[50],
            }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="rect"
              iconSize={10}
            />
          )}
          {targetLine !== undefined && (
            <ReferenceLine
              y={targetLine}
              stroke={COLORS.danger.main}
              strokeDasharray="5 5"
              label={{
                value: targetLabel || `Target: ${formatValue(targetLine)}`,
                fill: COLORS.danger.main,
                fontSize: 12,
              }}
            />
          )}
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 5.3 KPI Card Component

```typescript
// components/dashboard/KPICard.tsx
'use client';

import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { COLORS } from '@/lib/design-tokens';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'currency' | 'percentage' | 'number' | 'days';
  previousValue?: number;
  comparisonLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendIsGood?: boolean; // Is upward trend good or bad?
  onClick?: () => void;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  format = 'number',
  previousValue,
  comparisonLabel = 'vs. last period',
  trend,
  trendIsGood = true,
  onClick,
  loading = false,
}: KPICardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'days':
        return `${formatNumber(val)} days`;
      default:
        return formatNumber(val);
    }
  };

  const calculateChange = () => {
    if (previousValue === undefined || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const determinedTrend = trend || (change === null ? 'neutral' : change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');

  const getTrendColor = () => {
    if (determinedTrend === 'neutral') return COLORS.neutral[500];
    const isPositive = determinedTrend === 'up';
    if (trendIsGood) {
      return isPositive ? COLORS.success.main : COLORS.danger.main;
    }
    return isPositive ? COLORS.danger.main : COLORS.success.main;
  };

  const TrendIcon = determinedTrend === 'up' ? ArrowUpIcon : determinedTrend === 'down' ? ArrowDownIcon : MinusIcon;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
        <div className="h-4 w-24 bg-neutral-200 rounded mb-3" />
        <div className="h-8 w-32 bg-neutral-200 rounded mb-2" />
        <div className="h-3 w-20 bg-neutral-200 rounded" />
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-lg border border-neutral-200 p-4
        hover:shadow-md transition-shadow
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-neutral-900">
          {formatValue(value)}
        </span>
      </div>

      {change !== null && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon
            size={14}
            color={getTrendColor()}
          />
          <span
            className="text-sm font-medium"
            style={{ color: getTrendColor() }}
          >
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-xs text-neutral-400">{comparisonLabel}</span>
        </div>
      )}
    </div>
  );
}
```

### 5.4 Data Table Component

```typescript
// components/tables/DataTable.tsx
'use client';

import { useState, useMemo } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { COLORS } from '@/lib/design-tokens';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  formatter?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getValue = (row: T, key: string) => {
    const keys = key.split('.');
    let value: any = row;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-neutral-200 rounded mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-neutral-100 rounded mb-1" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider
                    ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                    ${column.sortable ? 'cursor-pointer hover:bg-neutral-50' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc'
                        ? <ChevronUpIcon size={14} />
                        : <ChevronDownIcon size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  border-b border-neutral-100
                  ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = getValue(row, String(column.key));
                  return (
                    <td
                      key={String(column.key)}
                      className={`
                        px-4 py-3 text-sm text-neutral-900
                        ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                      `}
                    >
                      {column.formatter ? column.formatter(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200">
          <span className="text-sm text-neutral-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <span className="text-sm text-neutral-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Authentication & Security

### 6.1 Clerk Configuration

```typescript
// lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs/server';

export interface UserContext {
  userId: string;
  providerId: string;
  role: 'provider_admin' | 'provider_viewer' | 'gain_admin' | 'gain_case_manager';
  email: string;
}

export async function getUserContext(): Promise<UserContext | null> {
  const { userId } = auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Get provider mapping from user metadata
  const providerId = user.publicMetadata.providerId as string;
  const role = user.publicMetadata.role as UserContext['role'];

  return {
    userId,
    providerId,
    role,
    email: user.primaryEmailAddress?.emailAddress || '',
  };
}

export function requireAuth() {
  const { userId } = auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function requireProviderAccess(requestedProviderId: string): Promise<void> {
  const context = await getUserContext();
  if (!context) {
    throw new Error('Unauthorized');
  }

  // GAIN admins can access any provider
  if (context.role === 'gain_admin') return;

  // Provider users can only access their own data
  if (context.providerId !== requestedProviderId) {
    throw new Error('Forbidden');
  }
}
```

### 6.2 Middleware Configuration

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/webhook(.*)',
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

### 6.3 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 7. Data Pipeline

### 7.1 Data Import Script

```typescript
// scripts/import-data.ts
import { pool, transaction } from '@/lib/db';
import Papa from 'papaparse';
import fs from 'fs';

const CHUNK_SIZE = 5000;

interface ImportResult {
  success: boolean;
  recordsProcessed: number;
  recordsFailed: number;
  errors: string[];
}

async function importData(csvFilePath: string): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    recordsProcessed: 0,
    recordsFailed: 0,
    errors: [],
  };

  // Read and parse CSV
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  if (parsed.errors.length > 0) {
    result.errors.push(...parsed.errors.map((e) => e.message));
  }

  const records = parsed.data;
  const totalChunks = Math.ceil(records.length / CHUNK_SIZE);

  console.log(`Processing ${records.length} records in ${totalChunks} chunks...`);

  // Process in chunks
  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;

    try {
      await transaction(async (client) => {
        for (const row of chunk) {
          const cleanedRow = cleanRecord(row);

          await client.query(
            `INSERT INTO provider_master_data (
              salesforce_id, funding_id, patient_name, opportunity_id, opportunity_name,
              date_of_accident, law_firm_id, law_firm_name, attorney_name,
              provider_id, provider_name, location_id, location_name, state,
              invoice_amount, collected_amount, write_off_amount,
              invoice_date, origination_date, settlement_date, collection_date,
              funding_stage, case_status, payoff_status, is_write_off, write_off_reason,
              tranche_id, tranche_name, ar_book_name, ar_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
            ON CONFLICT (salesforce_id) DO UPDATE SET
              collected_amount = EXCLUDED.collected_amount,
              write_off_amount = EXCLUDED.write_off_amount,
              case_status = EXCLUDED.case_status,
              payoff_status = EXCLUDED.payoff_status,
              settlement_date = EXCLUDED.settlement_date,
              collection_date = EXCLUDED.collection_date,
              updated_at = NOW()`,
            [
              cleanedRow.salesforce_id,
              cleanedRow.funding_id,
              cleanedRow.patient_name,
              cleanedRow.opportunity_id,
              cleanedRow.opportunity_name,
              cleanedRow.date_of_accident,
              cleanedRow.law_firm_id,
              cleanedRow.law_firm_name,
              cleanedRow.attorney_name,
              cleanedRow.provider_id,
              cleanedRow.provider_name,
              cleanedRow.location_id,
              cleanedRow.location_name,
              cleanedRow.state,
              cleanedRow.invoice_amount,
              cleanedRow.collected_amount,
              cleanedRow.write_off_amount,
              cleanedRow.invoice_date,
              cleanedRow.origination_date,
              cleanedRow.settlement_date,
              cleanedRow.collection_date,
              cleanedRow.funding_stage,
              cleanedRow.case_status,
              cleanedRow.payoff_status,
              cleanedRow.is_write_off,
              cleanedRow.write_off_reason,
              cleanedRow.tranche_id,
              cleanedRow.tranche_name,
              cleanedRow.ar_book_name,
              cleanedRow.ar_type,
            ]
          );
          result.recordsProcessed++;
        }
      });

      console.log(`Chunk ${chunkNum}/${totalChunks} completed (${chunk.length} records)`);
    } catch (error) {
      result.recordsFailed += chunk.length;
      result.errors.push(`Chunk ${chunkNum} failed: ${error}`);
      console.error(`Chunk ${chunkNum} failed:`, error);
    }
  }

  // Refresh materialized views after import
  console.log('Refreshing materialized views...');
  await pool.query('SELECT refresh_all_materialized_views()');

  result.success = result.recordsFailed === 0;
  return result;
}

function cleanRecord(row: any): any {
  return {
    salesforce_id: cleanString(row.fid || row.salesforce_id),
    funding_id: cleanString(row.fname || row.funding_id),
    patient_name: cleanString(row.opname || row.patient_name),
    opportunity_id: cleanString(row.opid || row.opportunity_id),
    opportunity_name: cleanString(row.opportunity_name),
    date_of_accident: cleanDate(row.date_of_accident__c || row.date_of_accident),
    law_firm_id: cleanString(row.accountid || row.law_firm_id),
    law_firm_name: cleanString(row.law_firm_account_name__c || row.law_firm_name),
    attorney_name: cleanString(row.attorneyname || row.attorney_name),
    provider_id: cleanString(row.paid || row.provider_id),
    provider_name: cleanString(row.paname || row.provider_name),
    location_id: cleanString(row.medlocale || row.location_id),
    location_name: cleanString(row.mfname || row.location_name),
    state: cleanString(row.billingstate || row.state),
    invoice_amount: cleanNumber(row.total_invoice_amount || row.open_invoice || row.invoice_amount),
    collected_amount: cleanNumber(row.total_amount_collected || row.settled || row.collected_amount),
    write_off_amount: cleanNumber(row.write_off || row.write_off_amount),
    invoice_date: cleanDate(row.invoice_date || row.invoice_date2),
    origination_date: cleanDate(row.origination_date__c || row.origination_date),
    settlement_date: cleanDate(row.cap_date__c || row.settlement_date),
    collection_date: cleanDate(row.date_deposited_1__c || row.collection_date),
    funding_stage: cleanString(row.funding_stage__c || row.funding_stage),
    case_status: cleanString(row.case_status__c || row.case_status),
    payoff_status: cleanString(row.payoff_status__c || row.payoff_status),
    is_write_off: row.iswriteoff === 'TRUE' || row.is_write_off === true,
    write_off_reason: cleanString(row.cap_writeoff_reason__c || row.write_off_reason),
    tranche_id: cleanString(row.arbookid || row.tranche_id),
    tranche_name: cleanString(row.tranche_name),
    ar_book_name: cleanString(row.arbookname || row.ar_book_name),
    ar_type: cleanString(row.ar_type__c || row.ar_type),
  };
}

function cleanString(value: any): string | null {
  if (value === null || value === undefined || value === '') return null;
  const str = String(value).trim();
  if (str === '' || str === '-' || str.toLowerCase() === 'null') return null;
  return str;
}

function cleanNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const str = String(value).replace(/[$,]/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function cleanDate(value: any): string | null {
  if (value === null || value === undefined || value === '') return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

export { importData };
```

### 7.2 View Refresh Script

```typescript
// scripts/refresh-views.ts
import { pool } from '@/lib/db';

const VIEWS = [
  'provider_kpi_summary_mv',
  'aging_analysis_mv',
  'law_firm_performance_mv',
  'case_status_distribution_mv',
  'tranche_performance_mv',
  'monthly_trends_mv',
];

async function refreshViews() {
  console.log('Starting materialized view refresh...');
  const startTime = Date.now();

  for (const view of VIEWS) {
    const viewStart = Date.now();
    try {
      await pool.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`);
      console.log(`  ✓ ${view} refreshed in ${Date.now() - viewStart}ms`);
    } catch (error) {
      console.error(`  ✗ ${view} failed:`, error);
    }
  }

  console.log(`\nTotal refresh time: ${Date.now() - startTime}ms`);
}

refreshViews();
```

---

## 8. AI/ML Infrastructure

### 8.1 Prediction Model Interface

```typescript
// lib/predictions.ts
import { query } from '@/lib/db';

interface PredictionInput {
  opportunityId: string;
  caseAgedays: number;
  lawFirmCollectionRate: number;
  caseStatus: string;
  invoiceAmount: number;
  state: string;
}

interface SettlementPrediction {
  probability: number;
  expectedValue: number;
  expectedDateDays: number;
  confidenceScore: number;
  keyFactors: string[];
}

export async function getSettlementPrediction(
  input: PredictionInput
): Promise<SettlementPrediction> {
  // Call prediction model (external API or in-database)
  // For MVP, use rule-based heuristics

  const baseProb = 0.6;
  let probability = baseProb;
  const keyFactors: string[] = [];

  // Adjust based on case age
  if (input.caseAgedays > 365) {
    probability += 0.15;
    keyFactors.push('Case age > 1 year');
  } else if (input.caseAgedays > 180) {
    probability += 0.1;
    keyFactors.push('Case age > 6 months');
  }

  // Adjust based on law firm performance
  if (input.lawFirmCollectionRate > 75) {
    probability += 0.1;
    keyFactors.push('High-performing law firm');
  } else if (input.lawFirmCollectionRate < 50) {
    probability -= 0.1;
    keyFactors.push('Below-average law firm');
  }

  // Adjust based on case status
  if (input.caseStatus === 'Negotiation') {
    probability += 0.2;
    keyFactors.push('In negotiation');
  } else if (input.caseStatus === 'In Litigation') {
    probability -= 0.1;
    keyFactors.push('In litigation');
  }

  // Cap probability
  probability = Math.max(0.1, Math.min(0.95, probability));

  // Calculate expected value
  const expectedCollectionRate = input.lawFirmCollectionRate / 100;
  const expectedValue = input.invoiceAmount * expectedCollectionRate * probability;

  // Estimate days to settlement
  const baseDays = input.caseStatus === 'Negotiation' ? 60 : 180;
  const expectedDateDays = Math.max(30, baseDays - (input.caseAgedays * 0.1));

  return {
    probability,
    expectedValue,
    expectedDateDays,
    confidenceScore: 0.7, // Fixed for rule-based model
    keyFactors,
  };
}

export async function generateInsights(providerId: string): Promise<void> {
  // Fetch current metrics
  const kpi = await query(
    `SELECT * FROM provider_kpi_summary_mv WHERE provider_id = $1`,
    [providerId]
  );

  // Fetch trends
  const trends = await query(
    `SELECT * FROM monthly_trends_mv
     WHERE provider_id = $1
     ORDER BY month DESC
     LIMIT 3`,
    [providerId]
  );

  // Generate insights based on patterns
  const insights: string[] = [];

  // Collection rate insight
  if (trends.rows.length >= 2) {
    const current = trends.rows[0].collection_rate;
    const previous = trends.rows[1].collection_rate;
    const change = current - previous;

    if (Math.abs(change) > 5) {
      insights.push(
        `Your collection rate ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month.`
      );
    }
  }

  // DSO insight
  if (kpi.rows[0]?.dso_days > 150) {
    insights.push(
      `Your DSO of ${kpi.rows[0].dso_days} days is above the industry target of 150 days. Consider reviewing aging receivables.`
    );
  }

  // Store insights
  for (const text of insights) {
    await query(
      `INSERT INTO insights (provider_id, insight_type, insight_text, priority)
       VALUES ($1, 'automated', $2, 'info')
       ON CONFLICT DO NOTHING`,
      [providerId, text]
    );
  }
}
```

---

## 9. DevOps & Deployment

### 9.1 Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI Services
OPENAI_API_KEY=sk-xxx

# Feature Flags
ENABLE_PREDICTIONS=true
ENABLE_INSIGHTS=true

# Monitoring
DATADOG_API_KEY=xxx
```

### 9.2 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/refresh-views",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/generate-insights",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 9.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 10. Performance Optimization

### 10.1 Query Optimization Checklist

- [ ] All materialized views have appropriate indexes
- [ ] JOIN columns have indexes
- [ ] Date range queries use indexed date columns
- [ ] EXPLAIN ANALYZE used for complex queries
- [ ] Query timeout set (60 seconds max)

### 10.2 Frontend Optimization

- [ ] React Query for data caching
- [ ] Suspense boundaries for loading states
- [ ] Dynamic imports for heavy components
- [ ] Image optimization
- [ ] Bundle size monitoring (<500KB initial)

### 10.3 Caching Strategy

| Layer | Technology | TTL | Use Case |
|-------|------------|-----|----------|
| Browser | React Query | 60s | API responses |
| CDN | Vercel Edge | 60s | Static assets |
| API | Response headers | 60s | KPI endpoints |
| Database | Materialized views | 15min | Pre-computed metrics |

---

## 11. Monitoring & Observability

### 11.1 Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      views: 'unknown',
    },
  };

  try {
    // Check database connection
    const dbResult = await pool.query('SELECT 1 as check');
    health.checks.database = dbResult.rows.length > 0 ? 'healthy' : 'unhealthy';

    // Check materialized views freshness
    const viewResult = await pool.query(
      `SELECT calculated_at FROM provider_kpi_summary_mv LIMIT 1`
    );
    if (viewResult.rows.length > 0) {
      const lastRefresh = new Date(viewResult.rows[0].calculated_at);
      const minutesAgo = (Date.now() - lastRefresh.getTime()) / 60000;
      health.checks.views = minutesAgo < 30 ? 'healthy' : 'stale';
    }
  } catch (error) {
    health.status = 'unhealthy';
    health.checks.database = 'error';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
```

### 11.2 Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API response time (p95) | <2s | >5s |
| Dashboard load time | <3s | >8s |
| Database connection pool usage | <80% | >90% |
| Materialized view freshness | <30min | >60min |
| Error rate | <0.1% | >1% |
| Data reconciliation accuracy | 100% | <99% |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 9, 2025 | Saul Mateos | Initial technical specification |
