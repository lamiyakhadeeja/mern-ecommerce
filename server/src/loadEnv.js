import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
const repoRoot = path.join(serverRoot, "..");

function shouldSet(key) {
  const v = process.env[key];
  return v === undefined || v === "";
}

/**
 * Parse .env without relying on dotenv only — handles UTF-8 BOM and uses first "=" as separator
 * so MongoDB URIs with ?appName=... stay intact.
 */
function applyEnvContent(content) {
  let text = content;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && shouldSet(key) && value !== undefined) {
      process.env[key] = value;
    }
  }
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  applyEnvContent(content);
}

const candidates = [
  path.join(serverRoot, ".env"),
  path.join(repoRoot, ".env"),
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "server", ".env"),
];

const tried = [];
for (const p of candidates) {
  tried.push({ path: p, exists: fs.existsSync(p) });
  loadEnvFile(p);
}

if (!process.env.MONGODB_URI?.trim() && !process.env.MONGO_URI?.trim()) {
  console.error("[loadEnv] MONGODB_URI is still empty. Checked these files:");
  for (const t of tried) {
    console.error(`  ${t.exists ? "found " : "missing"} ${t.path}`);
  }
  console.error("[loadEnv] Save server/.env (UTF-8), ensure the line starts with MONGODB_URI= with no spaces before the name.");
}
