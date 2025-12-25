import path from "path";
import fs from "fs-extra";

export async function configEnv(projectName: string, isSupabase: boolean = false) {
    const envPath = path.join(projectName, "src", "env.ts");
    await fs.ensureFile(envPath);
    await fs.writeFile(envPath, envTemplate(isSupabase));
}

const envTemplate = (isSupabase: boolean) => `import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	DATABASE_URL: z.string().min(1, "Database URL is required"),
	${isSupabase ? 'SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),' : ""}
	${isSupabase ? 'SUPABASE_URL: z.string().min(1, "Supabase URL is required"),' : ""}
	${isSupabase ? 'SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),' : ""}
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables:");
	console.error(JSON.stringify(parsed.error.format(), null, 2));
	throw new Error("Invalid environment variables");
}

export const env = parsed.data;
`.trimStart();