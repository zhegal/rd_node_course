import { Pool } from "pg";

export class Orm<T extends { id: string | number }> {
  constructor(private table: string, private pool: Pool) {}

  async find() {}

  async findOne() {}

  async save() {}

  async update() {}

  async delete() {}
}
