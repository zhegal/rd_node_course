import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbFileName = "database.json";

const dbPath = join(__dirname, "..", dbFileName);

export class Database {
  constructor(path = dbPath) {
    this.path = path;
    this.ensureFile();
    this.database = JSON.parse(fs.readFileSync(this.path, "utf-8"));
  }

  ensureFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]), "utf-8");
    }
  }

  get() {
    return this.database;
  }

  save(data = this.database) {
    this.database = data;
    fs.writeFileSync(
      this.path,
      JSON.stringify(this.database, null, 2),
      "utf-8"
    );
  }
}
