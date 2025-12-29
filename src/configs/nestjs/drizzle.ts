import path from "path";
import fs from "fs-extra";
export async function configDrizzle(projectName: string) {
    const schemasDir = path.join(projectName, "src", "drizzle", "schemas");
    const migrationsDir = path.join(projectName, "src", "drizzle", "migrations");
    const drizzleConfigPath = path.join(projectName, "drizzle.config.ts");
    const drizzleModulePath = path.join(projectName, "src", "drizzle", "drizzle.module.ts");
    await Promise.all([
        fs.ensureDir(schemasDir),
        fs.ensureDir(migrationsDir),
        fs.ensureFile(drizzleConfigPath),
        fs.ensureFile(drizzleModulePath),
    ]);
    await fs.writeFile(drizzleConfigPath, drizzleConfigTemplate);
    await fs.writeFile(drizzleModulePath, drizzleModuleTemplate);
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

const drizzleModuleTemplate = `import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { drizzle } from "drizzle-orm/postgres-js";

const DRIZZLE=Symbol("drizzle")
@Module({
    providers:[
        {
            provide: DRIZZLE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const databaseUrl = configService.get<string>("DATABASE_URL");
                if(!databaseUrl) {
                    throw new Error("DATABASE_URL is not set in the environment variables");
                }
                const client = postgres(databaseUrl);
                return drizzle({client});
            },
        }
    ],
    exports: [DRIZZLE],
})
export class DrizzleModule {
}
`.trimStart();