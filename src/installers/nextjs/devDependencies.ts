import { execa } from "execa";

export type DevDependencies =
    | "husky"
    | "lint-staged"
    | "drizzle-kit"
    | "jest"
    | "@types/jest"
    | "ts-jest"


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