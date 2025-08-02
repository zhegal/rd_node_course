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

async function saveProduct() {
  console.log("➡️ Saving new product...");
  const product = await productRepo.save({
    name: "Test Product",
    price: 199,
  });
  console.log("✅ Saved:", product);
  return product;
}

async function fetchAllProducts() {
  console.log("➡️ Fetching all products...");
  const products = await productRepo.find();
  console.log("✅ Found:", products);
}

async function updateProduct(id: string) {
  console.log("➡️ Updating product...");
  const updated = await productRepo.update(id, { price: 299 });
  console.log("✅ Updated:", updated);
  return updated;
}

async function deleteProduct(id: string) {
  console.log("➡️ Deleting product...");
  await productRepo.delete(id);
  console.log("✅ Deleted:", id);
}

async function confirmDeletion(id: string) {
  console.log("➡️ Trying to fetch deleted product...");
  const result = await productRepo.findOne(id);
  console.log("✅ After delete:", result);
}

async function demo() {
  await createTableIfNotExists();

  const created = await saveProduct();
  await fetchAllProducts();
  await updateProduct(created.id);
  await deleteProduct(created.id);
  await confirmDeletion(created.id);
}

demo().catch((err) => {
  console.error("❌ Error in demo():", err);
  process.exit(1);
});
