import path from "path";
import fs from "fs-extra"

export async function setupNextEnv(projectName: string, isSupabase: boolean = false) {
  const sharedEnvPath = path.join(projectName, "env.shared.ts");
  const backendDir = path.join(projectName, "src", "backend");
  const serverEnvPath = path.join(backendDir, "env.server.ts");
  await fs.ensureDir(backendDir);
  await Promise.all([
    fs.ensureFile(sharedEnvPath),
    fs.ensureFile(serverEnvPath),
  ]);

  await Promise.all([
    fs.writeFile(sharedEnvPath, sharedEnvTemplate(isSupabase)),
    fs.writeFile(serverEnvPath, serverEnvTemplate(isSupabase)),
  ]);

}

const serverEnvTemplate = (isSupabase: boolean) => `import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  ${isSupabase ?
    'SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),' : ""
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables");
}

export const serverEnv = parsed.data;
`.trimStart()
const sharedEnvTemplate = (isSupabase: boolean) => `import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .url("Invalid app URL")
    .default("http://localhost:3000"),
  ${isSupabase ? 'NEXT_PUBLIC_SUPABASE_URL: z.url("Invalid Supabase URL"),' : "".trim()}
  ${isSupabase ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),' : ""}
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ${isSupabase ? 'NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,' : ""}
  ${isSupabase ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,' : ""}
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid environment variables");
}

export const sharedEnv = parsed.data;
`.trimStart()