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
  console.log("➡️ Fetching all products...");
  const all = await productRepo.find();
  console.log("✅ Found products:", all);
  console.log("➡️ Fetching one product...");
  const one = await productRepo.findOne(created.id);
  console.log("✅ Found one:", one);
}

demo().catch((err) => {
  console.error("❌ Error in demo():", err);
  process.exit(1);
});
