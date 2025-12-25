import { Answers } from "./ask";
import { DB_PROVIDERS, DB_TOOLS, FRAMEWORKS } from "./enum";
import { createExpressApp } from "./installers/expressjs";
import { createNestApp } from "./installers/nestjs";
import { createReactApp } from "./installers/react";
import { setupExpressjs } from "./setup/expressjs";
import { setupNextjs } from "./setup/nextjs";

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
            await setupNextjs(projectName + "-fe", DB_PROVIDERS.NONE, DB_TOOLS.NONE, uiLibrary, isNeverThrow);
            createNestApp(projectName + "-be");
            break;
        }

        case FRAMEWORKS.REACT_EXPRESS: {
            createReactApp(projectName + "-fe");
            createExpressApp(projectName + "-be");
            break;
        }

        case FRAMEWORKS.REACT_NEST: {
            createReactApp(projectName + "-fe");
            createNestApp(projectName + "-be");
            break;
        }
    }
}