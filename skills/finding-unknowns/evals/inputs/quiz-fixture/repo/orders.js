const db = require('./db');

const MAX_ATTEMPTS = 3;

async function chargeWithRetry(order) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await chargeProvider(order);
    } catch (err) {
      lastErr = err;
      await sleep(1000); // fixed 1s between attempts, retries everything
    }
  }
  throw lastErr;
}

async function processOrder(orderId) {
  const order = await db.one('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (order.status !== 'pending') return { skipped: true };
  const receipt = await chargeWithRetry(order);
  await db.none('UPDATE orders SET status = $1 WHERE id = $2', ['charged', orderId]);
  return { receipt };
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
async function chargeProvider(order) { /* calls payment provider */ }

module.exports = { processOrder, chargeWithRetry };
