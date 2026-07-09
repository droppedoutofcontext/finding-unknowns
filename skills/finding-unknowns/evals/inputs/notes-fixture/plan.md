# Plan: add rate limiting to the API

Agreed with the team last sprint:

1. Config lives in `config/settings.json`. Add a `rateLimit` block:
   `{ "windowMs": 60000, "max": 100 }`.
2. Persist per-client request counters in the `request_counts` table via our
   ORM, keyed by client id + window start. We need counters to survive
   restarts.
3. Implement middleware in `src/middleware/rateLimit.js`; wire it into the
   chain in `src/server.js` before the route handlers.
4. When a client exceeds the limit, respond `429` with a `Retry-After`
   header (seconds until the window resets).
5. Log limit hits through the existing logger.
