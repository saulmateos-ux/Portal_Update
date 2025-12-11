# Bugs & Issues Log

## Active Issues

*No active issues - project in planning phase*

---

## Resolved Issues

*No resolved issues yet*

---

## Known Risks (From Reference Architecture)

### Risk: Clerk SSR Build Failures
- **Symptom**: Build fails with "useContext" or hydration errors
- **Cause**: Clerk components require React context not available during SSR build
- **Prevention**: Always wrap Clerk components in Suspense boundaries
- **Solution**:
```typescript
// Always use Suspense
<Suspense fallback={<Loading />}>
  <UserButton />
</Suspense>

// Mark layouts as dynamic
export const dynamic = 'force-dynamic';
```

### Risk: Connection Pool Exhaustion
- **Symptom**: Database timeouts, "too many connections" errors
- **Cause**: Creating Pool instances in individual API routes
- **Prevention**: Use singleton pool from `lib/db.ts`
- **Solution**: Import from shared pool, never create new Pool()

### Risk: Missing Index Performance Degradation
- **Symptom**: Queries timing out (10+ minutes)
- **Cause**: JOINs without indexes cause Sequential Scans
- **Prevention**: Always run EXPLAIN ANALYZE before deploying queries
- **Solution**: CREATE INDEX CONCURRENTLY on JOIN columns

### Risk: Materialized View Staleness
- **Symptom**: Dashboard shows outdated data
- **Cause**: Views not refreshed after data import
- **Prevention**: Always refresh views after any data change
- **Solution**: Run `refresh_all_materialized_views()` after imports

---

## Bug Report Template

### [BUG-XXX] - [Short Description]
- **Discovered**: [Date]
- **Severity**: Critical / High / Medium / Low
- **Status**: Open / In Progress / Resolved
- **Symptoms**: What the user sees
- **Root Cause**: What caused the issue
- **Steps to Reproduce**:
  1. Step 1
  2. Step 2
- **Solution**: How it was fixed
- **Files Changed**: List of files
- **Prevention**: How to prevent recurrence
