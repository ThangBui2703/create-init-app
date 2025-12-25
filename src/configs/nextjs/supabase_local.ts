import { execa } from "execa";
import path from "path";
import fs from "fs-extra";

export async function setupSupabaseLocal(projectDir: string) {
    execa("npx", ["supabase", "init"], {
        cwd: projectDir,
        stdio: "inherit"
    });

    const migrationsDir = path.join(projectDir, "supabase", "migrations");
    const schemaDir = path.join(projectDir, "supabase", "schemas");
    const dbDir = path.join(schemaDir, "db");
    const storageDir = path.join(schemaDir, "storage");

    await Promise.all([
        fs.ensureDir(migrationsDir),
        fs.ensureDir(schemaDir),
    ]);

    await Promise.all([
        fs.ensureDir(dbDir),
        fs.ensureDir(storageDir),
    ]);
}