# Testing Checklist — AI Task Management SaaS

## Day 4 — AI Summary UI Tests

| Test | Result | Notes |
|---|---|---|
| Generate Summary loading state | PASS | Button disabled while generating |
| Summary output | PASS | Summary, 3 numbered steps, generated timestamp, Regenerate button |
| Empty account validation | PASS | Shows "Add some tasks first, then try again." |
| Network error handling | PASS | Shows a connection error when Wi-Fi is off |
| Mobile viewport layout | PASS | Layout works on a phone-sized viewport |

## Day 5 — Security and Quality Tests

### Dependency Audit
- PASS: `npm audit --omit=dev` reported 0 vulnerabilities.
- NOTE: High-severity findings were in development dependencies; do not use `npm audit fix --force` without reviewing breaking changes.

### Database Validation
- PASS: Invalid priority (`urgent`) rejected by the database constraint.
- PASS: Title longer than 100 characters rejected.
- PASS: Whitespace-only title rejected.

### Row-Level Security (RLS)
- PASS: User B could not read User A's tasks.
- PASS: User B could not update User A's tasks.
- PASS: User B could not delete User A's tasks.
- NOTE: Update and delete isolation checks were run inside transactions and rolled back.

### Responsive and Accessibility Checks
- PASS: Mobile layout checked at 320px, 375px, and 768px.
- PASS: Keyboard navigation and visible focus checked.
- PASS: No issues reported during manual checks.

## Testing Limitations
- These results reflect the manual checks performed so far.
- Production deployment and production-environment testing are not covered here.
