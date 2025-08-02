import { productRepo } from "./repositories/product.repo";

async function main() {
  console.log("ORM is ready.");
  // const all = await productRepo.find();
  // console.log("Found products:", all);
}

main().catch((err) => {
  console.error("Unexpected error in main():", err);
  process.exit(1);
});
