import { setupDockerPostgres, setupHuskyLintStaged } from "../configs";
import { configBiome, configDrizzle, configJest, configNodemon, configSupabaseClient, configSupabaseLocal, configTypescript } from "../configs/expressjs";
import { configEnv } from "../configs/expressjs/env";
import { DB_PROVIDERS, DB_TOOLS } from "../enum";
import { createExpressApp, Dependencies, DevDependencies, installDependencies, installDevDependencies } from "../installers/expressjs";

export async function setupExpressjs(projectName: string, dbProvider: DB_PROVIDERS, dbTool: DB_TOOLS, isNeverThrow: boolean) {
    await createExpressApp(projectName);
    const dependencies: Dependencies[] = [
        "cookie-parser",
        "cors",
        "dotenv",
        "drizzle-orm",
        "express",
        "helmet",
        "morgan",
        "swagger-ui-express",
        "zod",
    ]
    const devDependencies: DevDependencies[] = [
        "@biomejs/biome",
        "@types/cookie-parser",
        "@types/cors",
        "@types/dotenv",
        "@types/express",
        "@types/helmet",
        "@types/jest",
        "@types/morgan",
        "@types/swagger-ui-express",
        "husky",
        "jest",
        "lint-staged",
        "nodemon",
        "ts-jest",
        "ts-node",
        "typescript",
    ]

    if (dbProvider === DB_PROVIDERS.SUPABASE) {
        dependencies.push("@supabase/supabase-js");
    }
    if (dbTool === DB_TOOLS.DRIZZLE_ORM) {
        dependencies.push("drizzle-orm", "postgres");
        devDependencies.push("drizzle-kit");
    }
    if (isNeverThrow) {
        dependencies.push("neverthrow");
    }
    await installDependencies(projectName, dependencies);
    await installDevDependencies(projectName, devDependencies);
    await setupHuskyLintStaged(projectName);
    await configEnv(projectName, dbProvider === DB_PROVIDERS.SUPABASE);

    if (dbProvider === DB_PROVIDERS.DOCKER) {
        await setupDockerPostgres(projectName);
    }

    if (dbProvider === DB_PROVIDERS.SUPABASE) {
        await configSupabaseClient(projectName);
    }

    if (dbTool === DB_TOOLS.SUPABASE_JS_SDK) {
        await configSupabaseLocal(projectName);
    }

    if (dbTool === DB_TOOLS.DRIZZLE_ORM) {
        await configDrizzle(projectName);
    }

    await configBiome(projectName);
    await configJest(projectName);

    await configTypescript(projectName);
    await configNodemon(projectName);
}