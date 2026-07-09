const db = require('./db');
const { processOrder } = require('./orders');

// polls every 5s; many instances run in parallel behind a lock
async function tick() {
  const rows = await db.any(
    "SELECT id FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50",
  );
  for (const row of rows) {
    try {
      await processOrder(row.id);
    } catch (err) {
      await db.none('UPDATE orders SET status = $1 WHERE id = $2', ['failed', row.id]);
    }
  }
}

setInterval(tick, 5000);
