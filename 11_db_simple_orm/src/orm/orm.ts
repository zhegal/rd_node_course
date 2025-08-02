import { Pool } from "pg";

export class Orm<T extends { id: string | number }> {
  constructor(private table: string, private pool: Pool) {}

  async find(): Promise<T[]> {
    const result = await this.pool.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async findOne(id: T["id"]): Promise<T | null> {
    const result = await this.pool.query(
      `SELECT * FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

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

  async update(id: T["id"], patch: Partial<T>): Promise<T> {
    const keys = Object.keys(patch);
    const values = Object.values(patch);

    if (keys.length === 0) {
      throw new Error("Patch object must have at least one field");
    }

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE ${this.table} SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    const result = await this.pool.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id: T["id"]): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }
}
