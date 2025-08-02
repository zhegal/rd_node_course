import { Pool } from "pg";

export class Orm<T extends { id: string | number }> {
  constructor(private table: string, private pool: Pool) {}

  async find() {}

  async findOne() {}

  async save(entity: Omit<T, "id">): Promise<T> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `INSERT INTO ${this.table} (${keys.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async update() {}

  async delete() {}
}
