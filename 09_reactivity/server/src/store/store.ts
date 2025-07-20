import { Injectable, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "node:fs";
import { join } from "node:path";

type StoreData = Record<string, any>;

const STORE_PATH = join(process.cwd(), "data", "store.json");

@Injectable()
export class Store implements OnModuleInit {
  private data: StoreData = {};

  async onModuleInit() {
    try {
      await fs.mkdir(join(process.cwd(), "data"), { recursive: true });
      const raw = await fs.readFile(STORE_PATH, "utf-8");
      this.data = JSON.parse(raw);
    } catch {
      this.data = {};
      await this.save();
    }
  }

  private async save() {
    await fs.writeFile(STORE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
  }

  async get<T = any>(key: string): Promise<T[]> {
    return this.data[key] ?? [];
  }

  async push<T = any>(key: string, value: T): Promise<void> {
    if (!Array.isArray(this.data[key])) {
      this.data[key] = [];
    }
    this.data[key].push(value);
    await this.save();
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    this.data[key] = value;
    await this.save();
  }
}
