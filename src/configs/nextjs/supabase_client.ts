import path from "path";
import fs from "fs-extra";

export async function setupSupabaseClient(projectDir: string) {
  const supabaseDir = path.join(projectDir, "src", "lib", "supabase");
  await fs.ensureDir(supabaseDir);

  const supabaseClientPath = path.join(supabaseDir, "client.ts");
  const supabaseServerPath = path.join(supabaseDir, "server.ts");
  const supabaseAdminPath = path.join(supabaseDir, "admin.ts");

  await Promise.all([
    fs.writeFile(supabaseClientPath, supabaseClientTemplate),
    fs.writeFile(supabaseServerPath, supabaseServerTemplate),
    fs.writeFile(supabaseAdminPath, supabaseAdminTemplate),
  ]);

}

const supabaseClientTemplate = `import { createBrowserClient } from "@supabase/ssr";
import { sharedEnv } from "../../../env.shared";

export function createClient() {
  return createBrowserClient(sharedEnv.NEXT_PUBLIC_APP_URL, sharedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
`.trimStart()

const supabaseServerTemplate = `import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sharedEnv } from "../../../env.shared";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    sharedEnv.NEXT_PUBLIC_SUPABASE_URL,
    sharedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The 'setAll' method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
`.trimStart()

const supabaseAdminTemplate = `import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/backend/env.server";
import { sharedEnv } from "../../../env.shared";
export function createAdminClient() {
  return createClient(
    sharedEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
`.trimStart()