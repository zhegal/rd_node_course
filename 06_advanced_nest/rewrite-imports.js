import { promises as fs } from "fs";
import path from "path";

const ROOT = "dist";
const importExportRegex = /(import|export)\s+(.*?)from\s+['"](.+?)['"]/g;

async function pathIsDirWithIndexJs(baseDir, importPath) {
    const abs = path.resolve(baseDir, importPath);
    try {
        const stat = await fs.stat(abs);
        if (!stat.isDirectory()) return false;
        await fs.access(path.join(abs, "index.js"));
        return true;
    } catch {
        return false;
    }
}

async function rewriteFile(filePath) {
    const dir = path.dirname(filePath);
    let content = await fs.readFile(filePath, "utf8");

    const replacements = [];

    for (const match of content.matchAll(importExportRegex)) {
        const [full, stmt, what, importPath] = match;

        if (!importPath.startsWith(".") && !importPath.startsWith("/")) continue;

        let newImportPath = importPath;

        const isDir = await pathIsDirWithIndexJs(dir, importPath);
        if (isDir) {
            newImportPath = importPath.replace(/\/+$/, "") + "/index.js";
        } else if (!/\.(js|json|ts)$/.test(importPath)) {
            newImportPath += ".js";
        }

        const updated = `${stmt} ${what} from "${newImportPath}"`;
        replacements.push({ original: full, updated });
    }

    for (const { original, updated } of replacements) {
        content = content.replace(original, updated);
    }

    await fs.writeFile(filePath, content, "utf8");
}

async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await processDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            await rewriteFile(fullPath);
        }
    }
}

await processDir(ROOT);
