import { Injectable, OnModuleInit } from "@nestjs/common";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(__dirname, "../../data");
const STORE_FILE = join(DATA_DIR, "store.json");

@Injectable()
export class Store implements OnModuleInit {
  private data: Record<string, unknown[]> = {};

  async onModuleInit() {
    await mkdir(DATA_DIR, { recursive: true });
    try {
      const raw = await readFile(STORE_FILE, "utf-8");
      this.data = JSON.parse(raw);
    } catch {
      this.data = {};
    }
  }

  private async save() {
    await writeFile(STORE_FILE, JSON.stringify(this.data, null, 2));
  }

  async add<T extends { id: string }>(
    key: string,
    item: Omit<T, "id">
  ): Promise<T> {
    const full: T = { ...item, id: randomUUID() } as T;
    if (!Array.isArray(this.data[key])) this.data[key] = [];
    (this.data[key] as T[]).push(full);
    await this.save();
    return full;
  }

  async set<T>(key: string, list: T[]): Promise<void> {
    this.data[key] = list;
    await this.save();
  }

  async list<T>(key: string): Promise<T[]> {
    const raw = await readFile(STORE_FILE, "utf-8");
    this.data = JSON.parse(raw);
    return (this.data[key] as T[]) || [];
  }

  async find<T>(
    key: string,
    predicate: (item: T) => boolean
  ): Promise<T | undefined> {
    const list = await this.list<T>(key);
    return list.find(predicate);
  }
}
