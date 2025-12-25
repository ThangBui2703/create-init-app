import { execa } from "execa";

export type DevDependencies =
    | "husky"
    | "lint-staged"
    | "jest"
    | "ts-jest"
    | "typescript"
    | "ts-node"
    | "@types/express"
    | "@types/cors"
    | "@types/helmet"
    | "@types/dotenv"
    | "@types/morgan"
    | "nodemon"
    | "@biomejs/biome"
    | "@types/cookie-parser"
    | "@types/jest"
    | "@types/swagger-ui-express"
    | "drizzle-kit"

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