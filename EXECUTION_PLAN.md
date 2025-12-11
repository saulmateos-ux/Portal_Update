# GAIN Enhanced Provider Portal - Execution Plan

**Project**: Transform GAIN Provider Portal from Reporting Tool to Optimization Engine
**Author**: Saul Mateos, CFO
**Created**: December 9, 2025
**Last Updated**: December 9, 2025
**Status**: 🟢 **Phase 1 In Progress** | Collections Enhanced

---

## 🎯 PROJECT INTENT

### Business Problem
GAIN's current Power BI portal provides basic reporting but lacks:
- Real-time analytics and drill-down capabilities
- Predictive insights for settlement likelihood
- Law firm performance comparison
- Actionable recommendations for portfolio optimization
- Modern, intuitive user experience

### Target Client
**Therapy Partners Group**
- $877K in invoices, $479K collected (54.6% rate)
- 2,614 invoices across 267 unique cases
- 100+ law firm relationships with 45%-100% collection rate variance
- $383K in open receivables requiring active management

### Solution Vision
Transform from "data viewer" to "optimization engine" that:
1. **Unifies** all receivables data into single source of truth
2. **Visualizes** performance with interactive charts and drill-downs
3. **Predicts** settlement probability and expected timelines
4. **Recommends** actions to improve collection rates
5. **Automates** insights and alerts for proactive management

---

## 📊 OVERALL STATUS

### ✅ Completed Work (December 9, 2025)

#### Foundation & Core Features
- [x] **Project setup** - Next.js 14 + TypeScript + Tailwind
- [x] **Database architecture** - PostgreSQL with master data table
- [x] **Data import** - Real TPG data imported (14,780 invoices)
- [x] **Materialized views** - KPI, Aging, Collections views created
- [x] **Navigation system** - Full portal navigation with 6 sections
- [x] **Dashboard KPIs** - 5 KPIs with correct Therapy Partners data
- [x] **Refresh script** - Automated materialized view refresh

#### Collections Page (Phase 1 & 2 Complete!)
- [x] **Summary KPI Cards** - 4 key metrics at top
- [x] **Collection Trends Chart** - Stacked bar + line combo chart
- [x] **Enhanced Monthly Table** - MoM changes with ↑/↓ indicators
- [x] **Collection Funnel** - Waterfall visualization ($877K → $479K → $383K → $15K)
- [x] **Collections by Status** - Horizontal bar chart (color-coded by rate)
- [x] **Law Firm Performance** - Top 10 table with grades (A-F), sortable

#### API Endpoints Created
- [x] `/api/kpi` - Dashboard KPIs
- [x] `/api/aging` - Aging analysis
- [x] `/api/collections` - Monthly trends with MoM
- [x] `/api/collections/summary` - Collections KPIs
- [x] `/api/collections/by-status` - Performance by case status
- [x] `/api/collections/by-law-firm` - Law firm rankings
- [x] `/api/health` - Health check endpoint

#### Components Built
- [x] `Header.tsx` - Navigation with active states
- [x] `KPICard.tsx` - Reusable KPI display
- [x] `AgingChart.tsx` - Aging visualization
- [x] `CollectionsSummaryKPIs.tsx` - 4 KPI cards
- [x] `CollectionsTrendChart.tsx` - Combo chart (bar + line)
- [x] `CollectionsFunnel.tsx` - Waterfall funnel
- [x] `CollectionsByStatus.tsx` - Horizontal bar chart
- [x] `LawFirmPerformance.tsx` - Sortable performance table

### 🔄 In Progress
- [ ] Cases page enhancement
- [ ] Law Firms page enhancement
- [ ] Tranches page enhancement
- [ ] Reports page enhancement

### 📋 Remaining Work
See detailed phases below for remaining tasks.

---

## EXECUTIVE SUMMARY

This execution plan transforms GAIN's current Power BI-based provider portal into a modern, AI-enhanced analytics platform. The plan follows a phased approach prioritizing data integrity, core functionality, and incremental intelligence features.

**Total Phases**: 4
**Critical Path**: Phase 1 (Foundation) must complete before other phases

---

## PHASE 1: FOUNDATION (Critical Path)

### Objective
Establish unified data architecture and core dashboard with accurate, reconciled data.

### Milestone 1.1: Project Setup ✅ COMPLETED
| Task | Description | Status |
|------|-------------|--------|
| 1.1.1 | Initialize Next.js 14 project with App Router | ✅ Complete |
| 1.1.2 | Configure TypeScript and Tailwind CSS | ✅ Complete |
| 1.1.3 | Set up Neon PostgreSQL database | ✅ Complete |
| 1.1.4 | Configure Clerk authentication | ✅ Complete |
| 1.1.5 | Set up Vercel deployment pipeline | ⏸️ Pending |
| 1.1.6 | Create project directory structure | ✅ Complete |

### Milestone 1.2: Database Architecture ✅ COMPLETED
| Task | Description | Status |
|------|-------------|--------|
| 1.2.1 | Create `provider_master_data` table | ✅ Complete |
| 1.2.2 | Create lookup tables (providers, locations, law_firms, tranches) | ⏸️ Not needed yet |
| 1.2.3 | Create essential indexes | ✅ Complete |
| 1.2.4 | Implement shared connection pool (`lib/db.ts`) | ✅ Complete |
| 1.2.5 | Create `provider_kpi_summary_mv` view | ✅ Complete |
| 1.2.6 | Create `aging_analysis_mv` view | ✅ Complete |
| 1.2.7 | Create view refresh function | ✅ Complete |

**Files Created**:
- ✅ `lib/db.ts` - Singleton connection pool
- ✅ `sql/views/provider_kpi_summary_mv.sql`
- ✅ `sql/views/aging_analysis_mv.sql`
- ✅ `sql/functions/refresh_all_views.sql`
- ✅ `scripts/refresh-views.js`

### Milestone 1.3: Data Import Pipeline ✅ COMPLETED
| Task | Description | Status |
|------|-------------|--------|
| 1.3.1 | Create CSV preprocessor script | ✅ Complete |
| 1.3.2 | Create chunked upload API endpoint | ✅ Complete |
| 1.3.3 | Create upload orchestrator script | ✅ Complete |
| 1.3.4 | Implement data validation checks | ✅ Complete |
| 1.3.5 | Test import with Therapy Partners data | ✅ Complete (14,780 invoices) |
| 1.3.6 | Verify 100% reconciliation | ✅ Complete |

**Data Imported**:
- 14,780 total invoice rows
- 267 unique cases (Therapy Partners Group)
- 512 law firm relationships
- $877K total invoiced, $479K collected (54.6% rate)

### Milestone 1.4: Core Dashboard 🔄 IN PROGRESS
| Task | Description | Status |
|------|-------------|--------|
| 1.4.1 | Create design tokens (`lib/design-tokens.ts`) | ✅ Complete |
| 1.4.2 | Build KPI Card component | ✅ Complete |
| 1.4.3 | Build KPI Grid layout | ✅ Complete |
| 1.4.4 | Create `/api/kpi` endpoint | ✅ Complete |
| 1.4.5 | Create `/api/aging` endpoint | ✅ Complete |
| 1.4.6 | Build Aging Chart component | ✅ Complete |
| 1.4.7 | Build main dashboard page | ✅ Complete |
| 1.4.8 | Add filter bar component | ⏸️ Pending |
| 1.4.9 | **Build navigation system** | ✅ Complete (BONUS) |

**KPIs Displaying**:
- ✅ Open Invoice Balance: $382,887
- ✅ Days Sales Outstanding (DSO): 159 days
- ✅ Collection Rate: 54.6%
- ✅ Open Cases: 99
- ✅ Total Collected: $479,368

### Milestone 1.5: Basic Export ⏸️ PENDING
| Task | Description | Status |
|------|-------------|--------|
| 1.5.1 | Create `/api/export` endpoint | ⏸️ Pending |
| 1.5.2 | Implement CSV export | ⏸️ Pending |
| 1.5.3 | Implement Excel export (ExcelJS) | ⏸️ Pending |
| 1.5.4 | Add export modal component | ⏸️ Pending |

### Phase 1 Success Criteria
- [x] Dashboard loads in <2 seconds ✅
- [x] 100% data reconciliation (portal = exports) ✅
- [x] All 5 KPIs displaying correctly ✅
- [x] Aging buckets accurate ✅
- [x] DSO calculation validated ✅
- [ ] Export matches portal display exactly ⏸️

---

## PHASE 2: ANALYTICS ENHANCEMENT

### Objective
Add law firm analytics, case drill-downs, and enhanced tracking capabilities.

### Milestone 2.1: Law Firm Analytics 🔄 IN PROGRESS
| Task | Description | Status |
|------|-------------|--------|
| 2.1.1 | Create `law_firm_performance_mv` view | ⏸️ Pending (using dynamic query) |
| 2.1.2 | Create `/api/law-firms` endpoint | ✅ Complete (basic) |
| 2.1.3 | Build Law Firm Table component | ✅ **Complete (Collections page)** |
| 2.1.4 | Build Law Firm Comparison chart | ⏸️ Pending |
| 2.1.5 | Create Law Firms page | 🔄 In Progress (basic exists) |
| 2.1.6 | Add law firm drill-down modal | ⏸️ Pending |

**Law Firm Metrics Built**:
- ✅ Total invoiced/collected
- ✅ Collection rate (weighted)
- ✅ Case count
- ✅ Performance tier (A/B/C/D/E grades)
- ⏸️ Average case duration
- ⏸️ Average time to payment

### Milestone 2.2: Case Management 🔄 IN PROGRESS
| Task | Description | Status |
|------|-------------|--------|
| 2.2.1 | Create `case_status_distribution_mv` view | ⏸️ Pending |
| 2.2.2 | Create `/api/cases` endpoint (paginated) | ✅ Complete (basic) |
| 2.2.3 | Create `/api/cases/[id]` endpoint | ⏸️ Pending |
| 2.2.4 | Build Case Table component | ✅ Complete (basic) |
| 2.2.5 | Build Case Detail Modal | ⏸️ Pending |
| 2.2.6 | Build Status Funnel visualization | ⏸️ Pending |
| 2.2.7 | Create Cases page | ✅ Complete (basic) |

### Milestone 2.3: Collection Analytics ✅ COMPLETED
| Task | Description | Status |
|------|-------------|--------|
| 2.3.1 | Create `monthly_trends_mv` view | ✅ Complete (dynamic) |
| 2.3.2 | Create `/api/collections` endpoint | ✅ Complete |
| 2.3.3 | Build Collection Timeline chart | ✅ **Complete (Trend Chart)** |
| 2.3.4 | Build Write-off Analysis component | ✅ **Complete (in Funnel)** |
| 2.3.5 | Create Collections page | ✅ **Complete (Phase 1 & 2)** |

**Collections Page Features**:
- ✅ Summary KPI Cards (4 metrics)
- ✅ Collection Trends Combo Chart (stacked bar + line)
- ✅ Enhanced Monthly Table (MoM changes)
- ✅ Collection Funnel (waterfall: $877K → $479K → $383K → $15K)
- ✅ Collections by Status (horizontal bar chart, color-coded)
- ✅ Law Firm Performance Table (top 10, sortable, graded A-F)

### Milestone 2.4: Enhanced Status Tracking ⏸️ PENDING
| Task | Description | Status |
|------|-------------|--------|
| 2.4.1 | Define sub-status taxonomy | ⏸️ Pending |
| 2.4.2 | Update database schema for sub-statuses | ⏸️ Pending |
| 2.4.3 | Create status progression timeline | ⏸️ Pending |
| 2.4.4 | Build bottleneck identifier | ⏸️ Pending |

### Phase 2 Success Criteria
- [x] Law firm rankings accurate ✅
- [ ] Case drill-down shows complete history ⏸️
- [x] Collection trends match raw data ✅
- [ ] All drill-downs functional ⏸️
- [x] Performance remains <2s response ✅

---

## PHASE 3: PREDICTIVE INTELLIGENCE ⏸️ PENDING

### Objective
Introduce AI-powered predictions, insights, and recommendations.

### Milestone 3.1: Prediction Infrastructure
*All tasks pending - Phase 3 not started*

### Milestone 3.2: Settlement Prediction Model
*All tasks pending - Phase 3 not started*

### Milestone 3.3: Timeline Predictions
*All tasks pending - Phase 3 not started*

### Milestone 3.4: Natural Language Insights
*All tasks pending - Phase 3 not started*

### Milestone 3.5: Anomaly Detection
*All tasks pending - Phase 3 not started*

### Milestone 3.6: Recommendations Engine
*All tasks pending - Phase 3 not started*

---

## PHASE 4: ADVANCED FEATURES ⏸️ PENDING

### Objective
Add alerts, scheduled reports, integrations, and mobile optimization.

*All milestones pending - Phase 4 not started*

---

## 🔑 KEY INSIGHTS DISCOVERED

### Data Quality Findings
- **Total AR**: $877,635 invoiced, $479,368 collected (54.6% rate)
- **Write-off Rate**: Only 1.8% ($15,380) - Excellent underwriting!
- **Open Balance**: $382,887 (43.6% of total) - Significant opportunity
- **Invoice Volume**: 2,614 invoices, but only 267 unique cases (9.8 invoices/case avg)

### Law Firm Performance Variance
- **Top Performers**: 3 firms with 100% collection rates (Naqvi Injury Law, Okhovat Law, JT Legal Group)
- **Variance**: Collection rates range from 45% to 100% across firms
- **Opportunity**: Focusing on high-performing firms could improve overall rate by 10%+

### Case Status Impact
- **Best Status**: "Settled - Not Yet Disbursed" has 100%+ collection rate
- **Worst Status**: "Still Treating", "Pending", "Gathering Bills" all <30%
- **Insight**: Early intervention in low-performing statuses could prevent AR aging

### Temporal Patterns
- **Peak Month**: November 2024 ($41,265 collected)
- **Recent Trend**: Collections declining (July 2025 = 0%, concerning!)
- **Volatility**: MoM changes range from -100% to +290%

---

## 🛠️ TECHNICAL STACK VALIDATION

### What's Working Well
- ✅ PostgreSQL materialized views for pre-calculation (follows Rule #1!)
- ✅ Recharts for interactive visualizations
- ✅ Tailwind + Design tokens for consistent styling
- ✅ Next.js App Router for performance
- ✅ Shared database connection pool

### Lessons Learned
1. **Always filter by provider** - Queries need `WHERE provider_name = 'Therapy Partners Group - Parent'`
2. **Date subtraction** - Use `(date1 - date2)` directly, not `EXTRACT(DAY FROM ...)`
3. **Refresh materialized views** - Critical after data imports
4. **Component organization** - Keep specialized components in feature folders (`/components/collections/`)

---

## 📁 FILE INVENTORY

### Created Files (Total: 25+)

#### API Routes (7)
- `app/api/kpi/route.ts`
- `app/api/aging/route.ts`
- `app/api/collections/route.ts`
- `app/api/collections/summary/route.ts`
- `app/api/collections/by-status/route.ts`
- `app/api/collections/by-law-firm/route.ts`
- `app/api/health/route.ts`

#### Components (13)
- `components/layout/Header.tsx`
- `components/dashboard/KPICard.tsx`
- `components/dashboard/KPIGrid.tsx`
- `components/charts/AgingChart.tsx`
- `components/collections/CollectionsSummaryKPIs.tsx`
- `components/collections/CollectionsTrendChart.tsx`
- `components/collections/CollectionsFunnel.tsx`
- `components/collections/CollectionsByStatus.tsx`
- `components/collections/LawFirmPerformance.tsx`

#### SQL (5)
- `sql/views/provider_kpi_summary_mv.sql`
- `sql/views/aging_analysis_mv.sql`
- `sql/functions/refresh_all_views.sql`

#### Scripts (3)
- `scripts/import-real-data.js`
- `scripts/refresh-views.js`

#### Utilities (3)
- `lib/db.ts`
- `lib/design-tokens.ts`
- `lib/formatters.ts`

#### Documentation (2)
- `docs/COLLECTIONS_ENHANCEMENT_PLAN.md`
- `docs/collections-phase2-complete.png` (screenshot)

---

## 🚀 NEXT IMMEDIATE PRIORITIES

### Short Term (This Week)
1. **Export Functionality** - Milestone 1.5 (CSV/Excel export)
2. **Cases Page Enhancement** - Add filters, sorting, pagination improvements
3. **Law Firms Page** - Dedicated page with comparison charts
4. **Tranches Page** - Basic tranche performance tracking

### Medium Term (Next 2 Weeks)
1. **Case Detail Modal** - Full case drill-down with invoice history
2. **Law Firm Drill-down** - Detailed firm performance over time
3. **Status Funnel** - Case lifecycle visualization
4. **Filter Bar** - Global date/entity filtering