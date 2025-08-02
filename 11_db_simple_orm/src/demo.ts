import { productRepo, pool } from "./repositories/product.repo";

async function createTableIfNotExists() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      price INTEGER NOT NULL
    );
  `);
}

async function demo() {
  await createTableIfNotExists();

  console.log("➡️ Creating product...");
  const created = await productRepo.save({
    name: "Test Product",
    price: 199,
  });
  console.log("✅ Created product:", created);
}

demo().catch((err) => {
  console.error("❌ Error in demo():", err);
  process.exit(1);
});
