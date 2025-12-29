import { execa } from "execa";

export type DevDependencies =
    | "@biomejs/biome"
    | "@types/cookie-parser"
    | "husky"
    | "lint-staged"
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