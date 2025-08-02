import { Pool } from "pg";
import { Orm } from "../orm/orm";

export interface Product {
  id: string;
  name: string;
  price: number;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const productRepo = new Orm<Product>("products", pool);
