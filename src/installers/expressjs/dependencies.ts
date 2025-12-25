import { execa } from "execa";

export type Dependencies =
    | "zod"
    | "@supabase/supabase-js"
    | "drizzle-orm"
    | "neverthrow"
    | "postgres"
    | "cookie-parser"
    | "cors"
    | "dotenv"
    | "express"
    | "helmet"
    | "morgan"
    | "swagger-ui-express"

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