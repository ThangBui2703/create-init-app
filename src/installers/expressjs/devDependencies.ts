import { execa } from "execa";

export type DevDependencies =
    | "husky"
    | "lint-staged"
    | "jest"
    | "@types/jest"
    | "ts-jest"
    | "typescript"
    | "ts-node"
    | "morgan"
    | "@types/express"
    | "@types/cors"
    | "@types/helmet"
    | "@types/dotenv"
    | "@types/morgan"
    | "nodemon"

export async function installDevDependencies(projectName: string, devDependencies: DevDependencies[]) {
    await execa(
        "npm",
        ["install", "-D", ...devDependencies],
        {
            cwd: projectName,
            stdio: "inherit",
        }
    );
}