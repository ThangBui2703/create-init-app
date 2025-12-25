import { DB_PROVIDERS, DB_TOOLS, UI_LIB } from "../enum";
import { setupBiome, setupHuskyLintStaged, setupEnv, setupSupabaseClient, setupSupabaseLocal, setupShadcn, setupJest, setupDrizzle, setupDockerPostgres } from "../configs";
import { createNextApp, Dependencies, DevDependencies, installDependencies, installDevDependencies } from "../installers/nextjs";

export async function setupNextjs(projectName: string, dbProvider: DB_PROVIDERS, dbTool: DB_TOOLS, uiLibrary: UI_LIB, isNeverThrow: boolean) {
    await createNextApp(projectName);
    const dependencies: Dependencies[] = [
        "react-hook-form",
        "@hookform/resolvers",
        "zod",
        "server-only",
    ]
    const devDependencies: DevDependencies[] = [
        "husky",
        "lint-staged",
        "jest",
        "@types/jest",
        "ts-jest",
    ]
    if (dbProvider === DB_PROVIDERS.SUPABASE) {
        dependencies.push("@supabase/ssr", "@supabase/supabase-js");
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
    await setupEnv(projectName, dbProvider === DB_PROVIDERS.SUPABASE);

    if (dbProvider === DB_PROVIDERS.SUPABASE) {
        await setupSupabaseClient(projectName);
    }

    if (dbProvider === DB_PROVIDERS.DOCKER) {
        await setupDockerPostgres(projectName);
    }

    if (dbTool === DB_TOOLS.SUPABASE_JS_SDK) {
        await setupSupabaseLocal(projectName);
    }

    if (dbTool === DB_TOOLS.DRIZZLE_ORM) {
        await setupDrizzle(projectName);
    }

    if (uiLibrary === UI_LIB.SHADCN) {
        await setupShadcn(projectName);
    }

    await setupBiome(projectName, uiLibrary === UI_LIB.SHADCN);
    await setupJest(projectName);
}