# GAIN Enhanced Provider Portal

> AI-powered financial analytics platform for healthcare providers managing personal injury receivables portfolios

## 🚀 Live Deployment

**Production**: [https://provider-portal-cyan.vercel.app](https://provider-portal-cyan.vercel.app)

## 📊 Project Overview

The GAIN Enhanced Provider Portal transforms traditional financial reporting into an intelligent analytics platform, providing real-time insights for healthcare providers managing $19M+ in partial advances across 716+ active cases.

### Key Features

- **Real-time KPI Dashboard**: Collection rate, DSO, open balance tracking
- **Aging Analysis**: 0-30, 31-60, 61-90, 91-180, 180+ day buckets
- **Law Firm Performance**: Rankings, trends, and risk analysis
- **Collection Analytics**: Velocity trends and performance metrics
- **Case Management**: Detailed drill-downs with status tracking
- **Receivables Intelligence**: At-risk AR identification and settlement tracking

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Tremor UI
- **Backend**: Next.js API Routes, PostgreSQL (Neon serverless)
- **Auth**: Clerk
- **Visualization**: Recharts
- **Deployment**: Vercel
- **Database**: PostgreSQL with materialized views

### Design Principles

1. **Database-First Architecture**: All calculations in PostgreSQL
2. **Single Source of Truth**: Master data table with materialized views
3. **No Frontend Math**: Zero calculations in JavaScript/TypeScript
4. **Performance Optimized**: Sub-2 second dashboard load times
5. **Real-time Refresh**: Materialized views updated every 15 minutes

## 📁 Project Structure

```
Portal_Update/
├── provider-portal/           # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── api/               # API endpoints
│   ├── components/            # React components
│   ├── lib/                   # Shared utilities
│   ├── sql/                   # Database schemas & views
│   └── scripts/               # Data import scripts
├── Data/                      # Source data files
├── Portal/                    # Portal assessments
├── docs/                      # Documentation
└── memory/                    # Development memory system
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saulmateos-ux/Portal_Update.git
   cd Portal_Update/provider-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
   - `CLERK_SECRET_KEY`: Clerk secret key

4. **Initialize database**
   ```bash
   node scripts/setup-database.js
   node scripts/import-from-analysis.js
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Project Constitution](CLAUDE.md) - Core principles and rules
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md)
- [Design Specifications](DESIGN_SPECIFICATIONS.md)
- [Product Requirements](PRD_Enhanced_Provider_Portal.md)
- [Dashboard Specification](DASHBOARD_SPECIFICATION.md)
- [Data Definitions](provider-portal/docs/DEFINITIONS.md)

## 🗃️ Database Schema

### Master Data Table
`provider_master_data` - Single source of truth for all metrics

### Key Materialized Views
- `provider_kpi_summary_mv` - Dashboard KPIs
- `aging_analysis_mv` - Aging buckets
- `law_firm_performance_mv` - Law firm metrics
- `receivables_by_case_status_mv` - Case status tracking
- `settled_pending_detail_mv` - Settlement tracking

## 📈 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Dashboard Load | <2s | ✅ |
| API Response (p95) | <2s | ✅ |
| Drill-down Navigation | <1s | ✅ |
| View Refresh | <30s | ✅ |

## 🔐 Security

- Clerk-based authentication
- Row-level security ready
- Environment variable encryption
- HTTPS-only connections
- PostgreSQL SSL connections

## 🚢 Deployment

### Automatic Deployments

This repository is connected to Vercel. Every push to `main` triggers an automatic deployment.

### Manual Deployment

```bash
cd provider-portal
vercel --prod
```

## 📊 Data Sources

Primary data sources located in `/Data/`:
- `TPG_Analysis_Jeff_Invoice.csv` - Master invoice data (15,738+ records)
- `TPG_Analysis_Jeff_Collections.csv` - Collection transactions (5,698+ records)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Critical Rules

1. **NO frontend calculations** - All math in PostgreSQL
2. **Database-first architecture** - Single source of truth
3. **Use shared connection pool** - Import from `@/lib/db`
4. **Standardized field names** - Follow naming conventions
5. **Component size limit** - Max 1,000 lines per file
6. **Test builds** - Always run `npm run build` before deployment

### Git Workflow

```bash
git add .
git commit -m "feat: Add feature description"
git push origin main
# Automatic Vercel deployment triggers
```

## 📞 Support

- **Documentation**: See `/docs` directory
- **Issues**: [GitHub Issues](https://github.com/saulmateos-ux/Portal_Update/issues)
- **Project Lead**: Saul Mateos, CFO @ GAIN

## 📄 License

Proprietary - © 2025 GAIN (Growth At Interest)

---

**Built with ❤️ using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
