import path from "path";
import fs from "fs-extra";

export async function configSupabaseClient(projectName: string) {
    const supabaseDir = path.join(projectName, "src", "db", "supabase");
    await fs.ensureDir(supabaseDir);

    const supabaseClientPath = path.join(supabaseDir, "client.ts");
    const supabaseAdminPath = path.join(supabaseDir, "admin.ts");

    await Promise.all([
        fs.ensureFile(supabaseClientPath),
        fs.ensureFile(supabaseAdminPath),
    ]);

    await Promise.all([
        fs.writeFile(supabaseClientPath, supabaseClientTemplate),
        fs.writeFile(supabaseAdminPath, supabaseAdminTemplate),
    ]);
}

const supabaseClientTemplate = `import { createClient } from "@supabase/supabase-js";
import { env } from "../../env";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
export default supabase;
`;

const supabaseAdminTemplate = `import { createClient } from "@supabase/supabase-js";
import { env } from "../../env";

const supabaseAdmin = createClient(
	env.SUPABASE_URL,
	env.SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);
export default supabaseAdmin;
`;