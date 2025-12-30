import { Answers } from "./ask";
import { DB_PROVIDERS, DB_TOOLS, FRAMEWORKS } from "./enum";
import { setupExpressjs } from "./setup/expressjs";
import { setupNestjs } from "./setup/nestjs";
import { setupNextjs } from "./setup/nextjs";
import { setupReactTSRouter } from "./setup/reactTSRouter";

export async function createProject(answers: Answers) {
    const {
        projectName,
        framework,
        dbProvider,
        dbTool,
        uiLibrary,
        isNeverThrow,
    } = answers;

    switch (framework) {
        case FRAMEWORKS.NEXT: {
            await setupNextjs(projectName, dbProvider, dbTool, uiLibrary, isNeverThrow);
            break;
        }

        case FRAMEWORKS.NEXT_EXPRESS: {
            await Promise.all([
                setupNextjs(projectName + "-fe", DB_PROVIDERS.NONE, DB_TOOLS.NONE, uiLibrary, isNeverThrow),
                setupExpressjs(projectName + "-be", dbProvider, dbTool, isNeverThrow),
            ])

            break;
        }

        case FRAMEWORKS.NEXT_NEST: {
            await Promise.all([
                setupNextjs(projectName + "-fe", DB_PROVIDERS.NONE, DB_TOOLS.NONE, uiLibrary, isNeverThrow),
                setupNestjs(projectName + "-be", dbProvider,dbTool, isNeverThrow),
            ])
            break;
        }

        case FRAMEWORKS.REACT_EXPRESS: {
            await Promise.all([
                setupReactTSRouter(projectName + "-fe"),
                setupExpressjs(projectName + "-be", dbProvider, dbTool, isNeverThrow),
            ])
            break;
        }

        case FRAMEWORKS.REACT_NEST: {
            await Promise.all([
                setupReactTSRouter(projectName + "-fe"),
                setupNestjs(projectName + "-be", dbProvider, dbTool, isNeverThrow),
            ])
            break;
        }
    }
}