# Enhanced Provider Portal PRD
## Product Requirements Document

**Version**: 1.1
**Date**: December 9, 2025
**Author**: Saul Mateos, CFO
**Status**: Draft for Review
**Latest Update**: Added comprehensive portal assessment (see Appendix E)

---

## Executive Summary

This PRD defines the requirements for a significantly enhanced Provider Portal that transforms GAIN's current reporting tool into an intelligent, predictive analytics platform. The enhanced portal addresses critical data integrity issues, introduces AI-powered insights, and delivers a unified "single source of truth" experience for healthcare providers managing their personal injury receivables portfolio.

**Current State**: SaaS-based dashboard with fragmented data sources, limited interactivity, and retrospective-only reporting. Based on comprehensive portal assessment (Appendix E), the current system effectively tracks financial and operational metrics but reveals concerning trends requiring strategic intervention:
* Case duration increased 6x (2.9 → 17.5 months)
* Time-to-payment increased 3.5x (4.5 → 15.9 months)
* Collection rates highly variable (42% to 91% across law firms)
* Missing critical RCM metrics (DSO, aging analysis, predictive analytics)

**Target State**: AI-enhanced platform with unified data architecture, predictive analytics, real-time insights, and automated workflow recommendations that shifts the portal from "reporting tool" to "optimization engine."

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [Current State Analysis](#4-current-state-analysis)
5. [Functional Requirements](#5-functional-requirements)
6. [Data Architecture Requirements](#6-data-architecture-requirements)
7. [AI & Predictive Analytics Requirements](#7-ai--predictive-analytics-requirements)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Integration Requirements](#9-integration-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Implementation Phases](#11-implementation-phases)
12. [Risk Assessment](#12-risk-assessment)
13. [Appendices](#13-appendices)

---

## 1. Problem Statement

### 1.1 Core Issues Identified

#### Data Integrity Issues
- **Fragmented Data Sources**: Invoice and Collections reports exist as separate, disconnected data sources
- **Data Reconciliation Failures**: Open invoice balance calculated from both reports does not match portal-displayed balance
- **Opaque Filtering**: Users cannot see what data is being excluded via Power BI filters (e.g., ATI invoice amounts change monthly without explanation)
- **Redundant Date Fields**: Raw data exports include Year, Month, and Date columns separately, creating manipulation difficulties
- **Inaccurate Metrics**: Provider AR balances, aging, and partial advance tranche balances appear incorrect

#### Visualization & UX Issues
- **No Centralized Dashboard**: Metrics scattered across multiple views without unified experience
- **Limited Time Period Views**: Open invoice balance only viewable as of current date (no historical comparison)
- **Poor Data Accessibility**: Must hover on charts to see actual numbers
- **Static Law Firm Views**: Pie charts instead of dynamic, queryable analytics
- **No Location Hierarchy**: Cannot view data by location, region, or entity grouping

#### Missing Capabilities
- **No Predictive Analytics**: Dashboard shows "what happened" but not "what will happen"
- **No DSO Calculation**: Missing critical Days Sales Outstanding metric
- **No Aging Analysis**: No receivables bucketing by age (0-30, 31-60, 61-90, 91-180, 180+ days)
- **No Comparative Benchmarking**: Provider cannot compare performance against GAIN portfolio averages
- **No Alert System**: Providers must log in to check status; no proactive notifications
- **No Export Functionality**: Cannot download data for custom analysis
- **No Drill-Down Navigation**: Cannot click to see case-level or invoice-level detail

### 1.2 Business Impact

**Source**: Detailed analysis in Portal Assessment (Appendix E)

| Issue | Impact | Root Cause Analysis |
|-------|--------|-------------------|
| Data integrity problems | Erodes provider trust; undermines "source of truth" positioning | Fragmented data sources (separate Invoice/Collections reports), opaque Power BI filtering, reconciliation failures |
| Case duration increase (2.9 → 17.5 months) | **6x deterioration** strains working capital; tests provider patience and loyalty | Potential: tort reform (GA SB 196/197), case mix shift to higher severity, court backlogs, defense attorney delays |
| Time-to-payment increase (4.5 → 15.9 months) | **3.5x deterioration** increases provider churn risk; compounds cash flow pressure | Primary: Medicare/Medicaid lien resolution delays; Secondary: disbursement process inefficiencies |
| No predictive capabilities | Fails to justify "AI-enhanced" market positioning; portal is "reporting tool" not "optimization engine" | Missing AI/ML models despite 200K historical case dataset available for training |
| Manual reconciliation required | Increases provider operational burden; generates case manager inquiry volume | No single source of truth; must cross-reference multiple exports to validate portal displays |
| Collection rate variance (42% to 91%) | 49 percentage point spread creates law firm relationship risk | Inconsistent case quality, settlement negotiation capabilities, or billing practices across firms |
| Law firm concentration risk | BD&J, PC ($247K) is 2x larger than #2 firm; loss would materially impact revenue | Portfolio not diversified; top 5 law firms represent significant concentration |

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals

| Goal | Description |
|------|-------------|
| **Single Source of Truth** | Unified data model where all metrics derive from one authoritative source |
| **Data Accuracy** | 100% reconciliation between portal displays and downloadable raw data |
| **Predictive Intelligence** | AI-powered forecasting of settlement probability, expected value, and payment timing |
| **Provider Self-Service** | Eliminate need to contact GAIN for routine data questions |
| **Operational Excellence** | Reduce case duration and time-to-payment through proactive insights |

### 2.2 Success Metrics

| Metric | Current State | Target State | Measurement Method |
|--------|--------------|--------------|-------------------|
| Data reconciliation accuracy | Unknown (reports don't match) | 100% | Automated reconciliation checks |
| Provider portal logins/month | Baseline TBD | +50% | Analytics tracking |
| Time to answer data questions | Manual (contact required) | <30 seconds (self-service) | User testing |
| Provider NPS | Baseline TBD | +20 points | Quarterly survey |
| Case manager inquiry volume | Baseline TBD | -40% | Case management system |
| Predicted vs. actual settlement variance | N/A | <15% | Model accuracy tracking |

---

## 3. User Personas

### 3.1 Primary Persona: Provider Finance Lead (e.g., Therapy Partners CFO)

**Demographics**:
- Healthcare finance professional
- Manages $19M+ in receivables
- Reports to executive leadership
- Interacts with law firms on collections

**Goals**:
- Understand current AR position and cash flow projections
- Identify high-risk and high-performing law firm relationships
- Track partial advance tranche performance
- Generate reports for board/investor presentations

**Pain Points**:
- Cannot trust portal data accuracy
- Manual reconciliation between multiple reports
- No historical trend comparison
- Cannot drill into case-level detail

**Success Criteria**:
- Single dashboard answers 90% of questions
- Data exports match portal displays exactly
- Can generate board report in <5 minutes

### 3.2 Secondary Persona: Provider Operations Manager

**Demographics**:
- Manages day-to-day patient intake and billing
- Coordinates with GAIN case managers
- Monitors case status progression

**Goals**:
- Track patient cases through lifecycle
- Identify stalled cases requiring attention
- Monitor law firm responsiveness

**Pain Points**:
- "Pending" status too vague
- No alerts for aging cases
- Cannot see location-level performance

**Success Criteria**:
- Clear case status definitions
- Proactive alerts for at-risk cases
- Location/region filtering

### 3.3 Tertiary Persona: GAIN Internal User (Case Manager)

**Demographics**:
- GAIN employee managing provider relationships
- Handles billing inquiries and case updates
- Technical support for portal questions

**Goals**:
- Quickly answer provider questions
- Proactively identify issues before provider notices
- Reduce time spent on routine data requests

**Pain Points**:
- Must manually pull data for provider inquiries
- Cannot explain why portal shows different values
- No visibility into what provider sees

**Success Criteria**:
- Same view as provider (role-based access)
- Automated anomaly detection
- Provider activity tracking

---

## 4. Current State Analysis

### 4.1 Existing Portal Capabilities

#### Financial Performance Tracking
- Total invoice amount vs. total amount collected (time-series)
- Weighted average collection rate vs. simple average
- Law firm-specific collection performance
- Date range filtering (Sep 2023 - Sep 2025)

#### Capital Solutions Management
- Partial advance tranche tracking
- Amount advanced vs. repayment threshold
- Tranche-level visualization

#### Case Status Management
- Nine-stage case lifecycle tracking:
  1. Still Treating
  2. Gathering Bills and Records
  3. Demand Sent
  4. Pending
  5. Negotiation
  6. In Litigation
  7. Settled - Not Yet Disbursed
  8. Case Closed Payment Disbursed
  9. No Longer Represent
- Active case count (716 cases)
- Case status distribution (donut chart)

#### Operational Metrics
- Average closed case duration trending
- Average time to payment trending
- Open invoices count (17.91K)
- Invoice collected counts

### 4.2 Data Architecture (Current)

**Invoice Report Fields** (56 columns):
- Date dimensions: Invoice_Date2 (Year/Quarter/Month/Day)
- Financial: Open Invoice, Settled, Write Off
- Case identifiers: fid, fname, opname, opid
- Law firm: law_firm_account_name__c, attorneyname
- Case status: case_status__c, payoff_status__c, funding_stage__c
- Tranche: tranche, kavatranchenum, Tranche_Name
- Location: medlocale, mfname, billingstate
- Dates: origination_date__c, date_of_accident__c, cap_date__c

**Collections Report Fields** (56 columns):
- Same structure as Invoice Report
- Key differences: date_deposited_1__c date dimensions
- Financial: Total Invoice Amount, Total Amount Collected

**Issues**:
- Separate data sources with different filters
- Salesforce IDs (medlocale) used instead of readable names
- Complex filter chains (130+ medlocale IDs)
- Multiple date representations

### 4.3 Performance Baselines

**Source**: Comprehensive Portal Assessment (Appendix E) analyzing Sep 2023 - Sep 2025 data

| Metric | Current Value | Trend | Analysis |
|--------|--------------|-------|----------|
| Weighted avg collection rate | 46-77% (range) | Variable | High variance signals inconsistent case quality or settlement capability across law firms |
| Case duration | 17.5 months | **6x increase** (was 2.9 months in Dec 2023) | **Critical**: Severe working capital strain; potential causes include tort reform impact, case mix shift, or court backlogs |
| Time to payment | 15.9 months | **3.5x increase** (was 4.5 months in Aug 2023) | **Critical**: Cash conversion cycle breakdown; likely driven by Medicare/Medicaid lien resolution delays |
| Open cases | 716 | Stable | Only 12% fully closed (86 cases), indicating slow case velocity |
| Open invoices | 17.91K | Growing | Need aging analysis to assess collection risk |
| Partial advances deployed | $19.05M | Stable | Case duration increase extends capital lock-up period and reduces IRR materially |
| Law firm relationships | 13+ visible | - | Top performer: Setareh Law (91% collection); Bottom: Law Brothers (42% collection) |
| Collection gap (invoice vs. collected) | 38-40% | Consistent | Requires context: timing mismatch, write-offs, or long-tail collections? |
| Law firm concentration risk | BD&J, PC = $247K (2x #2 firm) | Moderate | Loss of largest law firm relationship would materially impact revenue |

---

## 5. Functional Requirements

### 5.1 Unified Data Dashboard (P0 - Critical)

#### FR-001: Single Source of Truth
**Description**: All portal views derive from a single, unified master data table with pre-computed materialized views.

**Acceptance Criteria**:
- One master table contains all invoice and collection data
- All aggregations computed in database (not frontend)
- Data exports match portal displays exactly (100% reconciliation)
- Filter logic visible and documented

#### FR-002: Centralized KPI Dashboard
**Description**: Main dashboard displays all critical metrics in unified view.

**Required KPIs**:
- Open Invoice Balance (with historical comparison)
- Days Sales Outstanding (DSO)
- Collection Rate (weighted and simple average)
- Case Count by Status
- Active Partial Advance Balance
- Aging Buckets (0-30, 31-60, 61-90, 91-180, 180+ days)

**Acceptance Criteria**:
- All KPIs visible without scrolling (above the fold)
- Click any KPI to drill into detail
- Historical comparison available for each metric
- Refresh timestamp displayed

#### FR-003: Historical Time Period Views
**Description**: View any metric as of any historical date.

**Acceptance Criteria**:
- Date picker allows selection of any past date
- "Compare to" option shows same period last year/quarter/month
- Trend lines show metric progression over time
- Export includes historical data

### 5.2 Financial Analytics (P0 - Critical)

#### FR-004: Receivables Aging Analysis
**Description**: Bucket receivables by age with drill-down capability.

**Aging Buckets**:
- Current (0-30 days)
- 31-60 days
- 61-90 days
- 91-180 days
- 180-365 days
- 365+ days

**Acceptance Criteria**:
- Visual aging summary (stacked bar or waterfall chart)
- Click bucket to see invoice-level detail
- Aging calculated from invoice date and current date
- High-risk indicator for 180+ day invoices

#### FR-005: Days Sales Outstanding (DSO)
**Description**: Calculate and trend DSO metric.

**Formula**: (Open Invoices / Average Daily Collections) × Days in Period

**Acceptance Criteria**:
- DSO displayed as primary KPI
- Trend line shows DSO progression
- Benchmark line shows target (<180 days for PI industry)
- Drill-down shows contributors to DSO changes

#### FR-006: Collection Rate Analytics
**Description**: Enhanced collection rate analysis with drill-down.

**Acceptance Criteria**:
- Weighted average and simple average displayed
- Breakout by law firm, location, and time period
- Collection rate trending with target line
- Net collection rate calculation: (Collections / Adjusted Charges) × 100

#### FR-007: Write-Off Analysis
**Description**: Track and analyze write-offs.

**Acceptance Criteria**:
- Write-off amount and percentage by period
- Write-off reasons categorized (No Recovery, Settled Prior, etc.)
- Trend analysis of write-off rates
- Drill-down to case level

### 5.3 Law Firm Analytics (P0 - Critical)

#### FR-008: Law Firm Performance Dashboard
**Description**: Comprehensive law firm performance analysis.

**Metrics per Law Firm**:
- Total invoice amount
- Collection rate (weighted and simple)
- Case count and status distribution
- Average case duration
- Average time to payment
- Trend vs. prior periods

**Acceptance Criteria**:
- Sortable table view with all metrics
- Click law firm to see case-level detail
- Performance ranking (top/bottom performers highlighted)
- Export law firm report

#### FR-009: Law Firm Comparison
**Description**: Compare law firm performance side-by-side.

**Acceptance Criteria**:
- Select 2-4 law firms for comparison
- Radar chart showing performance dimensions
- Bar charts for direct metric comparison
- Recommendation engine suggests optimal law firm relationships

### 5.4 Case Management (P1 - High)

#### FR-010: Enhanced Case Status Tracking
**Description**: Improved case lifecycle visibility with sub-statuses.

**Sub-Status Definitions for "Pending"**:
- Pending Treatment Completion
- Pending Demand Preparation
- Pending Attorney Response
- Pending Lien Resolution
- Pending Settlement Disbursement

**Acceptance Criteria**:
- Clear definitions for each status and sub-status
- Status progression timeline view
- Average time in each status
- Bottleneck identification

#### FR-011: Case-Level Detail View
**Description**: Drill down to individual case details.

**Case Detail Fields**:
- Patient name and DOB
- Date of accident
- Law firm and attorney
- All invoices associated with case
- All collections received
- Case status history
- Next expected action

**Acceptance Criteria**:
- Click case from any list to view details
- Invoice-level line items visible
- Collection history visible
- Status change audit trail

#### FR-012: Case Duration Analytics
**Description**: Analyze and trend case duration.

**Acceptance Criteria**:
- Average case duration by law firm, case type, injury severity
- Duration trending over time
- Segmentation by case outcome (settled vs. no recovery)
- Benchmark comparison

### 5.5 Partial Advance Management (P1 - High)

#### FR-013: Tranche Performance Dashboard
**Description**: Enhanced partial advance tracking.

**Tranche Metrics**:
- Amount advanced
- Repayment threshold (1.1x and full)
- Current repayment amount
- Repayment percentage
- IRR calculation (annualized return)
- Expected repayment date

**Acceptance Criteria**:
- All tranches visible with current status
- Progress bar showing repayment vs. threshold
- IRR calculated for each tranche
- Drill-down to underlying cases

#### FR-014: Capital Efficiency Analysis
**Description**: Analyze return on deployed capital.

**Acceptance Criteria**:
- Portfolio-level IRR calculation
- IRR by vintage (tranche cohort)
- Capital lock-up period analysis
- Projected vs. actual returns

### 5.6 Location & Hierarchy Management (P1 - High)

#### FR-015: Multi-Location View
**Description**: View data by location, region, and entity.

**Hierarchy Structure**:
- Parent Provider (e.g., Therapy Partners Group)
  - Region (e.g., Central California)
    - Location (e.g., GBPT Fresno)

**Acceptance Criteria**:
- Dropdown to select hierarchy level
- Aggregate metrics roll up correctly
- Compare locations side-by-side
- Location-specific KPIs

### 5.7 Data Export & Reporting (P1 - High)

#### FR-016: Raw Data Export
**Description**: Download complete raw data.

**Export Formats**:
- CSV (comma-separated)
- Excel (.xlsx) with formatting
- PDF report (summary)

**Acceptance Criteria**:
- One unified data export (not separate reports)
- All visible filters applied to export
- Export timestamp and filter description included
- Column headers match portal terminology

#### FR-017: Scheduled Reports
**Description**: Automated report delivery.

**Acceptance Criteria**:
- Schedule daily/weekly/monthly reports
- Email delivery with attached file
- Custom report templates
- Report history and archive

### 5.8 Alerts & Notifications (P2 - Medium)

#### FR-018: Configurable Alerts
**Description**: Proactive notifications for key events.

**Alert Types**:
- Case aging threshold exceeded (e.g., >180 days)
- Collection rate drop (e.g., >10% decline)
- Tranche approaching repayment threshold
- Law firm performance degradation
- New settlement received
- Case status change

**Acceptance Criteria**:
- User configures alert thresholds
- Email and/or SMS delivery options
- Alert history log
- One-click navigation to related data

#### FR-019: Dashboard Alert Summary
**Description**: Visual alert indicators on dashboard.

**Acceptance Criteria**:
- Alert badges on relevant sections
- Priority ranking (critical, warning, info)
- Dismiss or snooze options
- Alert trend tracking

---

## 6. Data Architecture Requirements

### 6.1 Database-First Architecture (Mandatory)

**Principle**: ALL calculations occur in PostgreSQL - ZERO frontend math.

#### DA-001: Master Data Table
**Description**: Single source table containing all transaction data.

**Schema Design**:
```sql
CREATE TABLE provider_master_data (
  -- Identifiers
  id SERIAL PRIMARY KEY,
  salesforce_id VARCHAR(50) UNIQUE NOT NULL,
  funding_id VARCHAR(100),

  -- Patient/Case Info
  patient_name VARCHAR(255),
  patient_dob DATE,
  opportunity_name VARCHAR(255),
  opportunity_id VARCHAR(50),
  date_of_accident DATE,

  -- Law Firm
  law_firm_name VARCHAR(255),
  law_firm_id VARCHAR(50),
  attorney_name VARCHAR(255),

  -- Provider/Location
  provider_name VARCHAR(255),
  provider_id VARCHAR(50),
  location_name VARCHAR(255),
  location_id VARCHAR(50),
  region VARCHAR(100),
  state VARCHAR(50),

  -- Financial
  invoice_amount DECIMAL(12,2),
  collected_amount DECIMAL(12,2),
  write_off_amount DECIMAL(12,2),
  open_balance DECIMAL(12,2),

  -- Dates
  invoice_date DATE NOT NULL,
  origination_date DATE,
  settlement_date DATE,
  collection_date DATE,
  cap_date DATE,

  -- Status
  funding_stage VARCHAR(100),
  case_status VARCHAR(100),
  payoff_status VARCHAR(100),

  -- Tranche
  tranche_name VARCHAR(100),
  tranche_id VARCHAR(50),
  ar_book VARCHAR(255),
  ar_type VARCHAR(100),

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);
```

#### DA-002: Materialized Views
**Description**: Pre-computed aggregations for instant dashboard loads.

**Required Views**:
```sql
-- Provider KPI Summary
CREATE MATERIALIZED VIEW provider_kpi_summary_mv AS
SELECT
  provider_id,
  SUM(invoice_amount) as total_invoiced,
  SUM(collected_amount) as total_collected,
  SUM(write_off_amount) as total_written_off,
  SUM(open_balance) as total_open,
  COUNT(DISTINCT opportunity_id) as case_count,
  COUNT(*) as invoice_count,
  -- DSO calculation
  (SUM(open_balance) / NULLIF(AVG(collected_amount), 0)) * 30 as dso,
  -- Collection rate
  SUM(collected_amount) / NULLIF(SUM(invoice_amount - write_off_amount), 0) * 100 as collection_rate
FROM provider_master_data
GROUP BY provider_id;

-- Aging Analysis
CREATE MATERIALIZED VIEW aging_analysis_mv AS
SELECT
  provider_id,
  SUM(CASE WHEN current_date - invoice_date <= 30 THEN open_balance ELSE 0 END) as current_0_30,
  SUM(CASE WHEN current_date - invoice_date BETWEEN 31 AND 60 THEN open_balance ELSE 0 END) as days_31_60,
  SUM(CASE WHEN current_date - invoice_date BETWEEN 61 AND 90 THEN open_balance ELSE 0 END) as days_61_90,
  SUM(CASE WHEN current_date - invoice_date BETWEEN 91 AND 180 THEN open_balance ELSE 0 END) as days_91_180,
  SUM(CASE WHEN current_date - invoice_date BETWEEN 181 AND 365 THEN open_balance ELSE 0 END) as days_181_365,
  SUM(CASE WHEN current_date - invoice_date > 365 THEN open_balance ELSE 0 END) as days_over_365
FROM provider_master_data
WHERE open_balance > 0
GROUP BY provider_id;

-- Law Firm Performance
CREATE MATERIALIZED VIEW law_firm_performance_mv AS
SELECT
  provider_id,
  law_firm_name,
  law_firm_id,
  COUNT(DISTINCT opportunity_id) as case_count,
  SUM(invoice_amount) as total_invoiced,
  SUM(collected_amount) as total_collected,
  SUM(collected_amount) / NULLIF(SUM(invoice_amount), 0) * 100 as collection_rate,
  AVG(CASE WHEN settlement_date IS NOT NULL
      THEN settlement_date - origination_date
      ELSE NULL END) as avg_case_duration_days,
  AVG(CASE WHEN collection_date IS NOT NULL AND settlement_date IS NOT NULL
      THEN collection_date - settlement_date
      ELSE NULL END) as avg_time_to_payment_days
FROM provider_master_data
GROUP BY provider_id, law_firm_name, law_firm_id;

-- Case Status Distribution
CREATE MATERIALIZED VIEW case_status_distribution_mv AS
SELECT
  provider_id,
  case_status,
  COUNT(DISTINCT opportunity_id) as case_count,
  SUM(invoice_amount) as total_invoiced,
  SUM(open_balance) as open_balance
FROM provider_master_data
GROUP BY provider_id, case_status;

-- Tranche Performance
CREATE MATERIALIZED VIEW tranche_performance_mv AS
SELECT
  provider_id,
  tranche_name,
  tranche_id,
  SUM(invoice_amount) as total_invoiced,
  SUM(collected_amount) as total_collected,
  MIN(origination_date) as tranche_start_date,
  MAX(collection_date) as last_collection_date
FROM provider_master_data
WHERE tranche_name IS NOT NULL
GROUP BY provider_id, tranche_name, tranche_id;
```

#### DA-003: View Refresh Strategy
**Description**: Automated refresh of materialized views.

**Refresh Schedule**:
- Real-time critical views: Every 15 minutes
- Standard views: Hourly
- Historical/trend views: Daily

**Acceptance Criteria**:
- Concurrent refresh (no read blocking)
- Refresh status monitoring
- Alert on refresh failure
- Manual refresh capability

### 6.2 Data Quality Requirements

#### DA-004: Reconciliation Checks
**Description**: Automated data integrity validation.

**Required Checks**:
- Invoice totals match collection + open + write-off
- No orphan collections (collections without invoices)
- Date logic validation (collection date >= settlement date)
- Duplicate detection

**Acceptance Criteria**:
- Daily reconciliation report
- Anomaly flagging
- Error resolution workflow
- Historical accuracy tracking

#### DA-005: Audit Trail
**Description**: Track all data changes.

**Acceptance Criteria**:
- Record source of each data point
- Track sync timestamps
- Log calculation methodology changes
- Version history for materialized views

### 6.3 Connection Pool Management

#### DA-006: Shared Connection Pool
**Description**: Singleton database connection pattern.

**Configuration**:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 60000
});
```

**Acceptance Criteria**:
- Single shared pool across all API routes
- Connection pooling with serverless support
- Timeout handling
- Connection health monitoring

---

## 7. AI & Predictive Analytics Requirements

### 7.1 Settlement Prediction Model (P1 - High)

#### AI-001: Settlement Probability Prediction
**Description**: ML model predicting likelihood of case settlement.

**Input Features**:
- Case age (days since origination)
- Law firm historical performance
- Case status and sub-status
- Injury severity indicators
- Insurance limit information
- Geographic factors

**Output**:
- Settlement probability (0-100%)
- Confidence interval
- Key factors influencing prediction

**Acceptance Criteria**:
- Model accuracy >70% on validation set
- Predictions updated weekly
- Explanation of key drivers
- Model performance monitoring

#### AI-002: Expected Settlement Value
**Description**: Predict expected collection amount.

**Output**:
- Expected value ($)
- Range (low/mid/high)
- Expected collection rate for case

**Acceptance Criteria**:
- Prediction variance <20% from actual
- Factors contributing to estimate visible
- Historical accuracy tracking

### 7.2 Time Prediction Models (P1 - High)

#### AI-003: Settlement Timeline Prediction
**Description**: Predict when case will settle.

**Output**:
- Expected settlement date
- Probability distribution over time
- Key milestone predictions

**Acceptance Criteria**:
- Median prediction error <60 days
- 90-day rolling accuracy >60%
- Update as case progresses

#### AI-004: Payment Timeline Prediction
**Description**: Predict time from settlement to payment.

**Output**:
- Expected payment date (given settlement)
- Confidence interval
- Delay risk factors

**Acceptance Criteria**:
- Prediction accuracy improves post-settlement
- Lien resolution impact factored
- Law firm disbursement history incorporated

### 7.3 AI-Powered Insights (P2 - Medium)

#### AI-005: Natural Language Insights
**Description**: Auto-generated narrative explanations.

**Example Outputs**:
- "Your time-to-payment increased 2.3 months this quarter primarily due to Medicare lien resolution delays on 3 high-value cases with Wilshire Law Firm."
- "Your collection rate dropped 5% vs. last quarter. The primary driver was increased write-offs from Law Brothers (6 cases with no recovery)."

**Acceptance Criteria**:
- Daily insight generation
- Priority ranking by business impact
- Action recommendations included
- Feedback mechanism for insight quality

#### AI-006: Anomaly Detection
**Description**: Identify unusual patterns in data.

**Detection Types**:
- Sudden collection rate changes
- Unusual case duration spikes
- Law firm performance degradation
- Unexpected write-off patterns

**Acceptance Criteria**:
- Real-time detection
- Alert integration
- Root cause suggestions
- Historical anomaly tracking

### 7.4 Recommendations Engine (P2 - Medium)

#### AI-007: Law Firm Recommendations
**Description**: Suggest optimal law firm relationships.

**Recommendations**:
- "Consider reducing new case volume with Drake Law Firm (48% collection) and increasing with Setareh Law (91% collection)"
- Law firm risk scoring

**Acceptance Criteria**:
- Data-driven recommendations
- Impact quantification
- Recommendation history tracking

#### AI-008: Portfolio Optimization
**Description**: Suggest actions to improve portfolio performance.

**Recommendations**:
- Cases requiring attention
- Collection improvement opportunities
- Risk mitigation actions

**Acceptance Criteria**:
- Prioritized action list
- Expected impact for each action
- One-click navigation to relevant data

---

## 8. User Interface Requirements

### 8.1 Design System

#### UI-001: Design Token System
**Description**: Consistent styling across all components.

**Color Palette**:
```typescript
const COLORS = {
  primary: {
    main: '#3B82F6',     // GAIN brand blue
    light: '#DBEAFE',
    dark: '#1E40AF'
  },
  success: {
    main: '#10B981',     // Collections/positive
    light: '#D1FAE5'
  },
  warning: {
    main: '#F59E0B',     // Caution
    light: '#FEF3C7'
  },
  danger: {
    main: '#EF4444',     // Risk/negative
    light: '#FEE2E2'
  },
  grades: {
    A: '#10B981',
    B: '#3B82F6',
    C: '#6B7280',
    D: '#F59E0B',
    E: '#EF4444'
  }
};
```

**Typography**:
- Primary font: Inter or system font stack
- KPI values: 32px bold
- Section headers: 20px semibold
- Body text: 14px regular
- Labels: 12px medium

#### UI-002: Component Library
**Description**: Reusable UI components.

**Required Components**:
- KPI Card (value, trend, comparison)
- Data Table (sortable, filterable, paginated)
- Chart Wrapper (standardized Recharts configs)
- Filter Bar (date range, entity selection)
- Drill-Down Modal
- Alert Badge
- Progress Bar
- Status Indicator

### 8.2 Dashboard Layout

#### UI-003: Main Dashboard Structure
**Description**: Primary dashboard layout.

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│ Header: Logo | Provider Name | Date Range | User Menu      │
├────────────────────────────────────────────────────────────┤
│ Alert Bar: [Critical alerts displayed here]                │
├───────────────┬───────────────┬───────────────┬────────────┤
│ KPI: Open AR  │ KPI: DSO      │ KPI: Collect% │ KPI: Cases │
│ $X.XXM        │ XX days       │ XX%           │ XXX        │
│ +/-X% vs LY   │ +/-X vs LY    │ +/-X vs LY    │ +/-X vs LY │
├───────────────┴───────────────┴───────────────┴────────────┤
│ Tab Navigation: [Overview] [Collections] [Cases] [Tranches]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [Main Content Area - Charts/Tables based on selected tab] │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ AI Insights Panel: "Key insight text..." [View Details]    │
└────────────────────────────────────────────────────────────┘
```

#### UI-004: Navigation Structure
**Description**: Tab-based navigation with deep linking.

**Primary Tabs**:
1. **Overview**: KPI summary, aging, status distribution
2. **Collections**: Invoice/collection trends, law firm performance
3. **Cases**: Case listing, status tracking, duration analytics
4. **Tranches**: Partial advance performance, IRR tracking
5. **Locations**: Multi-location view (if applicable)
6. **Reports**: Scheduled reports, exports, custom reports

**Acceptance Criteria**:
- URL reflects current view (deep linking)
- Tab state persists across sessions
- Loading indicators during data fetch
- Error states handled gracefully

### 8.3 Visualization Standards

#### UI-005: Chart Standards
**Description**: Consistent chart configurations.

**Time Series Charts**:
- Bar charts for discrete periods (monthly)
- Line charts for continuous trends
- Dual-axis when comparing different scales
- Target/benchmark lines when applicable

**Distribution Charts**:
- Donut charts for status distribution (max 8 segments)
- Stacked bar for aging analysis
- Horizontal bars for rankings

**Comparison Charts**:
- Grouped bars for period comparison
- Radar charts for multi-dimensional comparison

**Acceptance Criteria**:
- All values accessible without hover (data labels or table)
- Consistent color coding across charts
- Legends positioned consistently
- Responsive sizing

#### UI-006: Interactive Elements
**Description**: Click interactions and drill-downs.

**Interactions**:
- Click chart segment → Filter data
- Click KPI → Show detail view
- Click table row → Open case detail
- Click law firm → Law firm deep dive

**Acceptance Criteria**:
- Cursor changes to indicate clickability
- Breadcrumb navigation for drill-down paths
- Back button/escape to return

### 8.4 Responsive Design

#### UI-007: Device Support
**Description**: Responsive layout for all devices.

**Breakpoints**:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 320px - 767px

**Acceptance Criteria**:
- All features accessible on tablet
- Mobile optimized for key KPIs and status checks
- Touch-friendly interactions
- No horizontal scrolling required

---

## 9. Integration Requirements

### 9.1 Data Synchronization

#### INT-001: Salesforce Integration
**Description**: Sync data from Salesforce source systems.

**Sync Requirements**:
- Incremental sync every 15 minutes for active records
- Full sync daily for data integrity check
- Field mapping documentation maintained
- Error handling and retry logic

**Acceptance Criteria**:
- Data latency <30 minutes
- 99.9% sync success rate
- Sync status monitoring
- Manual sync trigger capability

#### INT-002: GAIN Internal Systems
**Description**: Integration with GAIN case management and payment systems.

**Required Integrations**:
- Case status updates
- Payment processing events
- Tranche management data

**Acceptance Criteria**:
- Real-time event streaming preferred
- Fallback to batch sync if needed
- Audit trail for all data sources

### 9.2 Authentication & Authorization

#### INT-003: User Authentication
**Description**: Secure access control.

**Requirements**:
- SSO integration (if applicable)
- Multi-factor authentication option
- Session management
- Password policies

**Acceptance Criteria**:
- Clerk or equivalent auth provider
- Invitation-only access (restricted mode)
- Session timeout after 30 minutes inactivity
- Audit log of all logins

#### INT-004: Role-Based Access Control
**Description**: Permission levels by user role.

**Roles**:
- **Provider Admin**: Full access to provider data, report configuration
- **Provider Viewer**: Read-only access to provider data
- **GAIN Admin**: Access to all provider data, system configuration
- **GAIN Case Manager**: Access to assigned provider data

**Acceptance Criteria**:
- Role assignment at user level
- Permission inheritance
- Audit log of permission changes

### 9.3 Export & API

#### INT-005: Data Export API
**Description**: Programmatic access to provider data.

**API Endpoints**:
- GET /api/kpi-summary
- GET /api/aging-analysis
- GET /api/collections
- GET /api/cases
- GET /api/law-firms
- GET /api/tranches
- POST /api/export (generate file download)

**Acceptance Criteria**:
- RESTful API design
- Authentication required
- Rate limiting
- API documentation

#### INT-006: Provider System Integration
**Description**: Optional integration with provider EMR/PMS.

**Integration Points**:
- Patient demographic sync
- Treatment plan import
- Invoice verification

**Acceptance Criteria**:
- API-based integration
- Provider controls data sharing
- Field mapping configuration

---

## 10. Non-Functional Requirements

### 10.1 Performance

#### NFR-001: Response Time
**Description**: Application performance targets.

| Operation | Target | Max Acceptable |
|-----------|--------|---------------|
| Dashboard load | <2 seconds | <5 seconds |
| Drill-down navigation | <1 second | <3 seconds |
| Data export (small) | <5 seconds | <10 seconds |
| Data export (large) | <30 seconds | <60 seconds |
| Chart interaction | <500ms | <1 second |

#### NFR-002: Scalability
**Description**: System capacity requirements.

**Targets**:
- Support 5,000 concurrent provider users
- Handle 500K+ invoice records per provider
- 100+ simultaneous API requests

**Acceptance Criteria**:
- Load tested at 2x expected volume
- Auto-scaling infrastructure
- Performance monitoring and alerting

### 10.2 Reliability

#### NFR-003: Availability
**Description**: System uptime requirements.

**Target**: 99.9% uptime (8.76 hours downtime/year maximum)

**Acceptance Criteria**:
- Redundant infrastructure
- Automated failover
- Status page for system health
- Incident response procedures

#### NFR-004: Data Durability
**Description**: Data protection requirements.

**Requirements**:
- Daily backups with 30-day retention
- Point-in-time recovery capability
- Cross-region backup replication

**Acceptance Criteria**:
- Backup verification testing monthly
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 1 hour

### 10.3 Security

#### NFR-005: Data Security
**Description**: Security controls.

**Requirements**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Network isolation
- Regular security audits

**Acceptance Criteria**:
- SOC 2 compliance
- HIPAA compliance (PHI handling)
- Annual penetration testing
- Vulnerability management program

#### NFR-006: Access Security
**Description**: Access control security.

**Requirements**:
- Principle of least privilege
- Session management
- Brute force protection
- Suspicious activity monitoring

**Acceptance Criteria**:
- Failed login lockout after 5 attempts
- Session tokens expire after 8 hours
- Activity audit logging
- Security incident alerting

### 10.4 Maintainability

#### NFR-007: Code Quality
**Description**: Development standards.

**Requirements**:
- TypeScript for type safety
- Component size <1,000 lines
- Unit test coverage >80%
- Documentation for all APIs

**Acceptance Criteria**:
- Automated linting
- Code review required for all changes
- CI/CD pipeline with automated testing
- Technical debt tracking

#### NFR-008: Monitoring & Observability
**Description**: System monitoring requirements.

**Requirements**:
- Application performance monitoring (APM)
- Error tracking and alerting
- User analytics
- Database query performance monitoring

**Acceptance Criteria**:
- Real-time dashboards
- Alert escalation procedures
- Incident post-mortems
- Performance trend reporting

---

## 11. Implementation Phases

### Phase 1: Foundation (Critical Path)
**Focus**: Data architecture and core dashboard

**Deliverables**:
- Unified master data table
- Core materialized views
- Main dashboard with KPIs
- Aging analysis
- DSO calculation
- Basic data export

**Success Criteria**:
- 100% data reconciliation
- Dashboard loads <2 seconds
- Aging buckets accurate

### Phase 2: Analytics Enhancement
**Focus**: Law firm analytics and drill-downs

**Deliverables**:
- Law firm performance dashboard
- Case-level drill-down
- Enhanced case status tracking
- Collection rate analytics
- Write-off analysis

**Success Criteria**:
- Law firm rankings accurate
- Case detail complete
- All drill-downs functional

### Phase 3: Predictive Intelligence
**Focus**: AI models and insights

**Deliverables**:
- Settlement probability model
- Time prediction models
- Natural language insights
- Anomaly detection
- Recommendations engine

**Success Criteria**:
- Model accuracy targets met
- Insights rated valuable by users
- Anomaly detection operational

### Phase 4: Advanced Features
**Focus**: Alerts, automation, and integrations

**Deliverables**:
- Configurable alert system
- Scheduled reports
- API for integrations
- Mobile optimization
- Location hierarchy

**Success Criteria**:
- Alerts delivered reliably
- Reports on schedule
- API documented and secured

---

## 12. Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Data migration complexity | High | High | Phased migration with validation checkpoints |
| AI model accuracy | Medium | Medium | Start with simpler models, iterate based on performance |
| Performance at scale | Medium | High | Load testing early, materialized views for queries |
| Integration dependencies | Medium | Medium | API-first design, graceful degradation |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Provider adoption | Medium | High | Early user involvement, training program |
| Scope creep | High | Medium | Strict phase boundaries, change control process |
| Data quality issues | High | High | Reconciliation checks, data quality dashboard |
| Competitive pressure | Low | Medium | Differentiation through AI capabilities |

---

## 13. Appendices

### Appendix A: Current Portal Screenshots Reference

Location: `/Users/saulmateos/Documents/GitHub/Portal_Update/Portal/`
- Partner Portal.pdf - Main financial dashboard
- Partner Portal Collections.pdf - Collections view
- Case Status.pdf - Case status distribution

### Appendix B: Data Dictionary

See: `/Users/saulmateos/Documents/GitHub/Portal_Update/Data/` for sample data structures
- TPG_Collections.csv - Collections data sample
- TPG_Invoice.csv - Invoice data sample

### Appendix C: Reference Architecture

See: `/Users/saulmateos/Documents/GitHub/Portal_Update/FINANCIAL-PLATFORM-REFERENCE.md`
- Database-first architecture patterns
- Materialized view strategies
- Frontend component patterns
- Performance optimization techniques

### Appendix D: User Feedback Source

See: `/Users/saulmateos/Documents/GitHub/Portal_Update/Suggestions/Portal Improvements.docx`
- Original user improvement requests
- Data source concerns
- Visualization requirements

### Appendix E: Portal Assessment

**Document**: `/Users/saulmateos/Documents/GitHub/Portal_Update/Portal/GAIN_Provider_Portal_Assessment.md`

**Overview**: 15-page comprehensive assessment analyzing current portal functionality, financial performance, operational metrics, and strategic implications for GAIN's provider relationships.

**Key Findings**:
* **Strengths**: Excellent data visibility, clean UX design, law firm-level granularity, competitive advantage vs. traditional medical factors
* **Critical Issues**: 6x increase in case duration (2.9 → 17.5 months), 3.5x increase in time-to-payment (4.5 → 15.9 months), 38-40% collection gap needs contextualization
* **Missing Capabilities**: DSO calculation, aging analysis, predictive analytics, comparative benchmarking, alerts/notifications, export functionality
* **Strategic Implications**: Portal is operationally sound but strategically incomplete; needs to shift from retrospective reporting to predictive optimization
* **Capital Efficiency Concerns**: $19M+ deployed across tranches with 1.50x repayment threshold; case duration increase extends capital lock-up period and materially reduces IRR
* **Recommendations**: Immediate priorities (0-3 months) include adding DSO/aging analysis, target benchmark lines, and fixing data labeling issues; near-term (3-6 months) includes predictive settlement analytics, comparative benchmarking, and alert system; long-term (6-12 months) includes mobile app, AI-powered insights panel, and workflow automation

**Assessment Structure**:
1. Executive Summary
2. Portal Functionality Overview (4 core capabilities)
3. Financial Performance Analysis (collection rates, revenue timing, concentration risk)
4. Partial Advance Portfolio Analysis ($19M capital deployed)
5. Operational Performance Concerns (case duration, payment timeline trends)
6. Strengths of Current Portal
7. Weaknesses & Gaps (missing DSO, aging, predictive analytics)
8. Strategic Implications for GAIN
9. Technical Observations (data architecture, platform stack, scalability)
10. Recommended Enhancements (phased 0-3-6-12 month roadmap)
11. Conclusion

**Conclusion from Assessment**: "The portal is operationally sound but strategically incomplete. With case duration and payment timelines deteriorating, GAIN needs the portal to shift from 'reporting tool' to 'optimization engine' that helps providers (and GAIN) navigate industry headwinds more effectively."

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 9, 2025 | Saul Mateos | Initial PRD creation |
| 1.1 | Dec 9, 2025 | Saul Mateos | Added comprehensive portal assessment (Appendix E); updated Executive Summary with key findings from assessment |

---

**Next Steps**:
1. Stakeholder review and feedback
2. Technical feasibility assessment
3. Prioritization refinement
4. Resource planning
5. Detailed technical specification development
