import { Answers } from "./ask";
import { DB_PROVIDERS, DB_TOOLS, FRAMEWORKS, UI_LIB } from "./enum";
import {
    createNextApp,
    createNextExpressApp,
    createNestApp,
    createReactApp,
    installDependencies,
    installDevDependencies,
    Dependencies,
} from "./installers";
import { DevDependencies } from "./installers/devDependencies";
import { setupBiome, setupHuskyLintStaged, setupNextEnv, setupNextSupabaseClient, setupNextSupabaseLocal, setupShadcn, setupJest } from "./setups";

export async function createProject(answers: Answers) {
    const {
        projectName,
        framework,
        dbProvider,
        dbTool,
        uiLibrary,
        useMonorepo
    } = answers;

    switch (framework) {
        case FRAMEWORKS.NEXT: {
            await createNextApp(projectName);
            const isSupabase = dbProvider === DB_PROVIDERS.SUPABASE;
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
            if (isSupabase) {
                dependencies.push("@supabase/ssr", "@supabase/supabase-js");
            }
            if (dbTool === DB_TOOLS.DRIZZLE_ORM) {
                dependencies.push("drizzle-orm", "postgres");
                devDependencies.push("drizzle-kit");
            }
            await installDependencies(projectName, dependencies);
            await installDevDependencies(projectName, devDependencies);

            await setupHuskyLintStaged(projectName);
            await setupNextEnv(projectName, isSupabase);
            if (isSupabase) {
                await setupNextSupabaseClient(projectName);
            }
            if (dbTool === DB_TOOLS.SUPABASE_JS_SDK) {
                await setupNextSupabaseLocal(projectName);
            }

            if (uiLibrary === UI_LIB.SHADCN) {
                await setupShadcn(projectName);
            }
            await setupBiome(projectName, uiLibrary === UI_LIB.SHADCN);
            await setupJest(projectName);
            break;
        }

        case FRAMEWORKS.NEXT_EXPRESS: {
            createNextApp(projectName + "-fe");
            createNextExpressApp(projectName + "-be");

            break;
        }

        case FRAMEWORKS.NEXT_NEST: {
            createNextApp(projectName + "-fe");
            createNestApp(projectName + "-be");
            break;
        }

        case FRAMEWORKS.REACT_EXPRESS: {
            createReactApp(projectName + "-fe");
            createNextExpressApp(projectName + "-be");
            break;
        }

        case FRAMEWORKS.REACT_NEST: {
            createReactApp(projectName + "-fe");
            createNestApp(projectName + "-be");
            break;
        }
    }
}