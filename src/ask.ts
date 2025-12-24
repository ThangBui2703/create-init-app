import inquirer from "inquirer";
import { DB_PROVIDERS, DB_TOOLS, FRAMEWORKS, UI_LIB } from "./enum";

const DB_TOOLS_MAP: Record<string, string[]> = {
    [DB_PROVIDERS.SUPABASE]: [DB_TOOLS.DRIZZLE_ORM, DB_TOOLS.SUPABASE_JS_SDK],
    [DB_PROVIDERS.DOCKER]: [DB_TOOLS.DRIZZLE_ORM],
};

export type Answers = {
    projectName: string;
    framework: string;
    dbProvider: string;
    dbTool: string;
    uiLibrary: string;
    useMonorepo: boolean;
};
export async function ask(): Promise<Answers> {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "What is your project name?",
            default: "my-app",
            validate(input: string) {
                if (!input.trim()) {
                    return "Project name cannot be empty";
                }

                if (input.includes(" ")) {
                    return "Project name cannot contain spaces";
                }

                if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
                    return "Project name can only contain letters, numbers, - and _";
                }

                return true;
            },
        },
        {
            type: "select",
            name: "framework",
            message: "What framework do you want to use?",
            choices: [
                { name: "Next.js", value: FRAMEWORKS.NEXT },
                { name: "Next.js + Express", value: FRAMEWORKS.NEXT_EXPRESS },
                { name: "React.js + Express", value: FRAMEWORKS.REACT_EXPRESS },
                { name: "Next.js + NestJS", value: FRAMEWORKS.NEXT_NEST },
                { name: "React.js + NestJS", value: FRAMEWORKS.REACT_NEST },
            ],
        },
        {
            type: "select",
            name: "dbProvider",
            message: "Which database provider do you want to use?",
            choices: [DB_PROVIDERS.SUPABASE, DB_PROVIDERS.DOCKER],
        },
        {
            type: "select",
            name: "dbTool",
            message: "Which tool do you want to use for database?",
            choices: (answers: Answers) => DB_TOOLS_MAP[answers.dbProvider],
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
        },
    ]);
    return answers;
}


