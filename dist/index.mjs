#!/usr/bin/env node
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";

//#region src/enum/db_provider.ts
let DB_PROVIDERS = /* @__PURE__ */ function(DB_PROVIDERS$1) {
	DB_PROVIDERS$1["SUPABASE"] = "Supabase";
	DB_PROVIDERS$1["DOCKER"] = "Docker";
	return DB_PROVIDERS$1;
}({});

//#endregion
//#region src/enum/db_tools.ts
let DB_TOOLS = /* @__PURE__ */ function(DB_TOOLS$1) {
	DB_TOOLS$1["DRIZZLE_ORM"] = "Drizzle ORM";
	DB_TOOLS$1["SUPABASE_JS_SDK"] = "Supabase JS SDK";
	return DB_TOOLS$1;
}({});

//#endregion
//#region src/enum/framework.ts
let FRAMEWORKS = /* @__PURE__ */ function(FRAMEWORKS$1) {
	FRAMEWORKS$1["NEXT"] = "next";
	FRAMEWORKS$1["REACT"] = "react";
	FRAMEWORKS$1["NEXT_EXPRESS"] = "next-express";
	FRAMEWORKS$1["REACT_EXPRESS"] = "react-express";
	FRAMEWORKS$1["NEXT_NEST"] = "next-nest";
	FRAMEWORKS$1["REACT_NEST"] = "react-nest";
	return FRAMEWORKS$1;
}({});

//#endregion
//#region src/enum/ui_lib.ts
let UI_LIB = /* @__PURE__ */ function(UI_LIB$1) {
	UI_LIB$1["SHADCN"] = "shadcn";
	UI_LIB$1["HERO_UI_V3"] = "hero-ui-v3";
	return UI_LIB$1;
}({});

//#endregion
//#region src/installers/dependencies.ts
async function installDependencies(projectName, dependencies) {
	await execa("npm", ["install", ...dependencies], {
		cwd: projectName,
		stdio: "inherit"
	});
}

//#endregion
//#region src/installers/devDependencies.ts
async function installDevDependencies(projectName, devDependencies) {
	await execa("npm", [
		"install",
		"-D",
		...devDependencies
	], {
		cwd: projectName,
		stdio: "inherit"
	});
}

//#endregion
//#region src/installers/nexjs.ts
async function createNextApp(projectName) {
	await execa("npx", [
		"create-next-app@latest",
		projectName,
		"--ts",
		"--tailwind",
		"--react-compiler",
		"--biome",
		"--app",
		"--src-dir",
		"--import-alias",
		"@/*"
	], { stdio: "inherit" });
}

//#endregion
//#region src/installers/react.ts
async function createReactApp(projectName) {
	await execa("npm", [
		"create",
		"vite@latest",
		projectName,
		"--",
		"--template",
		"react"
	], { stdio: "inherit" });
}

//#endregion
//#region src/installers/expressjs.ts
async function createNextExpressApp(projectName) {
	await execa("npx", [
		"create-next-app@latest",
		projectName,
		"--use-npm"
	], { stdio: "inherit" });
}

//#endregion
//#region src/installers/nestjs.ts
async function createNestApp(projectName) {
	await execa("npx", [
		"@nestjs/cli",
		"new",
		projectName
	], { stdio: "inherit" });
}

//#endregion
//#region src/setups/husky_lint-staged.ts
async function setupHuskyLintStaged(projectName) {
	const preCommitPath = path.join(projectName, ".husky", "pre-commit");
	const prePushPath = path.join(projectName, ".husky", "pre-push");
	await Promise.all([fs.ensureFile(preCommitPath), fs.ensureFile(prePushPath)]);
	await Promise.all([fs.writeFile(preCommitPath, `npx lint-staged`), fs.writeFile(prePushPath, `npm run build`)]);
	const packageJsonPath = path.join(projectName, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	packageJson["lint-staged"] = { "*.{ts,tsx,js,jsx,json,css}": ["npm run format", "npm run lint"] };
	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

//#endregion
//#region src/setups/next_supabase_client.ts
async function setupNextSupabaseClient(projectDir) {
	const supabaseDir = path.join(projectDir, "src", "lib", "supabase");
	await fs.ensureDir(supabaseDir);
	const supabaseClientPath = path.join(supabaseDir, "client.ts");
	const supabaseServerPath = path.join(supabaseDir, "server.ts");
	const supabaseAdminPath = path.join(supabaseDir, "admin.ts");
	await Promise.all([
		fs.writeFile(supabaseClientPath, supabaseClientTemplate),
		fs.writeFile(supabaseServerPath, supabaseServerTemplate),
		fs.writeFile(supabaseAdminPath, supabaseAdminTemplate)
	]);
}
const supabaseClientTemplate = `import { createBrowserClient } from "@supabase/ssr";
import { sharedEnv } from "../../../env.shared";

export function createClient() {
  return createBrowserClient(sharedEnv.NEXT_PUBLIC_APP_URL, sharedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
`.trimStart();
const supabaseServerTemplate = `import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sharedEnv } from "../../../env.shared";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    sharedEnv.NEXT_PUBLIC_SUPABASE_URL,
    sharedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The 'setAll' method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
`.trimStart();
const supabaseAdminTemplate = `import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/backend/env.server";
import { sharedEnv } from "../../../env.shared";
export function createAdminClient() {
  return createClient(
    sharedEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
`.trimStart();

//#endregion
//#region src/setups/next_env.ts
async function setupNextEnv(projectName, isSupabase = false) {
	const sharedEnvPath = path.join(projectName, "env.shared.ts");
	const backendDir = path.join(projectName, "src", "backend");
	const serverEnvPath = path.join(backendDir, "env.server.ts");
	await fs.ensureDir(backendDir);
	await Promise.all([fs.ensureFile(sharedEnvPath), fs.ensureFile(serverEnvPath)]);
	await Promise.all([fs.writeFile(sharedEnvPath, sharedEnvTemplate(isSupabase)), fs.writeFile(serverEnvPath, serverEnvTemplate(isSupabase))]);
}
const serverEnvTemplate = (isSupabase) => `import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  ${isSupabase ? "SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, \"Supabase service role key is required\")," : ""}
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables");
}

export const serverEnv = parsed.data;
`.trimStart();
const sharedEnvTemplate = (isSupabase) => `import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .url("Invalid app URL")
    .default("http://localhost:3000"),
  ${isSupabase ? "NEXT_PUBLIC_SUPABASE_URL: z.url(\"Invalid Supabase URL\")," : "".trim()}
  ${isSupabase ? "NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, \"Supabase anon key is required\")," : ""}
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ${isSupabase ? "NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL," : ""}
  ${isSupabase ? "NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY," : ""}
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid environment variables");
}

export const sharedEnv = parsed.data;
`.trimStart();

//#endregion
//#region src/setups/drizzle.ts
async function setupDrizzle(projectName) {
	const schemasDir = path.join(projectName, "src", "backend", "db", "schemas");
	const migrationsDir = path.join(projectName, "src", "backend", "db", "migrations");
	const drizzleConfigPath = path.join(projectName, "src", "backend", "db", "drizzle.config.ts");
	await Promise.all([
		fs.ensureDir(schemasDir),
		fs.ensureDir(migrationsDir),
		fs.ensureFile(drizzleConfigPath)
	]);
	await fs.writeFile(drizzleConfigPath, drizzleConfigTemplate);
	const packageJsonPath = path.join(projectName, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	packageJson.scripts["db:generate"] = "npx drizzle-kit generate --config=./src/backend/db/drizzle.config.ts";
	packageJson.scripts["db:migrate"] = "npx drizzle-kit push --config=./src/backend/db/drizzle.config.ts";
	packageJson.scripts["db:studio"] = "npx drizzle-kit studio --verbose --config=./src/backend/db/drizzle.config.ts";
	packageJson.scripts["db:pull"] = "npx drizzle-kit pull --config=./src/backend/db/drizzle.config.ts";
	packageJson.scripts["db:check"] = "npx drizzle-kit check --config=./src/backend/db/drizzle.config.ts";
	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
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
});
`.trimStart();

//#endregion
//#region src/setups/shadcn.ts
async function setupShadcn(projectName) {
	await execa("npx", [
		"shadcn@latest",
		"init",
		"dialog",
		"avatar",
		"button-group",
		"calendar",
		"card",
		"carousel",
		"chart",
		"checkbox",
		"drawer",
		"dropdown-menu",
		"input-group",
		"label",
		"pagination",
		"select",
		"sheet",
		"skeleton",
		"sonner",
		"spinner",
		"table",
		"textarea"
	], {
		cwd: projectName,
		stdio: "inherit"
	});
}

//#endregion
//#region src/setups/biome.ts
async function setupBiome(projectName, isShadcn) {
	const biomePath = path.join(projectName, "biome.json");
	const biomeConfig = await fs.readJson(biomePath);
	const ignoreFiles = [...biomeConfig.files.includes, "!**/app/globals.css"];
	if (isShadcn) ignoreFiles.push("!**/components/ui");
	biomeConfig.files.includes = ignoreFiles;
	await fs.writeJson(biomePath, biomeConfig, { spaces: 2 });
}

//#endregion
//#region src/setups/next_supabase_local.ts
async function setupNextSupabaseLocal(projectDir) {
	execa("npx", ["supabase", "init"], {
		cwd: projectDir,
		stdio: "inherit"
	});
	const migrationsDir = path.join(projectDir, "supabase", "migrations");
	const schemaDir = path.join(projectDir, "supabase", "schemas");
	const dbDir = path.join(schemaDir, "db");
	const storageDir = path.join(schemaDir, "storage");
	await Promise.all([fs.ensureDir(migrationsDir), fs.ensureDir(schemaDir)]);
	await Promise.all([fs.ensureDir(dbDir), fs.ensureDir(storageDir)]);
}

//#endregion
//#region src/setups/jest.ts
async function setupJest(projectName) {
	const jestConfigPath = path.join(projectName, "jest.config.ts");
	await fs.ensureFile(jestConfigPath);
	await fs.writeFile(jestConfigPath, jestConfigTemplate);
	const packageJsonPath = path.join(projectName, "package.json");
	const packageJson = await fs.readJson(packageJsonPath);
	packageJson.scripts["test:unit"] = "jest --testPathPatterns=unit";
	packageJson.scripts["test:integration"] = "jest --testPathPatterns=integration";
	await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
	const testUnitDir = path.join(projectName, "src", "backend", "test", "unit");
	const testIntegrationDir = path.join(projectName, "src", "backend", "test", "integration");
	await Promise.all([fs.ensureDir(testUnitDir), fs.ensureDir(testIntegrationDir)]);
}
const jestConfigTemplate = `import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};

export default config;
`.trimStart();

//#endregion
//#region src/setups/docker_postges.ts
async function setupDockerPostgres(projectName) {
	const dockerComposePath = path.join(projectName, "docker-compose.yml");
	await fs.ensureFile(dockerComposePath);
	await fs.writeFile(dockerComposePath, dockerComposeTemplate);
}
const dockerComposeTemplate = `
version: '3'
services:
  postgres:
    image: postgres:17
    ports:
    - 5432:5432
    environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
    - POSTGRES_DB=postgres
    volumes:
    - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
`;

//#endregion
//#region src/create.ts
async function createProject(answers) {
	const { projectName, framework, dbProvider, dbTool, uiLibrary, useMonorepo } = answers;
	switch (framework) {
		case FRAMEWORKS.NEXT: {
			await createNextApp(projectName);
			const dependencies = [
				"react-hook-form",
				"@hookform/resolvers",
				"zod",
				"server-only"
			];
			const devDependencies = [
				"husky",
				"lint-staged",
				"jest",
				"@types/jest",
				"ts-jest"
			];
			if (dbProvider === DB_PROVIDERS.SUPABASE) dependencies.push("@supabase/ssr", "@supabase/supabase-js");
			if (dbTool === DB_TOOLS.DRIZZLE_ORM) {
				dependencies.push("drizzle-orm", "postgres");
				devDependencies.push("drizzle-kit");
			}
			await installDependencies(projectName, dependencies);
			await installDevDependencies(projectName, devDependencies);
			await setupHuskyLintStaged(projectName);
			await setupNextEnv(projectName, dbProvider === DB_PROVIDERS.SUPABASE);
			if (dbProvider === DB_PROVIDERS.SUPABASE) await setupNextSupabaseClient(projectName);
			if (dbProvider === DB_PROVIDERS.DOCKER) await setupDockerPostgres(projectName);
			if (dbTool === DB_TOOLS.SUPABASE_JS_SDK) await setupNextSupabaseLocal(projectName);
			if (dbTool === DB_TOOLS.DRIZZLE_ORM) await setupDrizzle(projectName);
			if (uiLibrary === UI_LIB.SHADCN) await setupShadcn(projectName);
			await setupBiome(projectName, uiLibrary === UI_LIB.SHADCN);
			await setupJest(projectName);
			break;
		}
		case FRAMEWORKS.NEXT_EXPRESS:
			createNextApp(projectName + "-fe");
			createNextExpressApp(projectName + "-be");
			break;
		case FRAMEWORKS.NEXT_NEST:
			createNextApp(projectName + "-fe");
			createNestApp(projectName + "-be");
			break;
		case FRAMEWORKS.REACT_EXPRESS:
			createReactApp(projectName + "-fe");
			createNextExpressApp(projectName + "-be");
			break;
		case FRAMEWORKS.REACT_NEST:
			createReactApp(projectName + "-fe");
			createNestApp(projectName + "-be");
			break;
	}
}

//#endregion
//#region src/ask.ts
const DB_TOOLS_MAP = {
	[DB_PROVIDERS.SUPABASE]: [DB_TOOLS.DRIZZLE_ORM, DB_TOOLS.SUPABASE_JS_SDK],
	[DB_PROVIDERS.DOCKER]: [DB_TOOLS.DRIZZLE_ORM]
};
async function ask() {
	return await inquirer.prompt([
		{
			type: "input",
			name: "projectName",
			message: "What is your project name?",
			default: "my-app",
			validate(input) {
				if (!input.trim()) return "Project name cannot be empty";
				if (input.includes(" ")) return "Project name cannot contain spaces";
				if (!/^[a-zA-Z0-9-_]+$/.test(input)) return "Project name can only contain letters, numbers, - and _";
				return true;
			}
		},
		{
			type: "select",
			name: "framework",
			message: "What framework do you want to use?",
			choices: [
				{
					name: "Next.js",
					value: FRAMEWORKS.NEXT
				},
				{
					name: "Next.js + Express",
					value: FRAMEWORKS.NEXT_EXPRESS
				},
				{
					name: "React.js + Express",
					value: FRAMEWORKS.REACT_EXPRESS
				},
				{
					name: "Next.js + NestJS",
					value: FRAMEWORKS.NEXT_NEST
				},
				{
					name: "React.js + NestJS",
					value: FRAMEWORKS.REACT_NEST
				}
			]
		},
		{
			type: "select",
			name: "dbProvider",
			message: "Which database provider do you want to use?",
			choices: [DB_PROVIDERS.SUPABASE, DB_PROVIDERS.DOCKER]
		},
		{
			type: "select",
			name: "dbTool",
			message: "Which tool do you want to use for database?",
			choices: (answers) => DB_TOOLS_MAP[answers.dbProvider]
		},
		{
			type: "select",
			name: "uiLibrary",
			message: "Which UI library do you want to use?",
			choices: [UI_LIB.SHADCN, UI_LIB.HERO_UI_V3]
		},
		{
			type: "confirm",
			name: "useMonorepo",
			message: "Do you want to use monorepo?",
			default: true,
			when: (answers) => ![FRAMEWORKS.NEXT, FRAMEWORKS.REACT].includes(answers.framework)
		}
	]);
}

//#endregion
//#region src/index.ts
async function main() {
	await createProject(await ask());
}
main().catch((error) => {
	console.error("error:", error);
	process.exit(1);
});

//#endregion
export {  };