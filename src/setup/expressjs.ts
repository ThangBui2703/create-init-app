import { execa } from "execa";

export type Dependencies =
    | "express"
    | "cors"
    | "helmet"
    | "dotenv"
    | "@supabase/ssr"
    | "@supabase/supabase-js"
    | "drizzle-orm"
    | "neverthrow"
    | "postgres"
    | "body-parser"
    | "cookie-parser"
    | "jsonwebtoken"
    | "bcryptjs"
    | "multer"

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