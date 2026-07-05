CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | charged | failed
  amount_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
