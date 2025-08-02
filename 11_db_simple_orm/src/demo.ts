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

async function createProduct() {
  console.log("➡️ Creating product...");
  const product = await productRepo.save({
    name: "Test Product",
    price: 199,
  });
  console.log("✅ Created product:", product);
  return product;
}

async function fetchAllProducts() {
  console.log("➡️ Fetching all products...");
  const products = await productRepo.find();
  console.log("✅ Found products:", products);
  return products;
}

async function fetchOneProduct(id: string) {
  console.log("➡️ Fetching one product...");
  const product = await productRepo.findOne(id);
  console.log("✅ Found one:", product);
  return product;
}

async function updateProduct(id: string) {
  console.log("➡️ Updating product...");
  const updated = await productRepo.update(id, { price: 299 });
  console.log("✅ Updated product:", updated);
  return updated;
}

async function deleteRandomProduct() {
  console.log("➡️ Fetching all products before deletion...");
  const products = await productRepo.find();

  if (products.length === 0) {
    console.log("ℹ️ No products to delete.");
    return;
  }

  const random = products[Math.floor(Math.random() * products.length)];
  console.log("➡️ Deleting random product:", random.id);
  await productRepo.delete(random.id);
  console.log("✅ Deleted product:", random.id);

  console.log("➡️ Confirming deletion...");
  const afterDelete = await productRepo.findOne(random.id);
  console.log("✅ After delete:", afterDelete);
}

async function demo() {
  await createTableIfNotExists();

  const created = await createProduct();
  await fetchAllProducts();
  await fetchOneProduct(created.id);
  await updateProduct(created.id);
  await deleteRandomProduct();
}

demo().catch((err) => {
  console.error("❌ Error in demo():", err);
  process.exit(1);
});
