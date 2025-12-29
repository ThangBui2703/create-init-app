import { setupDockerPostgres, setupHuskyLintStaged } from "../configs";
import { configBiome, configDrizzle, configSupabaseClient, configSupabaseLocal } from "../configs/nestjs";
import { DB_PROVIDERS, DB_TOOLS } from "../enum";
import { type Dependencies, type DevDependencies, installDependencies, installDevDependencies } from "../installers/nestjs";
import { createNestApp } from "../installers/nestjs";

export async function setupNestjs(projectName: string, dbProvider: DB_PROVIDERS, dbTool: DB_TOOLS, isNeverThrow: boolean) {
    await createNestApp(projectName);
    const dependencies: Dependencies[] = [
       "@nestjs/config",
       "@nestjs/swagger",
        "class-transformer",
        "class-validator",
        "cookie-parser",
        "helmet",
    ]
    const devDependencies: DevDependencies[] = [
        "@biomejs/biome",
        "@types/cookie-parser",
        "husky",
        "lint-staged",
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

}