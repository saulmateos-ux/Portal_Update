# Active Work

## Current Sprint Focus

### Status: Planning Complete - Ready for Implementation

**Last Updated**: December 9, 2025

---

## Next Immediate Tasks

### Priority 1: Project Setup (Phase 1, Milestone 1.1)
- [ ] Create GitHub repository
- [ ] Initialize Next.js 14 project with App Router
- [ ] Configure TypeScript and Tailwind CSS
- [ ] Set up Neon PostgreSQL database
- [ ] Configure Clerk authentication (restricted mode)
- [ ] Link Vercel for auto-deployment
- [ ] Create directory structure

### Priority 2: Database Architecture (Phase 1, Milestone 1.2)
- [ ] Create `provider_master_data` table
- [ ] Create lookup tables (providers, locations, law_firms, tranches)
- [ ] Create essential indexes
- [ ] Implement shared connection pool (`lib/db.ts`)
- [ ] Create `provider_kpi_summary_mv` materialized view
- [ ] Create `aging_analysis_mv` materialized view
- [ ] Create view refresh function

### Priority 3: Data Import (Phase 1, Milestone 1.3)
- [ ] Create CSV preprocessor script
- [ ] Create chunked upload API endpoint
- [ ] Test import with Therapy Partners data
- [ ] Verify 100% reconciliation

---

## Blockers

*No current blockers*

---

## Questions to Resolve

1. **Vercel Region**: Which region for optimal latency?
2. **Email Provider**: SendGrid, Resend, or other for alerts/reports?
3. **Mobile Strategy**: Responsive web or native app future consideration?

---

## Context Preservation Notes

### Key Files to Reference
- `/CLAUDE.md` - Critical rules and architecture
- `/EXECUTION_PLAN.md` - Detailed implementation plan
- `/PRD_Enhanced_Provider_Portal.md` - Business requirements
- `/TECHNICAL_SPECIFICATIONS.md` - Technical details
- `/DESIGN_SPECIFICATIONS.md` - UI/UX standards
- `/Suggestions/FINANCIAL-PLATFORM-REFERENCE.md` - Proven patterns

### Critical Rules Reminder
1. NO frontend calculations - all math in PostgreSQL
2. Use shared connection pool from `lib/db.ts`
3. Wrap Clerk components in Suspense
4. Test clean builds before deployment
5. Refresh materialized views after data changes
