import path from "path";
import fs from "fs-extra";
export async function configDrizzle(projectName: string) {
    const schemasDir = path.join(projectName, "src", "db", "schemas");
    const migrationsDir = path.join(projectName, "src", "db", "migrations");
    const drizzleConfigPath = path.join(projectName, "drizzle.config.ts");
    await Promise.all([
        fs.ensureDir(schemasDir),
        fs.ensureDir(migrationsDir),
        fs.ensureFile(drizzleConfigPath),
    ]);
    await fs.writeFile(drizzleConfigPath, drizzleConfigTemplate);

    const packageJsonPath = path.join(projectName, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.scripts["db:generate"] = "npx drizzle-kit generate --config=./drizzle.config.ts";
    packageJson.scripts["db:migrate"] = "npx drizzle-kit push --config=./drizzle.config.ts";
    packageJson.scripts["db:studio"] = "npx drizzle-kit studio --verbose --config=./drizzle.config.ts";
    packageJson.scripts["db:pull"] = "npx drizzle-kit pull --config=./drizzle.config.ts";
    packageJson.scripts["db:check"] = "npx drizzle-kit check --config=./drizzle.config.ts";
    await fs.writeJson(packageJsonPath, packageJson, {
        spaces: 2,
    });
}

const drizzleConfigTemplate = `import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schemas/*",
	out: "./src/db/migrations",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
`.trimStart();