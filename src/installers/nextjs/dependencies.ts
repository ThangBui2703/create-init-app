import { execa } from "execa";

export type Dependencies =
    | "server-only"
    | "zod"
    | "react-hook-form"
    | "@hookform/resolvers"
    | "@supabase/ssr"
    | "@supabase/supabase-js"
    | "drizzle-orm"
    | "neverthrow"
    | "postgres"

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