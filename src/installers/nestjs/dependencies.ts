import { execa } from "execa";

export type Dependencies =
    | "@supabase/supabase-js"
    | "drizzle-orm"
    | "neverthrow"
    | "postgres"
    | "cookie-parser"
    | "helmet"
    | "@nestjs/config"
    | "@nestjs/swagger"
    | "class-transformer"
    | "class-validator"

export async function installDependencies(projectName: string, dependencies: Dependencies[]) {
    await execa(
        "npm",
        ["install", ...dependencies],
        {
            cwd: projectName,
            stdio: "inherit",
        }
    );
}