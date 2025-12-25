import path from "path";
import fs from "fs-extra";
export async function setupDrizzle(projectName: string) {
  const schemasDir = path.join(projectName, "src", "backend", "db", "schemas");
  const migrationsDir = path.join(projectName, "src", "backend", "db", "migrations");
  const drizzleConfigPath = path.join(projectName, "src", "backend", "db", "drizzle.config.ts");
  await Promise.all([
    fs.ensureDir(schemasDir),
    fs.ensureDir(migrationsDir),
    fs.ensureFile(drizzleConfigPath),
  ]);
  await fs.writeFile(drizzleConfigPath, drizzleConfigTemplate);

  const packageJsonPath = path.join(projectName, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.scripts["db:generate"] = "npx drizzle-kit generate --config=./src/backend/db/drizzle.config.ts";
  packageJson.scripts["db:migrate"] = "npx drizzle-kit push --config=./src/backend/db/drizzle.config.ts";
  packageJson.scripts["db:studio"] = "npx drizzle-kit studio --verbose --config=./src/backend/db/drizzle.config.ts";
  packageJson.scripts["db:pull"] = "npx drizzle-kit pull --config=./src/backend/db/drizzle.config.ts";
  packageJson.scripts["db:check"] = "npx drizzle-kit check --config=./src/backend/db/drizzle.config.ts";
  await fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2,
  });
}

const drizzleConfigTemplate = `import "server-only";
import { defineConfig } from "drizzle-kit";
import { serverEnv } from "../env.server";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/backend/db/schemas/*",
  out: "./src/backend/db/migrations",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  verbose: true,
  strict: true
});
`.trimStart();