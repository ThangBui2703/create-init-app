import { Answers } from "./ask";
import { FRAMEWORKS } from "./enum";
import { createExpressApp } from "./installers/expressjs";
import { createNestApp } from "./installers/nestjs";
import { createNextApp } from "./installers/nextjs";
import { createReactApp } from "./installers/react";

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
            createNextApp(projectName + "-fe");
            createExpressApp(projectName + "-be");

            break;
        }

        case FRAMEWORKS.NEXT_NEST: {
            createNextApp(projectName + "-fe");
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